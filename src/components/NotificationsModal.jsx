import React from "react";
import { Bell, X, PhoneCall, MessageSquare, CheckCheck, Trash2, Clock, Sparkles, PhoneIncoming } from "lucide-react";

export default function NotificationsModal({ notifications, onClose, onCallLead, onWhatsAppLead, onClearAll, onMarkRead }) {
  return (
    <div className="modal-overlay">
      <div className="dialer-modal-content" style={{ maxWidth: "390px", width: "94%" }}>
        <div className="dialer-header" style={{ background: "linear-gradient(135deg, #1e293b, #0f172a)" }}>
          <div className="dialer-caller-info">
            <span className="dialer-caller-name" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bell size={18} color="#38bdf8" /> Live Lead Notifications
            </span>
            <span className="dialer-caller-sub">{notifications.length} recent alerts</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div className="dialer-body" style={{ padding: "0.75rem", maxHeight: "400px", overflowY: "auto" }}>
          {notifications.map((n) => {
            const isWhatsApp = n.type === "whatsapp" || n.source?.toLowerCase().includes("whatsapp");
            const isCall = n.type === "call" || n.title?.toLowerCase().includes("call") || n.source?.toLowerCase().includes("call");

            let badgeBg = "#dbeafe";
            let badgeColor = "#1d4ed8";
            let badgeIcon = <Sparkles size={12} />;

            if (isWhatsApp) {
              badgeBg = "#dcfce7";
              badgeColor = "#15803d";
              badgeIcon = <MessageSquare size={12} />;
            } else if (isCall) {
              badgeBg = "#ffedd5";
              badgeColor = "#c2410c";
              badgeIcon = <PhoneIncoming size={12} />;
            }

            return (
              <div
                key={n.id}
                style={{
                  background: n.read ? "#f8fafc" : "#ffffff",
                  border: n.read ? "1px solid #e2e8f0" : "1.5px solid #3b82f6",
                  borderRadius: "0.875rem",
                  padding: "0.875rem",
                  marginBottom: "0.625rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                  boxShadow: n.read ? "none" : "0 4px 12px rgba(37,99,235,0.08)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: badgeColor,
                    background: badgeBg,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}>
                    {badgeIcon} {n.source || "System Alert"}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <Clock size={12} /> {n.timeAgo || "Just now"}
                  </span>
                </div>

                <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f172a" }}>
                  {n.title}
                </div>

                <div style={{ fontSize: "0.8125rem", color: "#475569", lineHeight: "1.35" }}>
                  {n.message}
                </div>

                {/* Interactive Logic Action Buttons */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {/* WhatsApp Action Button */}
                  {isWhatsApp && n.lead && (
                    <button
                      onClick={() => {
                        if (onMarkRead) onMarkRead(n.id);
                        if (onWhatsAppLead) onWhatsAppLead(n.lead);
                        onClose();
                      }}
                      style={{
                        flex: 1,
                        background: "#25d366",
                        color: "#ffffff",
                        border: "none",
                        padding: "0.45rem 0.75rem",
                        borderRadius: "0.4rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem"
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Open WhatsApp Chat</span>
                    </button>
                  )}

                  {/* Call Action Button */}
                  {(!isWhatsApp || n.lead) && (
                    <button
                      onClick={() => {
                        if (onMarkRead) onMarkRead(n.id);
                        if (onCallLead && n.lead) onCallLead(n.lead);
                        onClose();
                      }}
                      style={{
                        flex: 1,
                        background: "#16a34a",
                        color: "#ffffff",
                        border: "none",
                        padding: "0.45rem 0.75rem",
                        borderRadius: "0.4rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem"
                      }}
                    >
                      <PhoneCall size={14} />
                      <span>Call Now</span>
                    </button>
                  )}

                  {/* Mark Read Checkmark Button */}
                  {!n.read && (
                    <button
                      onClick={() => onMarkRead && onMarkRead(n.id)}
                      title="Mark as Read"
                      style={{
                        background: "#f1f5f9",
                        color: "#64748b",
                        border: "1px solid #cbd5e1",
                        padding: "0.45rem 0.65rem",
                        borderRadius: "0.4rem",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      <CheckCheck size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#64748b" }}>
              No notifications right now.
            </div>
          )}
        </div>

        <div className="dialer-footer">
          <button
            onClick={onClearAll}
            style={{
              background: "#fee2e2",
              color: "#ef4444",
              border: "1px solid #fca5a5",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>

          <button
            onClick={onClose}
            className="save-call-btn"
            style={{ background: "#2563eb", padding: "0.5rem 1.25rem" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
