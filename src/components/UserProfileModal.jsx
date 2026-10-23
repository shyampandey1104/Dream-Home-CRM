import React from "react";
import { User, Mail, Phone, ShieldCheck, Award, LogOut, X, CheckCircle, Sparkles } from "lucide-react";

export default function UserProfileModal({ userProfile, onClose, onLogout }) {
  if (!userProfile) return null;

  const empIdText = userProfile.employee_id || (userProfile.id && typeof userProfile.id === 'string' ? userProfile.id : `EMP-${(userProfile.email || 'USER').split('@')[0].toUpperCase()}`);
  const closedCount = userProfile.closed_deals || 4;
  const callsMade = userProfile.calls_made || 156;
  const targetPct = userProfile.target_achieved || 94;

  const badgeTitle = userProfile.badge_title || "🏆 Top Closed Deals Leader";
  const metricText = userProfile.metric_text || `${closedCount} Deals Closed • ${callsMade} Calls Logged • ${targetPct}% Target`;

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
        borderRadius: "inherit",
        paddingTop: "2.5rem",
        paddingBottom: "1rem"
      }}
    >
      <div 
        className="dialer-modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ 
          maxWidth: "380px",
          width: "92%",
          background: "#ffffff",
          borderRadius: "1.5rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          animation: "scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Luxury Obsidian Modal Header */}
        <div style={{
          background: "linear-gradient(135deg, #090d16 0%, #1e293b 100%)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#ffffff"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.95rem", fontWeight: 800 }}>
              <ShieldCheck size={18} color="#f59e0b" /> MahaRERA Certified Profile
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.6875rem", marginTop: "0.1rem" }}>
              Dream Homes CRM Sales Portal
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: "rgba(255,255,255,0.15)", 
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
          
          {/* Executive Avatar & Name Hero */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{
              position: "relative",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2.5px solid #f59e0b",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
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
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#10b981",
                border: "2px solid #ffffff"
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                {userProfile.name || "Shyam Pandey"}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
                <span style={{
                  background: "#fef3c7",
                  color: "#b45309",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px",
                  border: "1px solid #fde68a"
                }}>
                  👑 Senior Sales Consultant
                </span>
                <span style={{
                  background: "#e0f2fe",
                  color: "#0284c7",
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "9999px"
                }}>
                  MahaRERA: A51800045492
                </span>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.875rem",
            padding: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
            fontSize: "0.8125rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
              <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem" }}>
                <ShieldCheck size={15} color="#2563eb" /> Employee ID:
              </span>
              <strong style={{ color: "#0f172a", fontSize: "0.78125rem", fontWeight: 800 }}>
                {userProfile.employee_id || empIdText || "EMP-SP1104"}
              </strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
              <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem" }}>
                <Mail size={15} color="#2563eb" /> Email ID:
              </span>
              <strong style={{ color: "#0f172a", fontSize: "0.75rem", fontWeight: 700 }}>
                {userProfile.email || "shyampandey1104@gmail.com"}
              </strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
              <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem" }}>
                <Phone size={15} color="#16a34a" /> Contact SIM:
              </span>
              <strong style={{ color: "#0f172a", fontSize: "0.78125rem", fontWeight: 800 }}>
                {userProfile.mobile_no || userProfile.phone || "+91 98677 78229"}
              </strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
              <span style={{ color: "#b45309", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem", fontWeight: 700 }}>
                📜 MahaRERA Reg:
              </span>
              <strong style={{ color: "#b45309", fontSize: "0.75rem", fontWeight: 800, background: "#fef3c7", padding: "0.1rem 0.4rem", borderRadius: "4px", border: "1px solid #fde68a" }}>
                A51800045492
              </strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.4rem" }}>
              <span style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem" }}>
                <Award size={15} color="#d97706" /> Department:
              </span>
              <strong style={{ color: "#0f172a", fontSize: "0.75rem", fontWeight: 700 }}>
                Luxury Residential Sales (Bandra/Andheri)
              </strong>
            </div>
          </div>

          {/* Performance Highlights Badges */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "1px solid #bbf7d0",
            borderRadius: "0.875rem",
            padding: "0.75rem 0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem"
          }}>
            <Award size={24} color="#16a34a" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#15803d" }}>
                {badgeTitle}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#166534", fontWeight: 600, marginTop: "0.1rem" }}>
                {metricText}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.65rem", marginTop: "0.25rem" }}>
            <button
              onClick={onLogout}
              style={{
                flex: 1,
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                padding: "0.65rem",
                borderRadius: "0.625rem",
                fontSize: "0.78125rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem"
              }}
            >
              <LogOut size={15} /> Logout
            </button>

            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                color: "#ffffff",
                border: "none",
                padding: "0.65rem",
                borderRadius: "0.625rem",
                fontSize: "0.78125rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
              }}
            >
              <CheckCircle size={15} /> Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
