import React from "react";
import { 
  X, User, Share2, Clock, MapPin, Sparkles, FileText, List, 
  PlusCircle, HelpCircle, Bot, Calculator, Smartphone, PhoneIncoming, 
  MessageSquare, PhoneCall, ChevronRight, ShieldCheck
} from "lucide-react";

export default function SidebarDrawer({ 
  isOpen, 
  onClose, 
  currentUser, 
  onNavigate, 
  onOpenProfile,
  onOpenAttendance,
  onOpenBusinessCard,
  onOpenTCF,
  onOpenMCF,
  onOpenGpt,
  onOpenLocation,
  onOpenStories,
  onOpenCalculator,
  onOpenInstallApp,
  onOpenIntegrations,
  onSimulateInbound
}) {
  if (!isOpen) return null;

  const phoneText = currentUser?.mobile_no || currentUser?.phone || "9867778229";

  return (
    <div 
      className="sidebar-drawer-overlay" 
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5000,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch"
      }}
    >
      <div 
        className="sidebar-drawer-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "84%",
          maxWidth: "340px",
          height: "100%",
          background: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          boxShadow: "8px 0 32px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          animation: "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Royal Sapphire Executive Header (High Contrast, Accessible, Premium) */}
        <div 
          onClick={() => { onClose(); onOpenProfile(); }}
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #1d4ed8 100%)",
            color: "#ffffff",
            padding: "1.25rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            position: "relative",
            cursor: "pointer",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(30, 58, 138, 0.3)"
          }}
        >
          {/* Avatar with Gold Ring & Live Pulse */}
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid #f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1e3a8a",
            fontWeight: 900,
            fontSize: "1.1rem",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            position: "relative"
          }}>
            <User size={24} color="#1e3a8a" />
            <span style={{
              position: "absolute",
              bottom: "-1px",
              right: "-1px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#10b981",
              border: "2px solid #ffffff"
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
              {currentUser?.name || "Shyam Pandey"}
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "rgba(254, 240, 138, 0.25)",
              color: "#fef08a",
              border: "1px solid rgba(254, 240, 138, 0.4)",
              borderRadius: "9999px",
              padding: "0.1rem 0.5rem",
              fontSize: "0.6875rem",
              fontWeight: 800,
              marginTop: "0.2rem"
            }}>
              👑 Senior Sales Consultant
            </div>
            <div style={{ fontSize: "0.71875rem", color: "#e0f2fe", fontWeight: 600, marginTop: "0.2rem" }}>
              📞 {phoneText}
            </div>
          </div>

          {/* Close Button & Chevron */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem" }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              style={{ 
                background: "rgba(255, 255, 255, 0.2)", 
                border: "none", 
                color: "#ffffff", 
                cursor: "pointer",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s"
              }}
              title="Close Menu"
            >
              <X size={15} />
            </button>
            <ChevronRight size={16} color="rgba(255, 255, 255, 0.8)" />
          </div>
        </div>

        {/* Crisp Accessible Body with Apple-Grouped Cards */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.85rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem"
        }}>
          {/* Top 3 Highlight Banners */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            
            {/* ChatGPT AI Copilot */}
            <div
              onClick={() => { onClose(); if (onOpenGpt) onOpenGpt(); }}
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #10b981",
                borderRadius: "12px",
                padding: "0.7rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(16, 185, 129, 0.08)",
                transition: "transform 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={16} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#065f46" }}>ChatGPT AI Copilot</div>
                  <div style={{ fontSize: "0.6875rem", color: "#047857" }}>RERA pitch & objection handler</div>
                </div>
              </div>
              <span style={{
                background: "#10b981",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "9999px"
              }}>
                AI 4.0
              </span>
            </div>

            {/* Exotel Telephony & Calling */}
            <div
              onClick={() => { onClose(); if (onOpenIntegrations) onOpenIntegrations("virtual_number"); }}
              style={{
                background: "#eff6ff",
                border: "1.5px solid #3b82f6",
                borderRadius: "12px",
                padding: "0.7rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(59, 130, 246, 0.08)",
                transition: "transform 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PhoneCall size={16} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#1e40af" }}>Exotel Telephony & Calling</div>
                  <div style={{ fontSize: "0.6875rem", color: "#1d4ed8" }}>Virtual Exophone & Agent SIM</div>
                </div>
              </div>
              <span style={{
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "9999px"
              }}>
                EXOTEL
              </span>
            </div>

            {/* Multi-Channel Integrations */}
            <div
              onClick={() => { onClose(); if (onOpenIntegrations) onOpenIntegrations("whatsapp"); }}
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #10b981",
                borderRadius: "12px",
                padding: "0.7rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(16, 185, 129, 0.08)",
                transition: "transform 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageSquare size={16} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#065f46" }}>Multi-Channel Integrations</div>
                  <div style={{ fontSize: "0.6875rem", color: "#047857" }}>Meta Ads, WhatsApp Webhooks</div>
                </div>
              </div>
              <span style={{
                background: "#10b981",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.2rem 0.55rem",
                borderRadius: "9999px"
              }}>
                SETUP
              </span>
            </div>
          </div>

          {/* Group 1: Daily Sales Operations */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
          }}>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.6rem 0.85rem 0.35rem 0.85rem",
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9"
            }}>
              Daily Operations
            </div>

            {/* Take a Tour */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("dashboard"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <HelpCircle size={17} color="#2563eb" />
              <span>Take a Tour</span>
            </div>

            {/* Share Business Card */}
            <div
              onClick={() => { onClose(); if (onOpenBusinessCard) onOpenBusinessCard(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <Share2 size={17} color="#2563eb" />
              <span>Share Business Card</span>
            </div>

            {/* Work Attendance */}
            <div
              onClick={() => { onClose(); if (onOpenAttendance) onOpenAttendance(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Clock size={17} color="#16a34a" />
                <span>Work Attendance</span>
              </div>
              <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 700, background: "#dcfce7", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                • Present
              </span>
            </div>

            {/* Test Incoming Direct Call */}
            <div
              onClick={() => { onClose(); if (onSimulateInbound) onSimulateInbound(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#1d4ed8",
                fontSize: "0.84375rem",
                fontWeight: 700,
                background: "rgba(37, 99, 235, 0.04)",
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <PhoneIncoming size={17} color="#2563eb" />
                <span>Test Incoming Direct Call</span>
              </div>
              <span style={{
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                LIVE
              </span>
            </div>

            {/* Meeting Location & Live Radar */}
            <div
              onClick={() => { onClose(); if (onOpenLocation) onOpenLocation(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600
              }}
            >
              <MapPin size={17} color="#dc2626" />
              <span>Meeting Location & Live Radar</span>
            </div>
          </div>

          {/* Group 2: PropTech Sales Tools */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
          }}>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.6rem 0.85rem 0.35rem 0.85rem",
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9"
            }}>
              PropTech Tools
            </div>

            {/* Stories & Highlights */}
            <div
              onClick={() => { onClose(); if (onOpenStories) onOpenStories(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Sparkles size={17} color="#e11d48" />
                <span>Stories & Highlights</span>
              </div>
              <span style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                NEW
              </span>
            </div>

            {/* Real Estate Calculator (EMI/ROI) */}
            <div
              onClick={() => { onClose(); if (onOpenCalculator) onOpenCalculator(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Calculator size={17} color="#ea580c" />
                <span>Real Estate Calculator (EMI/ROI)</span>
              </div>
              <span style={{
                background: "#ea580c",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                PRO
              </span>
            </div>

            {/* Install App on Phone (iOS/Android) */}
            <div
              onClick={() => { onClose(); if (onOpenInstallApp) onOpenInstallApp(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Smartphone size={17} color="#16a34a" />
                <span>Install App on Phone</span>
              </div>
              <span style={{
                background: "#16a34a",
                color: "#ffffff",
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "9999px"
              }}>
                INSTALL
              </span>
            </div>
          </div>

          {/* Group 3: Dispositions & Feedback Forms */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
          }}>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.6rem 0.85rem 0.35rem 0.85rem",
              background: "#f8fafc",
              borderBottom: "1px solid #f1f5f9"
            }}>
              Feedback & Reports
            </div>

            {/* Add TCF */}
            <div
              onClick={() => { onClose(); if (onOpenTCF) onOpenTCF(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <PlusCircle size={17} color="#2563eb" />
              <span>Add TCF (Call Feedback)</span>
            </div>

            {/* TCF List */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("tcf-list"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <FileText size={17} color="#64748b" />
              <span>TCF Logs List</span>
            </div>

            {/* Add MCF */}
            <div
              onClick={() => { onClose(); if (onOpenMCF) onOpenMCF(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600,
                borderBottom: "1px solid #f1f5f9"
              }}
            >
              <PlusCircle size={17} color="#16a34a" />
              <span>Add MCF (Meeting Feedback)</span>
            </div>

            {/* MCF List */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("mcf-list"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.85rem",
                cursor: "pointer",
                color: "#0f172a",
                fontSize: "0.84375rem",
                fontWeight: 600
              }}
            >
              <List size={17} color="#64748b" />
              <span>MCF Meeting List</span>
            </div>
          </div>
        </div>

        {/* Verified Partner Footer */}
        <div style={{
          padding: "0.75rem 1rem",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>MahaRERA Partner</span>
          </div>
          <span style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 600 }}>v3.6.2</span>
        </div>
      </div>
    </div>
  );
}
