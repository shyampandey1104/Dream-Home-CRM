import React from "react";
import { 
  X, User, Share2, Clock, MapPin, Sparkles, FileText, List, 
  PlusCircle, Megaphone, Settings, ChevronRight, ShieldCheck, HelpCircle, 
  Bot, Calculator, Smartphone, PhoneIncoming, Zap, MessageSquare, PhoneCall,
  CheckCircle2, Compass
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

  return (
    <div className="sidebar-drawer-overlay" onClick={onClose}>
      <div 
        className="sidebar-drawer-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          overflow: "hidden"
        }}
      >
        {/* Luxury Obsidian User Profile Header */}
        <div 
          onClick={() => { onClose(); onOpenProfile(); }}
          style={{
            background: "linear-gradient(135deg, #090d16 0%, #1e293b 100%)",
            color: "#ffffff",
            padding: "1rem 1rem 0.9rem 1rem",
            paddingTop: "2.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            position: "relative",
            cursor: "pointer"
          }}
        >
          {/* Photo Avatar */}
          <div style={{
            position: "relative",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            border: "2px solid #f59e0b",
            flexShrink: 0
          }}>
            <img 
              src="/profile.jpg" 
              alt="Shyam Pandey"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;background:#2563eb;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;">SP</div>`;
              }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "11px",
              height: "11px",
              borderRadius: "50%",
              background: "#10b981",
              border: "2px solid #0f172a"
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <div style={{ fontSize: "1.05rem", fontWeight: "900", color: "#ffffff", letterSpacing: "-0.01em" }}>
                {currentUser?.name || "Shyam Pandey"}
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.15rem", flexWrap: "wrap" }}>
              <span style={{
                fontSize: "0.6875rem",
                color: "#facc15",
                fontWeight: "800",
                background: "rgba(250, 204, 21, 0.15)",
                padding: "0.1rem 0.45rem",
                borderRadius: "9999px",
                border: "1px solid rgba(250, 204, 21, 0.3)"
              }}>
                👑 Senior Consultant
              </span>
              <span style={{
                fontSize: "0.65rem",
                color: "#38bdf8",
                fontWeight: "700",
                background: "rgba(56, 189, 248, 0.15)",
                padding: "0.1rem 0.45rem",
                borderRadius: "9999px",
                border: "1px solid rgba(56, 189, 248, 0.3)"
              }}>
                A51800045492
              </span>
            </div>

            <div style={{ fontSize: "0.71875rem", color: "#94a3b8", fontWeight: "600", marginTop: "0.2rem" }}>
              📞 {currentUser?.mobile_no || currentUser?.phone || "+91 98677 78229"}
            </div>
          </div>

          <ChevronRight size={18} color="#94a3b8" style={{ marginLeft: "auto" }} />

          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            style={{ 
              position: "absolute", 
              top: "2.4rem", 
              right: "12px", 
              background: "rgba(255, 255, 255, 0.12)", 
              border: "none", 
              color: "#cbd5e1", 
              cursor: "pointer",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Apple Grouped Inset Sections */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.85rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>

          {/* Section 1: AI & Cloud Telephony */}
          <div>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
              paddingLeft: "0.4rem"
            }}>
              AI & Cloud Telephony
            </div>
            <div style={{
              background: "#1e293b",
              borderRadius: "0.875rem",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden"
            }}>
              {/* ChatGPT AI */}
              <div
                onClick={() => { onClose(); if (onOpenGpt) onOpenGpt(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "background 0.15s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Bot size={17} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>ChatGPT AI Sales Copilot</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>RERA pitch & objection handler</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(52, 211, 153, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  AI 4.0
                </span>
              </div>

              {/* Exotel Telephony */}
              <div
                onClick={() => { onClose(); if (onOpenIntegrations) onOpenIntegrations("virtual_number"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhoneCall size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Exotel PSTN Calling</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Virtual Exophone & Agent SIM</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "#2563eb", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  EXOTEL
                </span>
              </div>

              {/* Multi-Channel WhatsApp */}
              <div
                onClick={() => { onClose(); if (onOpenIntegrations) onOpenIntegrations("whatsapp"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: onSimulateInbound ? "1px solid rgba(255, 255, 255, 0.05)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>WhatsApp & Meta Webhooks</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Zero-leakage instant ingestion</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(37, 211, 102, 0.2)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  ONLINE
                </span>
              </div>

              {/* Test Inbound Direct Call */}
              {onSimulateInbound && (
                <div
                  onClick={() => { onClose(); onSimulateInbound(); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 0.85rem",
                    cursor: "pointer",
                    background: "rgba(37, 99, 235, 0.1)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PhoneIncoming size={16} color="#ffffff" />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#38bdf8" }}>Test Inbound Buyer Call</div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Simulate live ringing simulation</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.65rem", background: "#0284c7", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                    SIMULATE
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Daily Operations & Verification */}
          <div>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
              paddingLeft: "0.4rem"
            }}>
              Daily Operations & Verification
            </div>
            <div style={{
              background: "#1e293b",
              borderRadius: "0.875rem",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden"
            }}>
              {/* GPS Work Attendance */}
              <div
                onClick={() => { onClose(); onOpenAttendance(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>GPS Work Attendance</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Andheri Sales Lounge check-in</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(34, 197, 94, 0.2)", color: "#4ade80", border: "1px solid rgba(74, 222, 128, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  ● CLOCKED IN
                </span>
              </div>

              {/* Verify Meetings */}
              <div
                onClick={() => { onClose(); onNavigate("dashboard"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Verify Meetings & KYC</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Confirm site visit attendance</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(245, 158, 11, 0.2)", color: "#facc15", border: "1px solid rgba(250, 204, 21, 0.3)", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  1 PENDING
                </span>
              </div>

              {/* Meeting Location & Radar */}
              <div
                onClick={() => { onClose(); if (onOpenLocation) onOpenLocation(); else onNavigate("meeting-location"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Meeting Location & Radar</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Live geofence & navigation</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>
            </div>
          </div>

          {/* Section 3: PropTech Sales Tools */}
          <div>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
              paddingLeft: "0.4rem"
            }}>
              PropTech Sales Tools
            </div>
            <div style={{
              background: "#1e293b",
              borderRadius: "0.875rem",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden"
            }}>
              {/* Digital Business Card */}
              <div
                onClick={() => { onClose(); onOpenBusinessCard(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Share2 size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Digital Business Card</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>vCard QR & MahaRERA badge</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "rgba(245, 158, 11, 0.2)", color: "#facc15", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  48 SHARES
                </span>
              </div>

              {/* Financial Calculator */}
              <div
                onClick={() => { onClose(); if (onOpenCalculator) onOpenCalculator(); else onNavigate("calculator"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>EMI & Stamp Duty Calc</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>MahaRERA cess & amortization</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "#0891b2", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  PRO
                </span>
              </div>

              {/* Stories */}
              <div
                onClick={() => { onClose(); if (onOpenStories) onOpenStories(); else onNavigate("stories"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Stories & Highlights</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Project video teasers</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "#db2777", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  NEW
                </span>
              </div>

              {/* Install App */}
              <div
                onClick={() => { onClose(); if (onOpenInstallApp) onOpenInstallApp(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Smartphone size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Install Mobile PWA App</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Add to iPhone / Android Home</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "#16a34a", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  INSTALL
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Dispositions & Logs */}
          <div>
            <div style={{
              fontSize: "0.6875rem",
              fontWeight: 800,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
              paddingLeft: "0.4rem"
            }}>
              Dispositions & KYC Logs
            </div>
            <div style={{
              background: "#1e293b",
              borderRadius: "0.875rem",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              overflow: "hidden"
            }}>
              {/* Add TCF */}
              <div
                onClick={() => { onClose(); onOpenTCF(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PlusCircle size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Add TCF (Call Feedback)</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Log 10-stage call disposition</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>

              {/* Add MCF */}
              <div
                onClick={() => { onClose(); onOpenMCF(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <List size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Add MCF (Meeting Feedback)</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>On-site client discussion notes</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>

              {/* TCF & MCF History */}
              <div
                onClick={() => { onClose(); onNavigate("tcf-list"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Historical Feedback Records</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Review past discussions & notes</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#64748b" />
              </div>

              {/* Announcements */}
              <div
                onClick={() => { onClose(); onNavigate("announcements"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", background: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Megaphone size={16} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 700, color: "#ffffff" }}>Company Announcements</div>
                    <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>New inventory & broker updates</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.65rem", background: "#ea580c", color: "#ffffff", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 800 }}>
                  3 NEW
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Luxury Footer with MahaRERA Seal */}
        <div style={{
          background: "linear-gradient(180deg, #0f172a 0%, #090d16 100%)",
          padding: "0.85rem 1rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <ShieldCheck size={16} color="#10b981" />
            <div style={{ fontSize: "0.71875rem", fontWeight: 800, color: "#cbd5e1" }}>
              MahaRERA Verified Partner
            </div>
          </div>
          <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#64748b" }}>
            v3.6.2
          </span>
        </div>

      </div>
    </div>
  );
}
