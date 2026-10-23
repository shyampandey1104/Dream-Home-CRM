import React from "react";
import { 
  X, User, Share2, Clock, MapPin, Sparkles, FileText, List, 
  PlusCircle, HelpCircle, Bot, Calculator, Smartphone, PhoneIncoming, 
  MessageSquare, PhoneCall, ChevronRight
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
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch"
      }}
    >
      <div 
        className="sidebar-drawer-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "82%",
          maxWidth: "340px",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "6px 0 24px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          animation: "slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Dark Top Profile Header (matching reference image) */}
        <div 
          onClick={() => { onClose(); onOpenProfile(); }}
          style={{
            background: "#1e293b",
            color: "#ffffff",
            padding: "1.25rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            position: "relative",
            cursor: "pointer",
            flexShrink: 0
          }}
        >
          {/* Blue Avatar Circle */}
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)"
          }}>
            <User size={24} color="#ffffff" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em" }}>
              {currentUser?.name || "Shyam Pandey"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#facc15", fontWeight: 700, marginTop: "0.1rem" }}>
              👑 Senior Sales Consultant
            </div>
            <div style={{ fontSize: "0.71875rem", color: "#94a3b8", fontWeight: 500, marginTop: "0.1rem" }}>
              {phoneText}
            </div>
          </div>

          {/* Close X and Chevron */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              style={{ 
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
                transition: "background 0.15s"
              }}
              title="Close Menu"
            >
              <X size={15} />
            </button>
            <ChevronRight size={16} color="#94a3b8" />
          </div>
        </div>

        {/* Pure White Drawer Body */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          background: "#ffffff",
          padding: "0.875rem 0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem"
        }}>
          {/* Highlight Card 1: ChatGPT AI Copilot */}
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
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <Bot size={18} color="#10b981" />
              <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#047857" }}>
                ChatGPT AI Copilot
              </span>
            </div>
            <span style={{
              background: "#10b981",
              color: "#ffffff",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              letterSpacing: "0.02em"
            }}>
              AI 4.0
            </span>
          </div>

          {/* Highlight Card 2: Exotel Telephony & Calling */}
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
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <PhoneCall size={18} color="#2563eb" />
              <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#1d4ed8" }}>
                Exotel Telephony & Calling
              </span>
            </div>
            <span style={{
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              letterSpacing: "0.02em"
            }}>
              EXOTEL
            </span>
          </div>

          {/* Highlight Card 3: Multi-Channel Integrations */}
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
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <MessageSquare size={18} color="#10b981" />
              <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#047857" }}>
                Multi-Channel Integrations
              </span>
            </div>
            <span style={{
              background: "#10b981",
              color: "#ffffff",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "0.2rem 0.55rem",
              borderRadius: "9999px",
              letterSpacing: "0.02em"
            }}>
              SETUP
            </span>
          </div>

          {/* List Menu Items on Pure White */}
          <div style={{ marginTop: "0.35rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            
            {/* Take a Tour */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("dashboard"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <HelpCircle size={18} color="#64748b" />
              <span>Take a Tour</span>
            </div>

            {/* Share Business Card */}
            <div
              onClick={() => { onClose(); if (onOpenBusinessCard) onOpenBusinessCard(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <Share2 size={18} color="#64748b" />
              <span>Share Business Card</span>
            </div>

            {/* Work Attendance */}
            <div
              onClick={() => { onClose(); if (onOpenAttendance) onOpenAttendance(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Clock size={18} color="#64748b" />
                <span>Work Attendance</span>
              </div>
              <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 700 }}>
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
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#2563eb",
                fontSize: "0.875rem",
                fontWeight: 700,
                background: "rgba(37, 99, 235, 0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <PhoneIncoming size={18} color="#2563eb" />
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
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <MapPin size={18} color="#64748b" />
              <span>Meeting Location & Live Radar</span>
            </div>

            {/* Stories & Highlights */}
            <div
              onClick={() => { onClose(); if (onOpenStories) onOpenStories(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Sparkles size={18} color="#64748b" />
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
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Calculator size={18} color="#ea580c" />
                <span style={{ fontSize: "0.8125rem" }}>Real Estate Calculator (EMI/ROI)</span>
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
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Smartphone size={18} color="#16a34a" />
                <span style={{ fontSize: "0.8125rem" }}>Install App on Phone (iOS/Android)</span>
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

            <div style={{ height: "1px", background: "#f1f5f9", margin: "0.4rem 0" }} />

            {/* Add TCF (Call Feedback) */}
            <div
              onClick={() => { onClose(); if (onOpenTCF) onOpenTCF(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <PlusCircle size={18} color="#64748b" />
              <span>Add TCF (Call Feedback)</span>
            </div>

            {/* TCF List */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("tcf-list"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <FileText size={18} color="#64748b" />
              <span>TCF List</span>
            </div>

            {/* Add MCF (Meeting Feedback) */}
            <div
              onClick={() => { onClose(); if (onOpenMCF) onOpenMCF(); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <PlusCircle size={18} color="#64748b" />
              <span>Add MCF (Meeting Feedback)</span>
            </div>

            {/* MCF List */}
            <div
              onClick={() => { onClose(); if (onNavigate) onNavigate("mcf-list"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#1e293b",
                fontSize: "0.875rem",
                fontWeight: 600
              }}
            >
              <List size={18} color="#64748b" />
              <span>MCF List</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
