import React, { useState } from "react";
import { X, UserPlus, User, Phone, Mail, MapPin, Tag, FileText, Sparkles, Flame } from "lucide-react";
import { saveLeadApi } from "../services/apiService";
import CustomAlertDialog from "./CustomAlertDialog";

export default function AddLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Home Buying");
  const [bhkType, setBhkType] = useState("2 BHK");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("Direct Inquiry");
  const [priority, setPriority] = useState("HOT");
  const [notes, setNotes] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setAlertConfig({ title: "Name Required", message: "Please enter Lead Full Name!", type: "warning" });
      return;
    }
    if (!phone.trim()) {
      setAlertConfig({ title: "Phone Required", message: "Please enter Lead Phone Number!", type: "warning" });
      return;
    }

    const newLeadObj = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      lead_name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      service: service,
      bhkType: bhkType,
      bhk_type: bhkType,
      location: location.trim() || "Mumbai",
      source: source,
      priority: priority,
      status: "NEW",
      timeAgo: "Just Now",
      callCount: 0,
      notes: notes.trim() || "Fresh lead created manually via CRM Portal"
    };

    // Save to MariaDB
    const res = await saveLeadApi(newLeadObj);
    if (res && res.lead_id) {
      newLeadObj.id = res.lead_id;
    }

    if (onLeadCreated) {
      onLeadCreated(newLeadObj);
    }

    setAlertConfig({
      title: "Lead Created!",
      message: `🎉 Fresh Lead '${name}' added successfully & synced to CRM Database!`,
      type: "success"
    });
    
    // Reset Form
    setName("");
    setPhone("");
    setEmail("");
    setLocation("");
    setNotes("");
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(6px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "1.25rem",
        width: "100%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
        border: "1px solid #cbd5e1",
        position: "relative"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          borderTopLeftRadius: "1.25rem",
          borderTopRightRadius: "1.25rem"
        }}>
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UserPlus size={20} color="#38bdf8" /> Add New Fresh Lead
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0 0" }}>
              Create fresh customer lead & assign directly to telecallers
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Full Name & Phone Number */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Lead Full Name *
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. Rohan Mehta"
                  style={{ paddingLeft: "2.3rem" }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Phone Number *
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="+91 98000 00000"
                  style={{ paddingLeft: "2.3rem" }}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email & Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                <input
                  type="email"
                  className="modern-search-input"
                  placeholder="rohan@gmail.com"
                  style={{ paddingLeft: "2.3rem" }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Preferred Locality
              </label>
              <div style={{ position: "relative" }}>
                <MapPin size={16} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. Bandra West, Mumbai"
                  style={{ paddingLeft: "2.3rem" }}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BHK Type & Purpose Service */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                BHK Type
              </label>
              <select
                className="modern-search-input"
                value={bhkType}
                onChange={e => setBhkType(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Requirement / Service
              </label>
              <select
                className="modern-search-input"
                value={service}
                onChange={e => setService(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="Home Buying">🏡 Home Buying</option>
                <option value="Site Visit Booking">🚗 Site Visit Booking</option>
                <option value="Valuation & Selling">💰 Valuation & Selling</option>
                <option value="Commercial Rental">🏢 Commercial Rental</option>
              </select>
            </div>
          </div>

          {/* Source & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Lead Source
              </label>
              <select
                className="modern-search-input"
                value={source}
                onChange={e => setSource(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="Direct Inquiry">📞 Direct Inquiry / Call</option>
                <option value="Instagram Ads">📸 Instagram Ads</option>
                <option value="Google Ads">🔍 Google Ads</option>
                <option value="Facebook Ads">👍 Facebook Ads</option>
                <option value="MagicBricks">🏢 MagicBricks</option>
                <option value="Walk-in">🚪 Walk-in</option>
                <option value="Referral">🤝 Referral</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Priority Level
              </label>
              <select
                className="modern-search-input"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="HOT">🔥 HOT Priority</option>
                <option value="WARM">⚡ WARM Priority</option>
                <option value="COLD">❄️ COLD Priority</option>
              </select>
            </div>
          </div>

          {/* Customer Requirements / Notes */}
          <div>
            <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
              Notes & Customer Requirements
            </label>
            <textarea
              className="modern-search-input"
              rows={3}
              placeholder="e.g. Buyer interested in Kalpataru Vian or Godrej Horizon. Budget 2.5 Cr. Callback requested in evening."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ height: "auto", resize: "vertical" }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              fontSize: "0.9375rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
              marginTop: "0.5rem"
            }}
          >
            <UserPlus size={18} /> Create & Add Lead to CRM Database
          </button>
        </form>

        {alertConfig && (
          <CustomAlertDialog
            isOpen={!!alertConfig}
            onClose={() => setAlertConfig(null)}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
          />
        )}
      </div>
    </div>
  );
}
