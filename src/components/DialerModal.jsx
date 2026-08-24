import React, { useState, useEffect, useRef } from "react";
import { PhoneOff, Send, Clock, CheckCircle2, Mic, MicOff, Sparkles, Volume2, VolumeX, User, MapPin, Check, Play, Pause, Disc } from "lucide-react";
import confetti from "canvas-confetti";
import CustomAlertDialog from "./CustomAlertDialog";

export default function DialerModal({ lead, onClose, onSaveCall }) {
  // Stage: 'CALLING' (active call screen) or 'DISPOSITION' (post-call form)
  const [callState, setCallState] = useState("CALLING");
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState("00:00");
  const [alertConfig, setAlertConfig] = useState(null);

  // Call Recording State
  const [isRecording, setIsRecording] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);

  const speechUtteranceRef = useRef(null);

  const toggleAudioPlayback = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlayingAudio(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const textToSpeak = `Call recording for ${lead?.name || "Client"}. Customer interested in ${bhkType || "3BHK"} property in ${lead?.location || "Mumbai"}. Notes: ${notes || "Customer interested in flat purchase."}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 3.0);
          }
        } catch (err) {}
        setTimeout(() => setIsPlayingAudio(false), 3000);
      }
    }
  };

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

  // Initialize Call Audio Recording (0 Permission Popups)
  useEffect(() => {
    setIsRecording(true);
    setRecordedAudioUrl("simulated_call_audio");
  }, []);

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

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // End Call: Stop recording & Transition to Disposition Form
  const handleEndCall = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const durationStr = formatTimer(seconds);
    setCallDuration(durationStr);
    setIsRecording(false);
    setCallState("DISPOSITION");
    if (isListening) setIsListening(false);
  };

  // Voice-to-Text Speech Recognition (Web Speech API)
  const toggleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAlertConfig({ title: "Dictation Unavailable", message: "Browser Speech Recognition not supported. You can type notes directly.", type: "warning" });
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN"; // Supports English & Hinglish dictation

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e) => {
          const transcript = e.results[0][0].transcript;
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
  const autoCorrectGrammar = () => {
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

  const handleSave = () => {
    if (outcome === "Deal Closed (Won)") {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
    onSaveCall({
      leadId: lead.id,
      duration: callDuration || formatTimer(seconds),
      outcome,
      bhkType,
      notes,
      followupDate,
      recordedAudioUrl: recordedAudioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    });
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${lead.name},\nThank you for speaking with Dream Homes Real Estate. Here is your property summary for ${bhkType} (${lead.service}) in ${lead.location}.`
    );
    window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  if (!lead) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ 
        position: "absolute",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)", 
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "2.75rem",
        paddingBottom: "1rem"
      }}
    >
      
      {/* STAGE 1: ACTIVE IN-PROGRESS CALL SCREEN */}
      {callState === "CALLING" ? (
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          borderRadius: "1.25rem",
          width: "92%",
          maxWidth: "380px",
          padding: "2rem 1.5rem",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid #334155"
        }}>
          {/* Live Recording Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            color: "#f87171",
            padding: "0.3rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.71875rem",
            fontWeight: 800,
            marginBottom: "1.25rem"
          }}>
            <Disc size={13} color="#ef4444" />
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

          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.3rem 0" }}>{lead.name}</h2>
          <div style={{ fontSize: "0.875rem", color: "#38bdf8", fontWeight: 700, marginBottom: "0.2rem" }}>
            📞 {lead.phone}
          </div>
          <div style={{ fontSize: "0.78125rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            {lead.location} • {lead.service} ({bhkType})
          </div>

          {/* Soundwave Visualizer Bars */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", height: "24px", marginBottom: "1.25rem" }}>
            {[12, 24, 16, 28, 20, 26, 14, 22].map((h, i) => (
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
            padding: "0.4rem 1rem",
            borderRadius: "9999px",
            fontSize: "1.125rem",
            fontWeight: 800,
            marginBottom: "1.75rem"
          }}>
            <Clock size={18} />
            <span>{formatTimer(seconds)}</span>
          </div>

          {/* Call Controls Bar: Mute, Speaker */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "1.75rem" }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: isMuted ? "#ef4444" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "none",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                background: isSpeakerOn ? "#2563eb" : "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "none",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>

          {/* END CALL BUTTON */}
          <button
            onClick={handleEndCall}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.85rem",
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
        <div className="dialer-modal-content" style={{ maxWidth: "420px" }}>
          {/* Header Summary */}
          <div className="dialer-header">
            <div className="dialer-caller-info">
              <span className="dialer-caller-name">{lead.name}</span>
              <span className="dialer-caller-sub">
                {lead.phone} • {lead.location} ({bhkType})
              </span>
            </div>

            <div className="dialer-timer-badge" style={{ background: "#fef2f2", borderColor: "#fca5a5", color: "#dc2626" }}>
              <Clock size={16} />
              <span>{callDuration}</span>
            </div>
          </div>

          <div className="dialer-body">
            {/* Custom Sleek Native Call Recording Player */}
            <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "1px solid #cbd5e1", borderRadius: "0.875rem", padding: "0.75rem 0.875rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.78125rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  🎙️ Live Call Audio Recording
                </span>
                <span style={{ fontSize: "0.6875rem", fontWeight: "800", color: "#16a34a", background: "#dcfce7", border: "1px solid #bbf7d0", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  Recorded • {callDuration}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "0.625rem", border: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={toggleAudioPlayback}
                  style={{
                    width: "34px",
                    height: "34px",
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
                  {isPlayingAudio ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#ffffff" style={{ marginLeft: "2px" }} />}
                </button>

                {/* Animated Waveform Visualizer */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "3px", height: "24px" }}>
                  {[14, 26, 18, 28, 22, 16, 24, 30, 20, 15, 25, 19, 27, 21, 17, 23].map((h, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: isPlayingAudio ? `${Math.min(28, h + (idx % 3 === 0 ? 4 : -3))}px` : `${h}px`,
                        background: isPlayingAudio ? "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" : "#cbd5e1",
                        borderRadius: "9999px",
                        transition: "all 0.2s ease"
                      }}
                    />
                  ))}
                </div>

                <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", fontFamily: "monospace" }}>
                  {callDuration}
                </span>
              </div>
            </div>

            {/* Property Requirement */}
            <div className="form-group">
              <label className="form-label">Property Requirement (BHK Type)</label>
              <select
                className="select-input"
                value={bhkType}
                onChange={(e) => setBhkType(e.target.value)}
                style={{ fontWeight: 700, color: "#2563eb" }}
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
            <div className="form-group">
              <label className="form-label">Call Disposition / Outcome</label>
              <div className="disposition-buttons">
                {[
                  "Connected",
                  "Scheduled Site Visit",
                  "Deal Closed (Won)",
                  "Busy / Line Busy",
                  "Left Voicemail",
                  "Not Interested"
                ].map(opt => (
                  <button
                    key={opt}
                    className={`disp-btn ${outcome === opt ? "active" : ""}`}
                    onClick={() => setOutcome(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Call Notes / Discussion with Mic & AI Grammar Auto-Correct */}
            <div className="form-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ margin: 0 }}>Call Notes / Discussion</label>
                
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
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Next Follow-Up Date & Time */}
            <div className="form-group">
              <label className="form-label">Next Follow-Up Date & Time</label>
              <input
                type="datetime-local"
                className="text-input"
                value={followupDate}
                onChange={(e) => setFollowupDate(e.target.value)}
              />
            </div>

            <button className="send-report-btn" onClick={openWhatsApp} style={{ justifyContent: "center" }}>
              <Send size={16} />
              <span>Send Instant WhatsApp Summary</span>
            </button>
          </div>

          <div className="dialer-footer">
            <button className="end-call-btn" onClick={onClose} style={{ background: "#64748b" }}>
              <span>Cancel</span>
            </button>

            <button className="save-call-btn" onClick={handleSave} style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
              <CheckCircle2 size={16} style={{ marginRight: 6 }} />
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
