import React from "react";
import { Phone, Bell, Menu, MessageSquare } from "lucide-react";

export default function MobileHeader({ 
  currentTab, 
  unreadCount, 
  onDirectCall, 
  onOpenNotifications, 
  userProfile, 
  onOpenProfile, 
  onOpenSidebar, 
  onOpenIntegrations, 
  orgProfile, 
  onSimulateInbound 
}) {
  const companyName = orgProfile?.company_name || "Dream Homes";
  const userInitials = (userProfile?.name || "Shyam Pandey")
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className="mobile-app-header" 
      style={{ 
        height: "54px", 
        padding: "0 0.75rem", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Left Branding Group */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", minWidth: 0, flexShrink: 1 }}>
        <button 
          onClick={onOpenSidebar} 
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#0f172a",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            flexShrink: 0,
            padding: 0
          }}
          title="Open Menu"
        >
          <Menu size={18} color="#0f172a" />
        </button>

        <div 
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", minWidth: 0 }} 
          onClick={onOpenProfile}
          title="Dream Homes Sales CRM"
        >
          <img
            src={orgProfile?.logo_url || "/assets/real_state_crm/frontend/dreamhomes_gold_logo.jpg"}
            alt="Dream Homes"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/dreamhomes_gold_logo.jpg";
            }}
            style={{
              width: "28px",
              height: "28px",
              objectFit: "contain",
              filter: "drop-shadow(0 1px 3px rgba(217, 119, 6, 0.25))",
              flexShrink: 0,
              borderRadius: "6px"
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{
              fontWeight: 900,
              fontSize: "0.875rem",
              color: "#0f172a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
              letterSpacing: "-0.01em"
            }}>
              {companyName}
            </span>
            <span style={{ 
              fontSize: "0.625rem", 
              color: "#16a34a", 
              fontWeight: 800, 
              lineHeight: 1.1, 
              whiteSpace: "nowrap" 
            }}>
              ● CRM Live
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Group */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
        {/* Quick Direct Call Button */}
        <button
          onClick={onDirectCall}
          title="Click-to-Call Next Lead"
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: "#ffffff",
            border: "none",
            height: "30px",
            padding: "0 0.55rem",
            borderRadius: "8px",
            fontSize: "0.71875rem",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "3px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)"
          }}
        >
          <Phone size={12} fill="#ffffff" />
          <span>Call</span>
        </button>

        {/* WhatsApp & Integrations Button */}
        <button
          onClick={onOpenIntegrations}
          title="WhatsApp & Lead Integrations"
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#15803d",
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            padding: 0
          }}
        >
          <MessageSquare size={14} color="#16a34a" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            color: "#475569",
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            padding: 0
          }}
          title="Notifications"
        >
          <Bell size={15} color="#475569" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "0.5625rem",
              fontWeight: 800,
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #ffffff"
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar Pill */}
        <button
          onClick={onOpenProfile}
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            fontSize: "0.6875rem",
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)",
            flexShrink: 0,
            padding: 0
          }}
          title={`Profile: ${userProfile?.name || "Shyam Pandey"}`}
        >
          {userInitials}
        </button>
      </div>
    </div>
  );
}
