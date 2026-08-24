import React from "react";
import { PhoneCall, PhoneOff, User, MapPin } from "lucide-react";

export default function InboundCallModal({ incomingLead, onAccept, onDecline }) {
  if (!incomingLead) return null;

  return (
    <div className="modal-overlay">
      <div className="inbound-ring-card">
        <div className="ring-avatar">
          <PhoneCall size={32} className="animate-pulse" />
        </div>

        <h2 className="ring-caller-name">{incomingLead.name}</h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          {incomingLead.phone}
        </p>

        <span className="ring-source-tag">
          ⚡ Incoming Lead from {incomingLead.source}
        </span>

        <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1rem" }}>
          <p><strong>Service:</strong> {incomingLead.service}</p>
          <p><strong>Location:</strong> {incomingLead.location}</p>
          <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#64748b" }}>
            "{incomingLead.notes}"
          </p>
        </div>

        <div className="ring-actions">
          <button className="ring-btn decline" onClick={onDecline} title="Decline Call">
            <PhoneOff size={24} />
          </button>

          <button className="ring-btn accept" onClick={() => onAccept(incomingLead)} title="Accept Call & Open Dialer">
            <PhoneCall size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
