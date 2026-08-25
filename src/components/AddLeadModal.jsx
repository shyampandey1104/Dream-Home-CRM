import React, { useState, useEffect } from "react";
import { X, UserPlus, User, Phone, Mail, MapPin, Tag, FileText, Sparkles, Flame, CheckCircle2, Edit3 } from "lucide-react";
import { saveLeadApi } from "../services/apiService";
import CustomAlertDialog from "./CustomAlertDialog";

export default function AddLeadModal({ isOpen, onClose, onLeadCreated, initialData = null }) {
  const isEditing = !!initialData;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Home Buying");
  const [bhkType, setBhkType] = useState("2 BHK");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("Direct Walk-in");
  const [priority, setPriority] = useState("HOT");
  const [notes, setNotes] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || initialData.lead_name || "");
      setPhone(initialData.phone || "");
      setEmail(initialData.email || "");
      setService(initialData.service || "Home Buying");
      setBhkType(initialData.bhkType || initialData.bhk_type || "2 BHK");
      setLocation(initialData.location || "");
      setSource(initialData.source || "Direct Walk-in");
      setPriority(initialData.priority || "HOT");
      setNotes(initialData.notes || "");
    } else {
      setName("");
      setPhone("");
      setEmail("");
      setService("Home Buying");
      setBhkType("2 BHK");
      setLocation("");
      setSource("Direct Walk-in");
      setPriority("HOT");
      setNotes("");
    }
  }, [initialData, isOpen]);

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

    const leadObj = {
      id: initialData?.id || `LEAD-${Date.now().toString().slice(-4)}`,
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
      status: initialData?.status || "NEW",
      timeAgo: initialData?.timeAgo || "Just Now",
      callCount: initialData?.callCount || 0,
      notes: notes.trim() || (isEditing ? "" : "Fresh lead created manually via CRM Portal"),
      history: initialData?.history || []
    };

    // Save to Backend Database
    const res = await saveLeadApi(leadObj);
    if (res && res.lead_id) {
      leadObj.id = res.lead_id;
    }

    if (onLeadCreated) {
      onLeadCreated(leadObj);
    }

    setAlertConfig({
      title: isEditing ? "Lead Updated!" : "Lead Created!",
      message: isEditing
        ? `✅ Lead '${name}' has been updated successfully!`
        : `🎉 Fresh Lead '${name}' saved to Database! (Lead ID: ${res?.lead_id || leadObj.id})`,
      type: "success"
    });
  };

  const handleAlertClose = () => {
    setAlertConfig(null);
    onClose();
  };

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.75rem",
        overflowY: "auto"
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "390px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
          border: "1px solid #cbd5e1",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          flexShrink: 0
        }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {isEditing ? (
                <>
                  <Edit3 size={18} color="#38bdf8" /> Edit Lead Details
                </>
              ) : (
                <>
                  <UserPlus size={18} color="#38bdf8" /> Add New Fresh Lead
                </>
              )}
            </h3>
            <p style={{ fontSize: "0.71875rem", color: "#94a3b8", margin: "0.15rem 0 0 0" }}>
              {isEditing ? `Editing lead: ${initialData?.id}` : "Create fresh lead & assign directly to telecallers"}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body - Scrollable Mobile App Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", overflowY: "auto", flex: "1 1 auto" }}>
          
          {/* Full Name */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
              Lead Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <User size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. Rohan Mehta"
                style={{ paddingLeft: "2.1rem", fontSize: "0.84375rem", padding: "0.55rem 0.65rem 0.55rem 2.1rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
              Phone Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              <input
                type="text"
                className="modern-search-input"
                placeholder="+91 98000 00000"
                style={{ paddingLeft: "2.1rem", fontSize: "0.84375rem", padding: "0.55rem 0.65rem 0.55rem 2.1rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              <input
                type="email"
                className="modern-search-input"
                placeholder="rohan@gmail.com"
                style={{ paddingLeft: "2.1rem", fontSize: "0.84375rem", padding: "0.55rem 0.65rem 0.55rem 2.1rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Preferred Locality */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
              Preferred Locality / Area
            </label>
            <div style={{ position: "relative" }}>
              <MapPin size={15} style={{ position: "absolute", left: 10, top: 11, color: "#94a3b8" }} />
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. Bandra West, Mumbai"
                style={{ paddingLeft: "2.1rem", fontSize: "0.84375rem", padding: "0.55rem 0.65rem 0.55rem 2.1rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* 2-Column Grid: BHK Type & Requirement */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                BHK Type
              </label>
              <select
                className="modern-search-input"
                value={bhkType}
                onChange={e => setBhkType(e.target.value)}
                style={{ width: "100%", fontSize: "0.8125rem", padding: "0.55rem 0.4rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
              >
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="Penthouse / Villa">Penthouse / Villa</option>
                <option value="Plot">Plot</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                Service
              </label>
              <select
                className="modern-search-input"
                value={service}
                onChange={e => setService(e.target.value)}
                style={{ width: "100%", fontSize: "0.8125rem", padding: "0.55rem 0.4rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
              >
                <option value="Home Buying">🏡 Home Buying</option>
                <option value="Site Visit Booking">🚗 Site Visit</option>
                <option value="Valuation & Selling">💰 Selling</option>
                <option value="Commercial Rental">🏢 Rental</option>
              </select>
            </div>
          </div>

          {/* 2-Column Grid: Lead Source & Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                Lead Source
              </label>
              <select
                className="modern-search-input"
                value={source}
                onChange={e => setSource(e.target.value)}
                style={{ width: "100%", fontSize: "0.8125rem", padding: "0.55rem 0.4rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
              >
                <option value="Direct Walk-in">Direct Walk-in</option>
                <option value="Instagram Ads">Instagram Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="MagicBricks">MagicBricks</option>
                <option value="Referral">Referral</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                Priority
              </label>
              <select
                className="modern-search-input"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{ width: "100%", fontSize: "0.8125rem", padding: "0.55rem 0.4rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1" }}
              >
                <option value="HOT">🔥 HOT</option>
                <option value="WARM">⚡ WARM</option>
                <option value="COLD">❄️ COLD</option>
              </select>
            </div>
          </div>

          {/* Customer Requirements / Notes */}
          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
              Notes & Requirements
            </label>
            <textarea
              className="modern-search-input"
              rows={2}
              placeholder="e.g. Budget 2.5 Cr. Callback requested."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: "100%", fontSize: "0.8125rem", padding: "0.55rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", resize: "vertical" }}
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            style={{
              background: isEditing ? "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.75rem",
              borderRadius: "0.625rem",
              fontSize: "0.875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              boxShadow: "0 6px 16px rgba(37,99,235,0.3)",
              marginTop: "0.25rem"
            }}
          >
            {isEditing ? (
              <>
                <CheckCircle2 size={16} /> Save Lead Changes
              </>
            ) : (
              <>
                <UserPlus size={16} /> Create & Add Lead
              </>
            )}
          </button>
        </form>

        {alertConfig && (
          <CustomAlertDialog
            isOpen={!!alertConfig}
            onClose={handleAlertClose}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
          />
        )}
      </div>
    </div>
  );
}
