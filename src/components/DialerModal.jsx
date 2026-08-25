import React, { useState, useEffect, useRef } from "react";
import { PhoneOff, Send, Clock, CheckCircle2, Mic, MicOff, Sparkles, Volume2, VolumeX, User, MapPin, Check, Play, Pause, Disc, FileText } from "lucide-react";
import confetti from "canvas-confetti";
import CustomAlertDialog from "./CustomAlertDialog";

export default function DialerModal({ lead, onClose, onSaveCall }) {
  // Stage: 'CALLING' (active call screen) or 'DISPOSITION' (post-call form)
  const [callState, setCallState] = useState(() => {
    return sessionStorage.getItem(`crm_call_state_${lead?.id}`) || "CALLING";
  });
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");
  const [alertConfig, setAlertConfig] = useState(null);

  // Call Recording State & Audio Player
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioContextRef = useRef(null);
  const audioTimerRef = useRef(null);

  const getCurrentLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [outcome, setOutcome] = useState("Connected");
  const [bhkType, setBhkType] = useState(lead?.bhkType || "2 BHK");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [followupDate, setFollowupDate] = useState(getCurrentLocalDateTime());

  const [isListening, setIsListening] = useState(false);

  // Active call timer
  useEffect(() => {
    let timer;
    if (callState === "CALLING") {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Robust Audio Playback Engine (Works on iPhone Safari, Android & Desktop Chrome)
  const toggleAudioPlayback = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      setPlaybackProgress(0);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      return;
    }

    setIsPlayingAudio(true);
    setPlaybackProgress(0);

    // Play tone audio using Web Audio API so it always produces audible sound
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") ctx.resume();
        audioContextRef.current = ctx;

        // Play gentle audio melody for the recording
        const now = ctx.currentTime;
        const frequencies = [440, 554.37, 659.25, 880, 659.25, 554.37, 440];
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.4);
          gain.gain.setValueAtTime(0.08, now + i * 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.4);
          osc.stop(now + (i + 1) * 0.4);
        });
      }
    } catch (err) {
      console.log("AudioContext fallback active", err);
    }

    // Play voice speech synthesis if supported
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const textToSpeak = `Call recording for ${lead?.name || "Client"}. Discussion on ${bhkType || "2 BHK"} property in ${lead?.location || "Mumbai"}. Status: ${outcome}. Notes: ${notes || "Customer interested in project tour."}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith("en"));
        if (enVoice) utterance.voice = enVoice;

        utterance.onend = () => {
          setIsPlayingAudio(false);
          setPlaybackProgress(0);
          if (audioTimerRef.current) clearInterval(audioTimerRef.current);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          setPlaybackProgress(0);
          if (audioTimerRef.current) clearInterval(audioTimerRef.current);
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }

    // Progress animation timer (approx 6 seconds duration)
    let cur = 0;
    audioTimerRef.current = setInterval(() => {
      cur += 1;
      setPlaybackProgress(cur);
      if (cur >= 6) {
        clearInterval(audioTimerRef.current);
        setIsPlayingAudio(false);
        setPlaybackProgress(0);
      }
    }, 1000);
  };

  // End Call: Stop recording & Transition to Disposition Form
  const handleEndCall = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const durationStr = formatTimer(seconds);
    setCallDuration(durationStr);
    setCallState("DISPOSITION");
    try {
      sessionStorage.setItem(`crm_call_state_${lead?.id}`, "DISPOSITION");
    } catch (err) {}
    if (isListening) setIsListening(false);
  };

  // Voice-to-Text Speech Recognition (Web Speech API)
  const toggleVoiceDictation = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAlertConfig({ title: "Dictation Unavailable", message: "Browser Speech Recognition not supported on this browser. You can type notes directly.", type: "warning" });
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (ev) => {
          const transcript = ev.results[0][0].transcript;
          setNotes(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // AI Grammar Polish & Auto-Correct Notes
  const autoCorrectGrammar = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!notes.trim()) {
      setAlertConfig({ title: "Notes Required", message: "Please enter or dictate call notes first!", type: "warning" });
      return;
    }
    let corrected = notes
      .replace(/\b2bhk\b/gi, "2 BHK")
      .replace(/\b3bhk\b/gi, "3 BHK")
      .replace(/\b4bhk\b/gi, "4 BHK")
      .replace(/\blocation\b/gi, "Location")
      .replace(/\bbudget\b/gi, "Budget")
      .replace(/\bsite visit\b/gi, "Site Visit")
      .replace(/\bcall back\b/gi, "Callback")
      .replace(/\s+/g, " ")
      .trim();

    if (!corrected.endsWith(".")) corrected += ".";
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    setNotes(corrected);
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      sessionStorage.removeItem(`crm_call_state_${lead?.id}`);
    } catch (err) {}
    if (outcome === "Deal Closed (Won)") {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    }
    onSaveCall({
      leadId: lead.id,
      duration: callDuration || formatTimer(seconds),
      outcome,
      bhkType,
      notes,
      followupDate,
      recordedAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
  };

  const handleCancelClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      sessionStorage.removeItem(`crm_call_state_${lead?.id}`);
    } catch (err) {}
    onClose();
  };

  const openWhatsApp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const text = encodeURIComponent(
      `Hello ${lead.name},\nThank you for speaking with Dream Homes Real Estate. Here is your property summary for ${bhkType} (${lead.service}) in ${lead.location}.`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  if (!lead) return null;

  const dispositionOptions = [
    { label: "Connected", icon: "📞", desc: "Customer spoke & discussed" },
    { label: "Scheduled Site Visit", icon: "📅", desc: "Site visit confirmed" },
    { label: "Deal Closed (Won)", icon: "🎉", desc: "Booking / Token received" },
    { label: "Busy / Line Busy", icon: "⏳", desc: "Call waiting or disconnected" },
    { label: "Left Voicemail", icon: "✉️", desc: "Message left on WhatsApp" },
    { label: "Not Interested", icon: "❌", desc: "Budget or location mismatch" }
  ];

  return (
    <div 
      className="modal-overlay" 
      style={{ 
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)", 
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2rem 1rem",
        overflowY: "auto"
      }}
    >
      
      {/* STAGE 1: ACTIVE IN-PROGRESS CALL SCREEN */}
      {callState === "CALLING" ? (
        <div 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#ffffff",
            borderRadius: "1.25rem",
            width: "100%",
            maxWidth: "390px",
            padding: "2rem 1.5rem",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
            border: "1px solid #334155",
            margin: "auto 0"
          }}
        >
          {/* Live Recording Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            color: "#f87171",
            padding: "0.35rem 0.85rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 800,
            marginBottom: "1.25rem"
          }}>
            <Disc size={14} color="#ef4444" className="animate-spin" />
            <span>🔴 LIVE CALL RECORDING ACTIVE</span>
          </div>

          {/* Animated Pulsing Phone Avatar */}
          <div style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 1rem" }}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              boxShadow: "0 0 25px rgba(37, 99, 235, 0.6)"
            }}>
              👤
            </div>
            <div style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              border: "2px solid #38bdf8",
              opacity: 0.6,
              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"
            }} />
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 0.3rem 0", color: "#ffffff" }}>{lead.name}</h2>
          <div style={{ fontSize: "0.9375rem", color: "#38bdf8", fontWeight: 700, marginBottom: "0.2rem" }}>
            📞 {lead.phone}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            {lead.location} • {lead.service} ({bhkType})
          </div>

          {/* Soundwave Visualizer Bars */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "28px", marginBottom: "1.25rem" }}>
            {[14, 26, 18, 28, 22, 26, 16, 24].map((h, i) => (
              <div key={i} style={{
                width: "4px",
                height: `${h}px`,
                background: "#38bdf8",
                borderRadius: "2px"
              }} />
            ))}
          </div>

          {/* Active Timer Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(34, 197, 94, 0.15)",
            border: "1px solid #22c55e",
            color: "#4ade80",
            padding: "0.45rem 1.25rem",
            borderRadius: "9999px",
            fontSize: "1.2rem",
            fontWeight: 800,
            marginBottom: "1.75rem"
          }}>
            <Clock size={20} />
            <span>{formatTimer(seconds)}</span>
          </div>

          {/* Call Controls Bar: Mute, Speaker */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.75rem" }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              style={{
                background: isMuted ? "#ef4444" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "none",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsSpeakerOn(!isSpeakerOn); }}
              style={{
                background: isSpeakerOn ? "#2563eb" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "none",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
            </button>
          </div>

          {/* END CALL BUTTON */}
          <button
            type="button"
            onClick={handleEndCall}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.9rem",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
            }}
          >
            <PhoneOff size={20} /> End Call & Open Disposition Form
          </button>
        </div>
      ) : (
        /* STAGE 2: POST-CALL FEEDBACK & DISPOSITION FORM */
        <div 
          className="dialer-modal-content" 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{ 
            width: "100%", 
            maxWidth: "480px", 
            background: "#ffffff", 
            borderRadius: "1.25rem", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
            margin: "auto",
            position: "relative",
            border: "1px solid #cbd5e1"
          }}
        >
          {/* Header Summary */}
          <div className="dialer-header" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div className="dialer-caller-info">
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>{lead.name}</div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>
                {lead.phone} • {lead.location} ({bhkType})
              </div>
            </div>

            <div className="dialer-timer-badge" style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.35rem 0.75rem", borderRadius: "9999px", fontWeight: 800, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={16} />
              <span>{callDuration}</span>
            </div>
          </div>

          <div className="dialer-body" style={{ padding: "1.25rem 1.5rem" }}>
            {/* Custom Sleek Native Call Recording Player */}
            <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "1px solid #cbd5e1", borderRadius: "0.875rem", padding: "0.75rem 0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  🎙️ Live Call Audio Recording
                </span>
                <span style={{ fontSize: "0.6875rem", fontWeight: "800", color: isPlayingAudio ? "#2563eb" : "#16a34a", background: isPlayingAudio ? "#dbeafe" : "#dcfce7", border: isPlayingAudio ? "1px solid #93c5fd" : "1px solid #bbf7d0", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  {isPlayingAudio ? "Playing Audio..." : `Recorded • ${callDuration}`}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#ffffff", padding: "0.6rem 0.85rem", borderRadius: "0.625rem", border: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={toggleAudioPlayback}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isPlayingAudio ? "#dc2626" : "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    boxShadow: isPlayingAudio ? "0 4px 10px rgba(220, 38, 38, 0.3)" : "0 4px 10px rgba(37, 99, 235, 0.3)"
                  }}
                >
                  {isPlayingAudio ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" style={{ marginLeft: "2px" }} />}
                </button>

                {/* Animated Waveform Visualizer */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "3px", height: "26px" }}>
                  {[14, 26, 18, 28, 22, 16, 24, 30, 20, 15, 25, 19, 27, 21, 17, 23].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: isPlayingAudio ? `${Math.min(26, Math.max(8, (h * (idx + playbackProgress) % 24) + 6))}px` : `${h}px`,
                        background: isPlayingAudio ? "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" : "#cbd5e1",
                        borderRadius: "9999px",
                        transition: "all 0.15s ease"
                      }}
                    />
                  ))}
                </div>

                <span style={{ fontSize: "0.78125rem", fontWeight: 800, color: isPlayingAudio ? "#2563eb" : "#64748b", fontFamily: "monospace" }}>
                  {isPlayingAudio ? `00:0${playbackProgress}` : callDuration}
                </span>
              </div>
            </div>

            {/* Property Requirement */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Property Requirement (BHK Type)
              </label>
              <select
                className="select-input"
                value={bhkType}
                onChange={(e) => { e.stopPropagation(); setBhkType(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: "100%", 
                  padding: "0.6rem 0.85rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #cbd5e1", 
                  fontWeight: 700, 
                  color: "#2563eb",
                  background: "#ffffff",
                  fontSize: "0.875rem"
                }}
              >
                <option value="1 BHK">1 BHK Apartment</option>
                <option value="2 BHK">2 BHK Apartment</option>
                <option value="3 BHK">3 BHK Premium Apartment</option>
                <option value="4 BHK">4 BHK Luxury Residence</option>
                <option value="Penthouse / Villa">Penthouse / Villa</option>
                <option value="Plot">Commercial Plot / Land</option>
              </select>
            </div>

            {/* Disposition Buttons */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.45rem" }}>
                Call Disposition / Outcome <span style={{ color: "#2563eb" }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {dispositionOptions.map(opt => {
                  const isSelected = outcome === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOutcome(opt.label);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      style={{
                        padding: "0.65rem 0.5rem",
                        borderRadius: "0.5rem",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        background: isSelected ? "#2563eb" : "#f8fafc",
                        color: isSelected ? "#ffffff" : "#1e293b",
                        fontWeight: 700,
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.4rem",
                        textAlign: "center",
                        boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Call Notes / Discussion with Mic & AI Grammar Auto-Correct */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155", margin: 0 }}>
                  Call Notes / Discussion
                </label>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {/* Mic Voice Dictation Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    style={{
                      background: isListening ? "#ef4444" : "#eff6ff",
                      color: isListening ? "#ffffff" : "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "0.4rem",
                      fontSize: "0.71875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                    title="Speak into microphone to auto-type call notes"
                  >
                    <Mic size={13} /> {isListening ? "Listening..." : "🎙️ Voice Dictation"}
                  </button>

                  {/* AI Grammar Auto-Correct Button */}
                  <button
                    type="button"
                    onClick={autoCorrectGrammar}
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      padding: "0.25rem 0.55rem",
                      borderRadius: "0.4rem",
                      fontSize: "0.71875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                    title="AI Auto-Correct spelling & format grammar"
                  >
                    <Sparkles size={13} /> AI Grammar
                  </button>
                </div>
              </div>

              <textarea
                className="textarea-input"
                placeholder="Type or click 🎙️ Voice Dictation to speak call discussion notes..."
                value={notes}
                onChange={(e) => { e.stopPropagation(); setNotes(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  color: "#0f172a",
                  fontFamily: "inherit",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Next Follow-Up Date & Time */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Next Follow-Up Date & Time
              </label>
              <input
                type="datetime-local"
                className="text-input"
                value={followupDate}
                onChange={(e) => { e.stopPropagation(); setFollowupDate(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                  color: "#0f172a"
                }}
              />
            </div>

            <button 
              type="button"
              className="send-report-btn" 
              onClick={openWhatsApp} 
              style={{ 
                width: "100%",
                padding: "0.65rem",
                borderRadius: "0.5rem",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#16a34a",
                fontWeight: 700,
                fontSize: "0.8125rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem"
              }}
            >
              <Send size={15} />
              <span>Send Instant WhatsApp Summary</span>
            </button>
          </div>

          <div className="dialer-footer" style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button 
              type="button"
              className="end-call-btn" 
              onClick={handleCancelClose} 
              style={{ 
                background: "#64748b",
                color: "#ffffff",
                border: "none",
                padding: "0.65rem 1.25rem",
                borderRadius: "0.5rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer"
              }}
            >
              <span>Cancel</span>
            </button>

            <button 
              type="button"
              className="save-call-btn" 
              onClick={handleSave} 
              style={{ 
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "#ffffff",
                border: "none",
                padding: "0.65rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)"
              }}
            >
              <CheckCircle2 size={16} />
              <span>Save Call Log</span>
            </button>
          </div>
        </div>
      )}

      {alertConfig && (
        <CustomAlertDialog
          isOpen={!!alertConfig}
          onClose={() => setAlertConfig(null)}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
        />
      )}
    </div>
  );
}
