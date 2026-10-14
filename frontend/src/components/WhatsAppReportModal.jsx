import React, { useState } from "react";
import { Send, X, CheckCircle, MessageSquare, Smartphone, User, Sparkles } from "lucide-react";
import { sendWhatsAppTemplateApi } from "../services/apiService";

export default function WhatsAppReportModal({ lead, onClose }) {
  const [targetRecipient, setTargetRecipient] = useState("client"); // 'client' | 'agent'
  const [reportType, setReportType] = useState("Srishti Oasis – Bhandup (West)");

  const agentPhone = "9867778229";
  const clientPhone = lead?.phone ? lead.phone.replace(/[^0-9]/g, "") : "9820591823";

  const clientTemplates = {
    "Srishti Oasis – Bhandup (West)": `Hello ${lead?.name || 'Customer'},\n\n✨ *Srishti Oasis – Bhandup (West)*\n*THE GMLR – Get More Life. Less Rush.*\n\nExperience premium living with 1, 2 & 3 BHK Sun-Deck Residences at Mumbai's 1st Residential Project with Direct Access to GMLR!\n\n🏡 *Configuration & Pricing (All Inclusive):*\n• *1 BHK*: 425 - 460 sq.ft – ₹1.08 Cr to ₹1.19 Cr\n• *2 BHK*: 620 - 660 sq.ft – ₹1.59 Cr to ₹1.73 Cr\n• *3 BHK*: 855 - 910 sq.ft – ₹2.04 Cr to ₹2.26 Cr\n\n⭐ *Project Highlights:*\n✔️ 36-Storey Premium Residential Tower\n✔️ Fully Modular Kitchen with every apartment\n✔️ 50+ Lifestyle Amenities (40,000+ sq.ft Podium & Sky Lounge)\n✔️ 12 Months Holiday EMI & Flexi Pay Plan\n\n📍 *MahaRERA No.*: P51800051004\n\n📞 Reply here to book your VIP site visit today!\n\n*Dream Homes Real Estate*\nShyam Pandey: +91 98677 78229`,
    "Kalpataru Vian (Andheri West)": `Hello ${lead?.name || 'Customer'},\n\n🏢 *Kalpataru Vian (Andheri West)*\n\nHere is the brochure & pricing detail for Kalpataru Vian.\n\n• *Configuration*: 2 & 3 BHK Ultra Luxury Residences\n• *Carpet Area*: 780 - 1150 sq.ft.\n• *Price*: ₹2.15 Cr Onwards\n• *Location*: Prime Link Road & Metro Line 2A Connectivity\n\nPlease let us know if you would like to book a private VIP walkthrough!\n\n*Dream Homes Real Estate*\nShyam Pandey: +91 98677 78229`,
    "Godrej Horizon Wadala Brochure": `Hello ${lead?.name || 'Customer'},\n\n🌟 *Godrej Horizon (Wadala Mumbai)*\n\n• *Configuration*: 2 & 3 BHK Sea View Homes\n• *Carpet Area*: 680 - 1050 sq.ft.\n• *Price*: ₹1.85 Cr - ₹3.20 Cr\n• *Highlights*: Private 5-Acre Parkland, 5 Mins from Eastern Freeway\n\nReply to this message to book your site visit!\n\n*Dream Homes Real Estate*\nShyam Pandey: +91 98677 78229`,
    "Oberoi Sky City Borivali East": `Hello ${lead?.name || 'Customer'},\n\n🌆 *Oberoi Sky City (Borivali East)*\n\n• *Configuration*: 3 & 4 BHK Ultra Luxury Residences\n• *Carpet Area*: 1050 - 1980 sq.ft.\n• *Price*: ₹3.40 Cr - ₹6.20 Cr\n• *Highlights*: Integrated 25-Acre Township on Western Express Highway\n\nReply to this message for site visit booking!\n\n*Dream Homes Real Estate*\nShyam Pandey: +91 98677 78229`,
    "Site Visit Confirmation & Location": `Hello ${lead?.name || 'Customer'},\n\n✅ *Your VIP Site Visit is Confirmed!*\n\n📍 Venue: Sales Experience Center, ${lead?.location || 'Mumbai'}\n⏰ Time: Scheduled Today\n🚗 Pick & Drop Cab: Dedicated Chauffeur Assigned\n👤 Relationship Executive: Shyam Pandey (+91 98677 78229)\n\nLooking forward to welcoming you!\n*Dream Homes Real Estate*`,
    "Payment Plan & Flexi EMI": `Hello ${lead?.name || 'Customer'},\n\n💳 *Special Festive Flexi Payment Plan*\n\n• *Down Payment*: Only 10% on Booking\n• *Bank Loan*: Pre-approved with SBI / HDFC at special ROI\n• *No Pre-EMI*: 12 Months EMI Holiday\n• *Government Charges*: Zero Stamp Duty Offer\n\nContact us to lock this limited-period pricing!\n*Dream Homes Real Estate*\nShyam Pandey: +91 98677 78229`
  };

  const agentTemplates = {
    "🚨 Hot Lead Alert to Agent": `🚨 *NEW HOT LEAD ASSIGNED TO YOU!* 🚨\n\n👤 *Client Name:* ${lead?.name || 'Client'}\n📞 *Client Mobile:* ${lead?.phone || '+91 98205 91823'}\n📧 *Email:* ${lead?.email || 'N/A'}\n🏢 *Property Interest:* ${lead?.bhkType || '2 BHK'} in ${lead?.location || 'Mumbai'}\n🎯 *Lead Source:* ${lead?.source || 'WhatsApp Business'}\n📝 *Client Notes:* ${lead?.notes || 'Fresh inquiry captured from campaign'}\n\n👉 *Open CRM:* https://allodially-goodish-lydia.ngrok-free.dev/crm\n⚡ Call the client right now for highest conversion!`,
    "📞 Callback Request Alert": `📞 *IMMEDIATE CALLBACK REQUEST* 📞\n\nClient *${lead?.name || 'Customer'}* has requested an instant call regarding ${lead?.bhkType || '2 BHK'} in ${lead?.location || 'Mumbai'}.\n\n📱 *Mobile Number:* ${lead?.phone || '+91 98205 91823'}\n⏰ *Requested Time:* Immediate / As soon as possible\n\nTap to call client: tel:${lead?.phone || '+91 98205 91823'}`
  };

  const currentTemplates = targetRecipient === "client" ? clientTemplates : agentTemplates;
  const [customMsg, setCustomMsg] = useState(clientTemplates["Srishti Oasis – Bhandup (West)"]);

  if (!lead) return null;

  const handleRecipientSwitch = (recipient) => {
    setTargetRecipient(recipient);
    if (recipient === "client") {
      setReportType("Srishti Oasis – Bhandup (West)");
      setCustomMsg(clientTemplates["Srishti Oasis – Bhandup (West)"]);
    } else {
      setReportType("🚨 Hot Lead Alert to Agent");
      setCustomMsg(agentTemplates["🚨 Hot Lead Alert to Agent"]);
    }
  };

  const handleTemplateChange = (e) => {
    const selected = e.target.value;
    setReportType(selected);
    if (currentTemplates[selected]) {
      setCustomMsg(currentTemplates[selected]);
    }
  };

  const handleSend = async () => {
    let cleanPhone = targetRecipient === "client" ? clientPhone : "919867778229";
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }
    const text = encodeURIComponent(customMsg);

    // Call backend API to record the dispatched template in MariaDB
    try {
      await sendWhatsAppTemplateApi({
        toPhone: cleanPhone,
        templateType: reportType,
        leadName: lead.name,
        projectName: lead.location,
        sendToAgent: targetRecipient === "agent" ? 1 : 0,
        customMessage: customMsg,
        clientPhone: lead.phone,
        bhk: lead.bhkType,
        location: lead.location,
        source: lead.source
      });
    } catch (e) {}
    
    // Free official WhatsApp Deep Link (Opens WhatsApp Web on Desktop or WhatsApp App on Mobile)
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 99999 }}>
      <div className="dialer-modal-content" style={{ maxWidth: "420px", width: "95%" }}>
        {/* Header */}
        <div className="dialer-header" style={{ background: "linear-gradient(135deg, #15803d, #16a34a)" }}>
          <div className="dialer-caller-info">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MessageSquare size={18} color="#ffffff" />
              <span className="dialer-caller-name">Send Free WhatsApp Template</span>
            </div>
            <span className="dialer-caller-sub">
              {targetRecipient === "client" ? `Client: ${lead.name} (${lead.phone})` : `Agent Phone: +91 98677 78229 (Shyam Pandey)`}
            </span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#ffffff", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <div className="dialer-body" style={{ padding: "1rem" }}>
          {/* Target Recipient Selector */}
          <div style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem", display: "block" }}>
              Recipient Destination
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => handleRecipientSwitch("client")}
                style={{
                  padding: "0.5rem 0.65rem",
                  border: targetRecipient === "client" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                  background: targetRecipient === "client" ? "#f0fdf4" : "#ffffff",
                  color: targetRecipient === "client" ? "#166534" : "#475569",
                  borderRadius: "0.625rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem"
                }}
              >
                <User size={14} color={targetRecipient === "client" ? "#16a34a" : "#64748b"} />
                <span>Client Phone</span>
              </button>

              <button
                type="button"
                onClick={() => handleRecipientSwitch("agent")}
                style={{
                  padding: "0.5rem 0.65rem",
                  border: targetRecipient === "agent" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                  background: targetRecipient === "agent" ? "#eff6ff" : "#ffffff",
                  color: targetRecipient === "agent" ? "#1d4ed8" : "#475569",
                  borderRadius: "0.625rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem"
                }}
              >
                <Smartphone size={14} color={targetRecipient === "agent" ? "#2563eb" : "#64748b"} />
                <span>My Phone (9867778229)</span>
              </button>
            </div>
          </div>

          {/* Template Dropdown */}
          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
              Select WhatsApp Template
            </label>
            <select
              className="select-input"
              value={reportType}
              onChange={handleTemplateChange}
              style={{ fontSize: "0.8125rem", fontWeight: 600 }}
            >
              {Object.keys(currentTemplates).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          {/* Editable Message Content */}
          <div className="form-group" style={{ marginBottom: "0.25rem" }}>
            <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
              WhatsApp Message Preview
            </label>
            <textarea
              className="textarea-input"
              style={{ minHeight: "150px", fontSize: "0.8125rem", lineHeight: "1.45", fontFamily: "inherit" }}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="dialer-footer" style={{ padding: "0.75rem 1rem", borderTop: "1px solid #e2e8f0" }}>
          <button className="end-call-btn" onClick={onClose} style={{ background: "#94a3b8" }}>
            Cancel
          </button>
          <button 
            className="save-call-btn" 
            onClick={handleSend} 
            style={{ 
              background: targetRecipient === "agent" ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "linear-gradient(135deg, #16a34a, #15803d)", 
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
            }}
          >
            <Send size={15} style={{ marginRight: 6 }} />
            <span>{targetRecipient === "agent" ? "Send Alert to My Number" : "Send WhatsApp to Client"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
