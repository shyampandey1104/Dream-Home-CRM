import React from "react";
import { User, Mail, Phone, ShieldCheck, Award, LogOut, X, Check } from "lucide-react";

export default function UserProfileModal({ userProfile, onClose, onLogout }) {
  if (!userProfile) return null;

  const displayName = userProfile?.name || "Shyam Pandey";
  const displayEmail = userProfile?.email || "shyampandey1104@gmail.com";
  const displayPhone = userProfile?.mobile_no || userProfile?.phone || "9867778229";
  const displayRole = userProfile?.role || "Senior Sales Consultant";

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
    >
      <div 
        className="dialer-modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: "380px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          animation: "scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Solid Blue Header (matching media_1792776035996_e586e877.png) */}
        <div style={{
          background: "#2563eb",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#ffffff"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "1rem", fontWeight: 800 }}>
              <User size={18} color="#ffffff" /> Employee Profile
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.71875rem", marginTop: "0.15rem" }}>
              LeadCall CRM Sales Portal
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: "rgba(255,255,255,0.2)", 
              border: "none", 
              color: "#ffffff", 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center" 
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Profile Card Body */}
        <div style={{ padding: "1.25rem", gap: "1rem", display: "flex", flexDirection: "column" }}>
          
          {/* Hero: Gold Logo + Shyam Pandey */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              width: "54px",
              height: "54px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
            }}>
              <img 
                src="https://dreamhomes-a8q0k6kx6-panorama7.vercel.app/apple-touch-icon.png" 
                alt="Dream Homes"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `<div style="font-weight:900;color:#f59e0b;font-size:1.1rem;">DH</div>`;
                }}
                style={{ width: "42px", height: "42px", objectFit: "contain" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                {displayName}
              </h2>
              <div style={{ marginTop: "0.25rem" }}>
                <span style={{
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  display: "inline-block"
                }}>
                  {displayRole}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Details Table */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #f1f5f9",
            borderRadius: "0.75rem",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.78125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#64748b" }}>
                <ShieldCheck size={14} color="#3b82f6" />
                <span>Employee ID / Name:</span>
              </div>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{displayName}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.78125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#64748b" }}>
                <Mail size={14} color="#3b82f6" />
                <span>Email:</span>
              </div>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{displayEmail}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.78125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#64748b" }}>
                <Phone size={14} color="#3b82f6" />
                <span>Mobile:</span>
              </div>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{displayPhone}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.85rem", fontSize: "0.78125rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: "#64748b" }}>
                <Award size={14} color="#f59e0b" />
                <span>Department:</span>
              </div>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Real Estate Sales & PDI</span>
            </div>
          </div>

          {/* Active Sales Telecaller Status Card */}
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "0.75rem",
            padding: "0.75rem 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem"
          }}>
            <Award size={18} color="#16a34a" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#15803d" }}>
                🔥 Active Sales Telecaller
              </div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: 600, marginTop: "0.1rem" }}>
                156 Calls Logged • 92% Target Achieved
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem" }}>
            <button
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.65rem 0.85rem",
                background: "#fef2f2",
                color: "#ef4444",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <LogOut size={14} /> Logout Account
            </button>

            <button
              onClick={onClose}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.65rem 0.85rem",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              <Check size={14} /> Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
