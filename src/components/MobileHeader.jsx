import React from "react";
import { Phone, Bell, Zap, Menu, MessageSquare } from "lucide-react";

export default function MobileHeader({ unreadCount, onDirectCall, onOpenNotifications, userProfile, onOpenProfile, onOpenSidebar, onOpenIntegrations, orgProfile, onSimulateInbound }) {
  const companyName = orgProfile?.company_name || "Dream Homes";
  const userInitials = (userProfile?.name || "Shyam Pandey").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div 
      className="mobile-app-header" 
      style={{ 
        height: "56px", 
        padding: "0 0.85rem", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "#0b0f19",
        borderBottom: "1px solid #1e293b",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)"
      }}
    >
      {/* Left Branding Group */}
      <div className="mobile-header-left" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <button 
          onClick={onOpenSidebar} 
          style={{
            background: "rgba(14, 165, 233, 0.15)",
            border: "1px solid rgba(14, 165, 233, 0.3)",
            color: "#38bdf8",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.35rem",
            borderRadius: "0.5rem",
            flexShrink: 0
          }}
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }} onClick={onOpenProfile}>
          <img
            src={orgProfile?.logo_url || "/assets/real_state_crm/frontend/dreamhomes_gold_logo.jpg"}
            alt="Dream Homes Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/dreamhomes_gold_logo.jpg";
            }}
            style={{
              width: "32px",
              height: "32px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4))",
              flexShrink: 0,
              borderRadius: "6px"
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{
              fontWeight: 900,
              fontSize: "0.95rem",
              color: "#ffffff",
              whiteSpace: "nowrap",
              lineHeight: 1.15,
              letterSpacing: "-0.01em"
            }}>
              {companyName}
            </span>
            <span style={{ fontSize: "0.625rem", color: "#f59e0b", fontWeight: 800, lineHeight: 1.1, whiteSpace: "nowrap" }}>
              {orgProfile?.company_tagline || "CRM Sales Portal"}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Group */}
      <div className="mobile-header-right" style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
        {/* Quick Direct Call Button */}
        <button
          onClick={onDirectCall}
          title="Direct Call Next Lead"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            border: "none",
            padding: "0.35rem 0.55rem",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)"
          }}
        >
          <Phone size={13} fill="#ffffff" />
          <span>Call</span>
        </button>

        {/* WhatsApp & Multi-Channel Integrations Button */}
        <button
          onClick={onOpenIntegrations}
          title="WhatsApp, Instagram & Multi-Channel Integrations"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            color: "#34d399",
            height: "30px",
            padding: "0 0.5rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(16, 185, 129, 0.2)",
            flexShrink: 0,
            fontSize: "0.725rem",
            fontWeight: 800
          }}
        >
          <MessageSquare size={13} color="#34d399" />
          <span>WhatsApp</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid #1e293b",
            color: "#cbd5e1",
            padding: "0.35rem",
            borderRadius: "0.5rem",
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "0.625rem",
              fontWeight: 800,
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Pill */}
        <button
          onClick={onOpenProfile}
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "9999px",
            width: "30px",
            height: "30px",
            fontSize: "0.75rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(245, 158, 11, 0.35)"
          }}
          title="User Profile"
        >
          {userInitials}
        </button>
      </div>
    </div>
  );
}
