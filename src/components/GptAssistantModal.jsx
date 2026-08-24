import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Copy, Check, Bot, User, RefreshCw, MessageSquare, Volume2, Mic, Zap } from "lucide-react";
import { askChatGptCopilot } from "../services/apiService";

export default function GptAssistantModal({ isOpen, onClose, currentUser }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: `Hello ${currentUser?.name || "Shyam"}! 👋 I am your **ChatGPT AI Sales Copilot**. \n\nHow can I assist you today? Select a persona or quick prompt below or ask me any question!`,
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState("Sales Advisor");
  const [isListening, setIsListening] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: "💬 Draft WhatsApp Follow-up", prompt: "Draft a personalized WhatsApp follow-up message for a lead interested in Kalpataru Vian 2BHK." },
    { label: "💰 Handle Price Objection", prompt: "How do I answer a client who says 'Kalpataru Vian price is too high compared to nearby projects'?" },
    { label: "🏢 Kalpataru Vian Pitch Script", prompt: "Give me a 60-second high-converting phone pitch for Kalpataru Vian, Andheri West." },
    { label: "📝 Cold Calling Script", prompt: "Give me a 3-minute structured telecalling script for fresh Instagram leads." }
  ];

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAlertConfig({ title: "Speech Recognition Unavailable", message: "Voice speech recognition is not supported in this browser. Please type your query!", type: "warning" });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const generateFallbackResponse = (userQuestion) => {
    const q = userQuestion.toLowerCase();
    if (q.includes("whatsapp") || q.includes("follow") || q.includes("draft")) {
      return `📱 *ChatGPT Generated WhatsApp Template:*\n\n"Hi *[Client Name]*, Good afternoon! 🌟\n\nFollowing up on our conversation regarding *Kalpataru Vian, Andheri West*. We have released 2 high-floor 2BHK units with panoramic views & inaugural discount valid till Sunday!\n\nWould you be available for a quick site visit this Saturday at 11 AM or 4 PM?\n\nBest Regards,\n*${currentUser?.name || "Shyam Pandey"}*\n*Dream Homes Real Estate*"`;
    }
    if (q.includes("price") || q.includes("high") || q.includes("expensive")) {
      return `💡 *ChatGPT Sales Masterclass: Price Objection*\n\nWhen a buyer says the price is too high:\n1. Empathize: "I completely understand premium real estate is a major decision."\n2. Carpet Pivot: "Unbranded builders quote on super-built area (35% loading). Kalpataru quotes on net RERA carpet. You get 260 sq.ft. MORE actual living space!"\n3. Close: "Let's review the floor plan on-site tomorrow!"`;
    }
    return `🤖 *ChatGPT Real Estate Copilot:* Regarding *"${userQuestion}"*: In current Mumbai suburban markets (Andheri West & Lokhandwala), buyers prioritize RERA timeline credibility and carpet usability. Always use **Alternative Choice Closing** ("Saturday 11 AM or 4 PM?") to double site visit conversions!`;
  };

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const apiReply = await askChatGptCopilot(query, selectedPersona, currentUser?.name || "Shyam");
      const replyText = apiReply || generateFallbackResponse(query);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: generateFallbackResponse(query),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 99999, padding: "0.5rem" }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "480px",
          width: "100%",
          height: "85vh",
          maxHeight: "650px",
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          borderRadius: "1.25rem",
          color: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
          padding: 0,
          position: "relative"
        }}
      >
        {/* ChatGPT Top Navigation Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(16,185,129,0.3)"
              }}
            >
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#f8fafc" }}>ChatGPT Sales Copilot</h3>
                <span style={{ fontSize: "0.6rem", background: "#10b981", color: "#ffffff", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "9999px" }}>
                  GPT-4 LIVE
                </span>
              </div>
              <p style={{ fontSize: "0.725rem", color: "#94a3b8" }}>Real Estate Telecalling & Sales AI Assistant</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => setMessages([{ id: 1, sender: "ai", text: `Chat cleared. Ask me anything!`, time: "Just now" }])}
              style={{ background: "#334155", border: "none", color: "#cbd5e1", borderRadius: "0.4rem", padding: "0.35rem", cursor: "pointer" }}
              title="Clear Conversation"
            >
              <RefreshCw size={15} />
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Quick Action Prompt Chips */}
        <div style={{ padding: "0.65rem 1rem", background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              style={{
                whiteSpace: "nowrap",
                background: "#334155",
                color: "#f8fafc",
                border: "1px solid #475569",
                borderRadius: "9999px",
                padding: "0.35rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Log Area */}
        <div style={{ flex: 1, padding: "1.25rem 1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", background: "#090d16" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                width: "100%"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", maxWidth: "88%" }}>
                {msg.sender === "ai" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={16} color="#ffffff" />
                  </div>
                )}

                <div
                  style={{
                    background: msg.sender === "user" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#1e293b",
                    color: "#ffffff",
                    padding: "0.85rem 1rem",
                    borderRadius: msg.sender === "user" ? "1.25rem 1.25rem 0.2rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.2rem",
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    border: msg.sender === "ai" ? "1px solid #334155" : "none"
                  }}
                >
                  {msg.text}
                </div>

                {msg.sender === "user" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={16} color="#ffffff" />
                  </div>
                )}
              </div>

              {/* Message Actions (Copy & Read Aloud) */}
              {msg.sender === "ai" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.35rem", marginLeft: "2.25rem" }}>
                  <span style={{ fontSize: "0.65rem", color: "#64748b" }}>{msg.time}</span>
                  
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    style={{ background: "none", border: "none", color: copiedId === msg.id ? "#10b981" : "#94a3b8", cursor: "pointer", fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    {copiedId === msg.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === msg.id ? "Copied" : "Copy"}
                  </button>

                  <button
                    onClick={() => handleSpeak(msg.text)}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}
                    title="Listen to Audio"
                  >
                    <Volume2 size={13} /> Listen
                  </button>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.8rem", fontWeight: 600 }}>
              <Sparkles size={16} className="animate-spin" /> ChatGPT AI is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: "0.85rem 1rem", background: "#1e293b", borderTop: "1px solid #334155" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              style={{
                background: isListening ? "#ef4444" : "#334155",
                color: "#ffffff",
                border: "1px solid #475569",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
              title="Click to speak your prompt into microphone"
            >
              <Mic size={16} color={isListening ? "#ffffff" : "#38bdf8"} />
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening... Speak your prompt now..." : "Ask ChatGPT real estate pitch, scripts, or objection handling..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                background: "#0f172a",
                border: isListening ? "1px solid #ef4444" : "1px solid #475569",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                color: "#ffffff",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />

            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                background: input.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "#334155",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem 1.1rem",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease"
              }}
            >
              <Send size={16} />
            </button>
          </form>

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
      </div>
    </div>
  );
}
