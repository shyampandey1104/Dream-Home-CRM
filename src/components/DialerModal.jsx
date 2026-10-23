import React, { useState, useEffect, useRef } from "react";
import { 
  PhoneOff, Send, Clock, CheckCircle2, Mic, MicOff, Sparkles, Volume2, VolumeX, 
  User, MapPin, Check, Play, Pause, Disc, FileText, RotateCcw, Download,
  Grid, MoreHorizontal, Radio, Delete, ChevronDown, PhoneCall, Phone, Info,
  Signal, Wifi, Battery, ExternalLink, ClipboardList
} from "lucide-react";
import confetti from "canvas-confetti";
import { UniversalAudioRecorder } from "../utils/audioRecorder";
import CustomAlertDialog from "./CustomAlertDialog";
import { triggerExotelClickToCall } from "../services/apiService";

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

  // iOS Phone & Dialer State
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState("");
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [isCallingExotel, setIsCallingExotel] = useState(false);
  const [exotelStatusMsg, setExotelStatusMsg] = useState("");

  // Audio Recorder State
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState(null);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [liveVolume, setLiveVolume] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const recorderRef = useRef(null);
  const audioElementRef = useRef(null);
  const volumeIntervalRef = useRef(null);

  const getCurrentLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [outcome, setOutcome] = useState("Interested");
  const [bhkType, setBhkType] = useState(lead?.bhkType || "2 BHK");
  const [notes, setNotes] = useState(lead?.notes || "");
  const [followupDate, setFollowupDate] = useState(getCurrentLocalDateTime());
  const [isListening, setIsListening] = useState(false);

  // Initialize Real Microphone Recording when Call Screen Mounts
  useEffect(() => {
    const rec = new UniversalAudioRecorder();
    recorderRef.current = rec;

    rec.start()
      .then(() => {
        setIsRecordingMic(true);
        console.log("[DialerModal] Microphone capturing live audio...");

        // Monitor volume level for visual sound waves
        volumeIntervalRef.current = setInterval(() => {
          if (recorderRef.current && recorderRef.current.isRecording) {
            const vol = recorderRef.current.getVolumeLevel();
            setLiveVolume(vol);
          }
        }, 100);
      })
      .catch((err) => {
        console.log("[DialerModal] Microphone notice:", err.message);
        setIsRecordingMic(false);
      });

    return () => {
      if (recorderRef.current && recorderRef.current.isRecording) {
        recorderRef.current.stop().catch(() => {});
      }
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    };
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
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Realistic DTMF Dual-Tone Telephone Audio Generator
  const playDtmfTone = (digit) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const dtmfFreqs = {
        '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
        '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
        '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
        '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
      };
      const freqs = dtmfFreqs[digit];
      if (freqs) {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.setValueAtTime(freqs[0], now);
        osc2.frequency.setValueAtTime(freqs[1], now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.16);
        osc2.stop(now + 0.16);
      }
    } catch (e) {}
  };

  const handleKeyPress = (digit) => {
    playDtmfTone(digit);
    setDialedDigits(prev => prev + digit);
  };

  const handleBackspace = () => {
    setDialedDigits(prev => prev.slice(0, -1));
  };

  // Toggle Mute of Real Microphone
  const handleToggleMute = (e) => {
    e.stopPropagation();
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (recorderRef.current?.mediaStream) {
      recorderRef.current.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !nextState;
      });
    }
  };

  // Real Exotel Click-to-Call to User's Mobile Phone
  const handleExotelCall = async (e) => {
    if (e) e.stopPropagation();
    setIsCallingExotel(true);
    setExotelStatusMsg("Connecting to Exotel Cloud...");
    const res = await triggerExotelClickToCall(lead?.id, lead?.phone, "9867778229");
    setIsCallingExotel(false);
    if (res?.message) {
      setExotelStatusMsg(res.message);
      setAlertConfig({
        title: res.status === "success" ? "📞 Exotel Call Dispatched!" : "Exotel Telephony",
        message: res.message,
        type: res.status === "success" ? "success" : "info",
        actionBtn: res.direct_dial_url ? {
          label: "📱 Direct Dial (Phone App)",
          onClick: () => window.open(res.direct_dial_url, "_self")
        } : null
      });
    }
  };

  // Toggle Microphone Manual Recording
  const toggleMicRecording = async () => {
    if (isRecordingMic) {
      if (recorderRef.current) {
        const result = await recorderRef.current.stop();
        if (result && result.url) {
          setRecordedAudioUrl(result.url);
          setRecordedAudioBase64(result.base64);
        }
      }
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      setIsRecordingMic(false);
    } else {
      const rec = new UniversalAudioRecorder();
      recorderRef.current = rec;
      try {
        await rec.start();
        setIsRecordingMic(true);
        volumeIntervalRef.current = setInterval(() => {
          if (recorderRef.current && recorderRef.current.isRecording) {
            setLiveVolume(recorderRef.current.getVolumeLevel());
          }
        }, 100);
      } catch (err) {
        setAlertConfig({
          title: "Microphone Access Required",
          message: "Please allow microphone permission to record audio.",
          type: "warning"
        });
      }
    }
  };

  // Stop Recording & Transition to Disposition
  const handleEndCall = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const durationStr = formatTimer(seconds);
    setCallDuration(durationStr);

    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);

    if (recorderRef.current && recorderRef.current.isRecording) {
      try {
        const result = await recorderRef.current.stop();
        if (result && result.url) {
          setRecordedAudioUrl(result.url);
          setRecordedAudioBase64(result.base64);
        }
      } catch (err) {
        console.error("Error stopping recorder:", err);
      }
    }
    setIsRecordingMic(false);

    setCallState("DISPOSITION");
    try {
      sessionStorage.setItem(`crm_call_state_${lead?.id}`, "DISPOSITION");
    } catch (err) {}
    if (isListening) setIsListening(false);
  };

  // Toggle Real Audio Playback (NO FAKE ROBOT VOICE)
  const toggleAudioPlayback = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const audio = audioElementRef.current;
    if (!audio || !recordedAudioUrl) {
      setAlertConfig({
        title: "No Audio Recorded",
        message: "No voice was captured during this call. You can tap 'Re-record' to record a voice note now!",
        type: "info"
      });
      return;
    }

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      audio.currentTime = 0;
      audio.play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlayingAudio(false);
        });
    }
  };

  const handleDownloadRecording = () => {
    if (!recordedAudioUrl) return;
    const a = document.createElement("a");
    a.href = recordedAudioUrl;
    a.download = `Call_Recording_${lead.id}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      recordedAudioUrl: recordedAudioBase64 || recordedAudioUrl || ""
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

  if (!lead) return null;

  const dispositionOptions = [
    { label: "Interested", icon: "🔥", desc: "Customer interested & engaged" },
    { label: "Not Interested", icon: "❌", desc: "Budget or location mismatch" },
    { label: "Callback", icon: "📞", desc: "Customer requested callback" },
    { label: "Follow Ups", icon: "⏰", desc: "Scheduled follow-up" },
    { label: "Scheduled Site Visit", icon: "📅", desc: "Site visit confirmed" },
    { label: "Deal Closed (Won)", icon: "🎉", desc: "Booking / Token received" },
    { label: "Busy / Line Busy", icon: "⏳", desc: "Call waiting or line busy" },
    { label: "Left Voicemail / WA", icon: "✉️", desc: "Message left on WhatsApp" },
    { label: "Switch Off", icon: "📵", desc: "Mobile unreachable / switched off" },
    { label: "Hung Up", icon: "📴", desc: "Call disconnected / hung up" }
  ];

  return (
    <div 
      className="dialer-screen-container" 
      style={{ 
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        borderRadius: 0,
        border: "none",
        overflow: "hidden",
        display: "flex", 
        flexDirection: "column",
        background: callState === "CALLING" ? "#242d3d" : "#f1f5f9",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Real HTML5 Audio Player Element for Real Voice Playback */}
      {recordedAudioUrl && (
        <audio
          ref={audioElementRef}
          src={recordedAudioUrl}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
          onEnded={() => {
            setIsPlayingAudio(false);
            setCurrentTime(0);
          }}
          style={{ display: "none" }}
        />
      )}

      {/* STAGE 1: ACTIVE CALLING SCREEN - AUTHENTIC iOS PHONE IN-CALL UI (MATCHING IMAGE 2) */}
      {callState === "CALLING" ? (
        <div 
          className="active-call-screen" 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{ 
            width: "100%", 
            maxWidth: "500px",
            height: "100%", 
            maxHeight: "100vh",
            background: "linear-gradient(180deg, #242d3d 0%, #1a2230 100%)", 
            borderRadius: 0, 
            padding: "0.75rem 1.25rem 1rem 1.25rem", 
            textAlign: "center", 
            color: "#ffffff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          {/* Top Status Bar with Dynamic Island */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0.25rem 0.25rem 0.4rem 0.25rem",
            color: "#ffffff",
            flexShrink: 0
          }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "-0.2px" }}>
              09:41
            </span>

            {/* Dynamic Island Pill */}
            <div style={{
              background: "#000000",
              borderRadius: "9999px",
              padding: "0.25rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.6)"
            }}>
              <Phone size={11} color="#22c55e" fill="#22c55e" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.3px" }}>
                {formatTimer(seconds)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Signal size={12} color="#ffffff" />
              <Wifi size={12} color="#ffffff" />
              <Battery size={14} color="#ffffff" fill="#ffffff" />
            </div>
          </div>

          {/* Lead Contact Info Section */}
          <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem", flexShrink: 0 }}>
            {/* Silhouette Circular Avatar */}
            <div style={{
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              background: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)"
            }}>
              <User size={44} color="#cbd5e1" fill="#cbd5e1" />
            </div>

            <h1 style={{ 
              fontSize: "1.55rem", 
              fontWeight: 700, 
              margin: "0 0 0.5rem 0", 
              letterSpacing: "-0.02em",
              color: "#ffffff"
            }}>
              {lead.name || "Vikram Singhania"}
            </h1>

            {/* Gold Property Badge */}
            <div style={{ 
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem", 
              fontWeight: 600,
              color: "#fcd34d", 
              background: "rgba(180, 83, 9, 0.25)", 
              border: "1px solid rgba(245, 158, 11, 0.45)", 
              padding: "0.3rem 0.9rem", 
              borderRadius: "9999px"
            }}>
              <span>🏠</span>
              <span>
                {lead.bhkType 
                  ? `${lead.bhkType} ${lead.location || "Bandra West"}`.trim() 
                  : (lead.property_requirement || "3 BHK Bandra West")}
              </span>
            </div>
          </div>

          {/* KEYPAD VIEW (When user clicks Keypad button) */}
          {showKeypad ? (
            <div style={{ animation: "fadeIn 0.2s ease", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* Dialed Digits Display & Backspace */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem", 
                height: "36px", 
                marginBottom: "0.75rem",
                padding: "0 1rem"
              }}>
                <span style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: 700, 
                  color: "#ffffff", 
                  fontFamily: "monospace", 
                  letterSpacing: "2px",
                  minWidth: "120px"
                }}>
                  {dialedDigits || "..."}
                </span>
                {dialedDigits && (
                  <button
                    type="button"
                    onClick={handleBackspace}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }}
                  >
                    <Delete size={20} />
                  </button>
                )}
              </div>

              {/* iOS 3x4 Dialpad Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.6rem",
                maxWidth: "260px",
                margin: "0 auto 1rem auto"
              }}>
                {[
                  { num: "1", sub: "" },
                  { num: "2", sub: "ABC" },
                  { num: "3", sub: "DEF" },
                  { num: "4", sub: "GHI" },
                  { num: "5", sub: "JKL" },
                  { num: "6", sub: "MNO" },
                  { num: "7", sub: "PQRS" },
                  { num: "8", sub: "TUV" },
                  { num: "9", sub: "WXYZ" },
                  { num: "*", sub: "" },
                  { num: "0", sub: "+" },
                  { num: "#", sub: "" }
                ].map((keyItem) => (
                  <button
                    key={keyItem.num}
                    type="button"
                    onClick={() => handleKeyPress(keyItem.num)}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.16)",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "auto",
                      transition: "transform 0.08s ease, background 0.1s ease",
                      userSelect: "none"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                    onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <span style={{ fontSize: "1.35rem", fontWeight: 700, lineHeight: 1 }}>{keyItem.num}</span>
                    {keyItem.sub && (
                      <span style={{ fontSize: "0.5rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginTop: "1px" }}>
                        {keyItem.sub}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Bottom Keypad Actions */}
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", maxWidth: "260px", margin: "0 auto" }}>
                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.14)",
                    border: "none",
                    color: "#ffffff",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "9999px",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Hide Keypad
                </button>

                <button
                  type="button"
                  onClick={handleEndCall}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    border: "none",
                    color: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 18px rgba(239, 68, 68, 0.5)"
                  }}
                  title="End Call"
                >
                  <PhoneOff size={24} fill="#ffffff" />
                </button>
              </div>
            </div>
          ) : (
            /* MAIN 6-BUTTON IN-CALL SCREEN (PIXEL-PERFECT AS PER IMAGE 2) */
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem 0.75rem",
                maxWidth: "310px",
                margin: "0 auto",
                alignItems: "center",
                justifyItems: "center"
              }}>
                {/* 1. Speaker Button (Solid White Circle) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      color: "#0f172a",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <Volume2 size={24} color="#0f172a" />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "6px", fontWeight: 500 }}>
                    Speaker
                  </span>
                </div>

                {/* 2. Mute Button (Dark Translucent Glass Circle) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: isMuted ? "#ffffff" : "rgba(255, 255, 255, 0.14)",
                      color: isMuted ? "#ef4444" : "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <MicOff size={24} color={isMuted ? "#ef4444" : "#ffffff"} />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: isMuted ? "#f87171" : "#cbd5e1", marginTop: "6px", fontWeight: 500 }}>
                    {isMuted ? "Muted" : "Mute"}
                  </span>
                </div>

                {/* 3. End Call Button (Solid Red Circle) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={handleEndCall}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "#ffffff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 16px rgba(239, 68, 68, 0.4)",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <PhoneOff size={24} fill="#ffffff" color="#ffffff" />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "6px", fontWeight: 500 }}>
                    End Call
                  </span>
                </div>

                {/* 4. Exotel Call-Back (Gold Bordered Card with CRM Badge) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    onClick={handleExotelCall}
                    style={{
                      border: "1.5px solid rgba(245, 158, 11, 0.7)",
                      background: "rgba(245, 158, 11, 0.08)",
                      borderRadius: "14px",
                      padding: "8px 6px 6px 6px",
                      position: "relative",
                      width: "82px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.94)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    {/* CRM Pill Badge */}
                    <div style={{
                      position: "absolute",
                      top: "-7px",
                      right: "6px",
                      background: "#f59e0b",
                      color: "#0f172a",
                      fontSize: "9px",
                      fontWeight: 800,
                      padding: "1px 5px",
                      borderRadius: "9999px",
                      letterSpacing: "0.5px",
                      lineHeight: 1.2
                    }}>
                      CRM
                    </div>

                    {/* Exotel Blue Circle */}
                    <div style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: isCallingExotel ? "#1d4ed8" : "#0284c7",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "-0.2px",
                      boxShadow: "0 2px 8px rgba(2, 132, 199, 0.4)"
                    }}>
                      {isCallingExotel ? "..." : "Exotel"}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.6875rem", color: "#cbd5e1", marginTop: "6px", textAlign: "center", lineHeight: "1.2", fontWeight: 500 }}>
                    Exotel<br />Call-Back
                  </span>
                </div>

                {/* 5. Keypad Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setShowKeypad(true)}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.14)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <Grid size={24} color="#ffffff" />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: "#cbd5e1", marginTop: "6px", fontWeight: 500 }}>
                    Keypad
                  </span>
                </div>

                {/* 6. Add MCF Feedback Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOutcome("Scheduled Site Visit");
                      handleEndCall();
                    }}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.14)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                    onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <ExternalLink size={22} color="#ffffff" />
                  </button>
                  <span style={{ fontSize: "0.6875rem", color: "#cbd5e1", marginTop: "6px", textAlign: "center", lineHeight: "1.2", fontWeight: 500 }}>
                    Add MCF<br />Feedback
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Golden Animated Audio Waveform */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            height: "40px",
            margin: "0.5rem auto",
            width: "100%",
            maxWidth: "290px",
            flexShrink: 0
          }}>
            {[6, 10, 14, 20, 26, 18, 30, 22, 38, 28, 44, 32, 24, 40, 20, 48, 22, 42, 26, 34, 46, 30, 36, 22, 28, 16, 22, 14, 18, 10, 6].map((h, i) => (
              <div
                key={i}
                style={{
                  width: "2.5px",
                  height: isMuted ? "4px" : `${Math.max(4, Math.min(40, h * (1 + liveVolume / 35)))}px`,
                  background: isMuted ? "#64748b" : "#f59e0b",
                  borderRadius: "9999px",
                  transition: "height 0.1s ease"
                }}
              />
            ))}
          </div>

          {/* Bottom Floating Pill: Add TCF (Call Feedback) */}
          <button
            type="button"
            onClick={handleEndCall}
            style={{
              width: "calc(100% - 16px)",
              maxWidth: "340px",
              background: "#ffffff",
              color: "#0f172a",
              borderRadius: "9999px",
              padding: "12px 18px",
              margin: "0 auto 4px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              flexShrink: 0,
              transition: "transform 0.1s ease"
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
            onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardList size={18} color="#0f172a" />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                Add TCF (Call Feedback)
              </span>
            </div>
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              ?
            </div>
          </button>
        </div>
      ) : (
        /* STAGE 2: POST-CALL FEEDBACK & DISPOSITION FORM */
        <div 
          className="disposition-screen" 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{ 
            width: "100%", 
            maxWidth: "680px",
            height: "100%",
            maxHeight: "100vh",
            background: "#ffffff", 
            borderRadius: 0, 
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0,0,0,0.08)"
          }}
        >
          {/* Header Summary */}
          <div className="dialer-header" style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", flexShrink: 0 }}>
            <div className="dialer-caller-info">
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{lead.name}</div>
              <div style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "2px" }}>
                {lead.phone} • {lead.location} ({bhkType})
              </div>
            </div>

            <div className="dialer-timer-badge" style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "0.35rem 0.75rem", borderRadius: "9999px", fontWeight: 800, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={16} />
              <span>{callDuration}</span>
            </div>
          </div>

          <div className="dialer-body" style={{ padding: "1rem 1.25rem", overflowY: "auto", flex: "1 1 auto" }}>
            {/* Real Live Call Audio Recording Player */}
            <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "1px solid #cbd5e1", borderRadius: "0.875rem", padding: "0.75rem 0.875rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  🎙️ Live Call Voice Recording
                </span>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {recordedAudioUrl && (
                    <button
                      type="button"
                      onClick={handleDownloadRecording}
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        border: "1px solid #cbd5e1",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem"
                      }}
                      title="Download .wav audio file"
                    >
                      <Download size={11} /> .wav
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={toggleMicRecording}
                    style={{
                      background: isRecordingMic ? "#ef4444" : "#eff6ff",
                      color: isRecordingMic ? "#ffffff" : "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem"
                    }}
                    title="Record extra voice note"
                  >
                    <Mic size={11} /> {isRecordingMic ? "Stop Mic" : "Re-record"}
                  </button>

                  <span style={{ fontSize: "0.6875rem", fontWeight: "800", color: isPlayingAudio ? "#2563eb" : "#16a34a", background: isPlayingAudio ? "#dbeafe" : "#dcfce7", border: isPlayingAudio ? "1px solid #93c5fd" : "1px solid #bbf7d0", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                    {isPlayingAudio ? "Playing Voice..." : `Recorded • ${callDuration}`}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#ffffff", padding: "0.6rem 0.85rem", borderRadius: "0.625rem", border: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={toggleAudioPlayback}
                  style={{
                    width: "38px",
                    height: "38px",
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
                  title="Play recorded voice"
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
                        height: isPlayingAudio ? `${Math.min(26, Math.max(8, (h * (idx + Math.floor(currentTime * 5)) % 24) + 6))}px` : `${h}px`,
                        background: isPlayingAudio ? "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" : "#cbd5e1",
                        borderRadius: "9999px",
                        transition: "all 0.15s ease"
                      }}
                    />
                  ))}
                </div>

                <span style={{ fontSize: "0.78125rem", fontWeight: 800, color: isPlayingAudio ? "#2563eb" : "#64748b", fontFamily: "monospace" }}>
                  {isPlayingAudio ? formatTimer(currentTime) : (audioDuration ? formatTimer(audioDuration) : callDuration)}
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
              
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "0.5rem" 
                }}
              >
                {dispositionOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOutcome(opt.label);
                    }}
                    style={{
                      padding: "0.6rem 0.5rem",
                      borderRadius: "0.625rem",
                      border: outcome === opt.label ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      background: outcome === opt.label ? "#2563eb" : "#ffffff",
                      color: outcome === opt.label ? "#ffffff" : "#1e293b",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      boxShadow: outcome === opt.label ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none",
                      transition: "all 0.15s ease",
                      userSelect: "none"
                    }}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Call Notes with Speech Dictation & AI Grammar */}
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label className="form-label" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155", margin: 0 }}>
                  Call Notes / Discussion
                </label>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    style={{
                      background: isListening ? "#ef4444" : "#eff6ff",
                      color: isListening ? "#ffffff" : "#2563eb",
                      border: "1px solid #bfdbfe",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <Mic size={12} /> {isListening ? "Listening..." : "Voice Dictation"}
                  </button>
                  <button
                    type="button"
                    onClick={autoCorrectGrammar}
                    style={{
                      background: "#f0fdf4",
                      color: "#15803d",
                      border: "1px solid #bbf7d0",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem"
                    }}
                  >
                    <Sparkles size={12} /> AI Grammar
                  </button>
                </div>
              </div>

              <textarea
                className="textarea-input"
                rows={3}
                placeholder="Enter key customer discussion points, budget, next steps..."
                value={notes}
                onChange={(e) => { e.stopPropagation(); setNotes(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: "100%", 
                  padding: "0.6rem 0.75rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #cbd5e1", 
                  fontSize: "0.84375rem",
                  lineHeight: "1.4",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Follow-up Date/Time */}
            <div className="form-group" style={{ marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                Next Follow-Up Date & Time
              </label>
              <input
                type="datetime-local"
                className="input-text"
                value={followupDate}
                onChange={(e) => { e.stopPropagation(); setFollowupDate(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: "100%", 
                  padding: "0.55rem 0.75rem", 
                  borderRadius: "0.5rem", 
                  border: "1px solid #cbd5e1", 
                  fontSize: "0.84375rem" 
                }}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="dialer-footer" style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", gap: "0.75rem", flexShrink: 0 }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancelClose}
              style={{
                flex: 1,
                padding: "0.65rem",
                borderRadius: "0.5rem",
                background: "#64748b",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-save"
              onClick={handleSave}
              style={{
                flex: 1.5,
                padding: "0.65rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                color: "#ffffff",
                border: "none",
                fontWeight: 800,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
              }}
            >
              <CheckCircle2 size={16} /> Save Call Log
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
