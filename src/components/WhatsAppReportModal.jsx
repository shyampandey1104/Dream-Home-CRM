import React, { useState } from "react";
import { Send, X, CheckCircle, MessageSquare } from "lucide-react";

export default function WhatsAppReportModal({ lead, onClose }) {
  const [reportType, setReportType] = useState("Kalpataru Vian Brochure & Pricing");

  const templates = {
    "Kalpataru Vian Brochure & Pricing": `Hello ${lead?.name || 'Customer'},\nHere is the brochure & pricing detail for Kalpataru Vian (Andheri West).\n\n🏢 2 & 3 BHK Luxury Residences\n📐 780 - 1150 sq.ft. Carpet Area\n💰 Price: INR 2.15 Cr Onwards\n📍 Infinity Mall Connectivity\n\nPlease let us know if you would like to book a site visit cab!`,
    "Purva Estrella Lokhandwala Brochure": `Hello ${lead?.name || 'Customer'},\nHere is the brochure & layout plan for Purva Estrella (Lokhandwala).\n\n🌟 3 & 4 BHK Ultra-Luxury Homes\n📐 1250 - 2200 sq.ft. Carpet Area\n💰 Price: INR 2.75 Cr - 7.75 Cr\n🏊 45,000 sq.ft. Landscaped Club House\n\nReply to this message for site visit booking!`,
    "PDI Pre-Delivery Inspection Checklist": `Hello ${lead?.name || 'Customer'},\nHere is your inspection report sample & service plan for ${lead?.service || 'Real Estate Services'} in ${lead?.location || 'Mumbai'}.\n\n✅ Pre-Delivery Inspection (120+ checkpoints)\n✅ Thermal Seepage Check\n✅ Layout & Carpet Area Verification\n\nPlease let us know when our senior inspector can visit.`,
    "Site Visit Confirmation & Location": `Hello ${lead?.name || 'Customer'},\nYour Site Visit is confirmed!\n\n📍 Venue: Sales Experience Center, ${lead?.location || 'Andheri West'}\n⏰ Time: Scheduled Today\n🚗 Pick & Drop Cab: Driver Details Shared\n\nSee you soon!`
  };

  const [customMsg, setCustomMsg] = useState(templates["Kalpataru Vian Brochure & Pricing"]);

  if (!lead) return null;

  const handleTemplateChange = (e) => {
    const selected = e.target.value;
    setReportType(selected);
    if (templates[selected]) {
      setCustomMsg(templates[selected]);
    }
  };

  const handleSend = () => {
    let cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "919820591823";
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }
    const text = encodeURIComponent(customMsg);
    
    // Free official WhatsApp Deep Link (Works on Web & Mobile WhatsApp App)
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="dialer-modal-content" style={{ maxWidth: "440px", width: "94%" }}>
        <div className="dialer-header" style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}>
          <div className="dialer-caller-info">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MessageSquare size={18} color="#ffffff" />
              <span className="dialer-caller-name">Send Free WhatsApp Report</span>
            </div>
            <span className="dialer-caller-sub">To: {lead.name} (+{lead.phone})</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div className="dialer-body">
          <div className="form-group">
            <label className="form-label">Select Instant WhatsApp Template</label>
            <select
              className="select-input"
              value={reportType}
              onChange={handleTemplateChange}
            >
              <option>Kalpataru Vian Brochure & Pricing</option>
              <option>Purva Estrella Lokhandwala Brochure</option>
              <option>PDI Pre-Delivery Inspection Checklist</option>
              <option>Site Visit Confirmation & Location</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Pre-filled WhatsApp Message Content</label>
            <textarea
              className="textarea-input"
              style={{ minHeight: "140px", fontSize: "0.8125rem", lineHeight: "1.4" }}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
            />
          </div>
        </div>

        <div className="dialer-footer">
          <button className="end-call-btn" onClick={onClose} style={{ background: "#94a3b8" }}>
            Cancel
          </button>
          <button className="save-call-btn" onClick={handleSend} style={{ background: "#25d366", color: "#ffffff" }}>
            <Send size={16} style={{ marginRight: 6 }} />
            <span>Open WhatsApp App & Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
