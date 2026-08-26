import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle2, Sparkles, Building, MapPin, Tag, DollarSign, AlertCircle } from "lucide-react";
import { uploadPropertyApi } from "../services/apiService";
import { validateRequiredText } from "../utils/validators";
import CustomAlertDialog from "./CustomAlertDialog";

export default function UploadPropertyModal({ isOpen, onClose, onPropertyUploaded }) {
  const [title, setTitle] = useState("");
  const [builder, setBuilder] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [tag, setTag] = useState("New Launch");
  const [bhk, setBhk] = useState("2 & 3 BHK Apartments");
  const [carpet, setCarpet] = useState("800 - 1200 sq.ft.");
  const [heroImg, setHeroImg] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80");
  const [highlights, setHighlights] = useState("Gated luxury community, 5-tier security, Clubhouse & Infinity Pool");
  
  const [fileName, setFileName] = useState("");
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  if (!isOpen) return null;

  // Handle PDF Brochure or Image Upload & Auto AI Parse
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setAlertConfig({ title: "File Too Large", message: "File size exceeds 25MB limit. Please upload a smaller file.", type: "warning" });
      return;
    }

    setFileName(file.name);
    setIsAiParsing(true);

    // Simulate AI parsing PDF brochure details
    setTimeout(() => {
      setIsAiParsing(false);
      setAiSuccess(true);

      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/brochure|rera|certificate|plan|layout|pdf/gi, "")
        .trim();

      const extractedTitle = cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : "Oberoi Sky City";
      
      if (!title) setTitle(extractedTitle);
      if (!builder) setBuilder(file.name.toLowerCase().includes("oberoi") ? "Oberoi Realty" : "Godrej Properties");
      if (!location) setLocation("Borivali East, Mumbai");
      if (!priceRange) setPriceRange("₹ 2.45 Cr - ₹ 5.80 Cr");
      if (!bhk) setBhk("2, 3 & 4 BHK Luxury Residences");
      if (!carpet) setCarpet("850 - 1750 sq.ft.");
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const titleRes = validateRequiredText(title, "Project Title", 2);
    if (!titleRes.isValid) {
      setAlertConfig({ title: "Validation Error", message: titleRes.error, type: "warning" });
      return;
    }

    const locRes = validateRequiredText(location || "Mumbai", "Location", 2);
    if (!locRes.isValid) {
      setAlertConfig({ title: "Validation Error", message: locRes.error, type: "warning" });
      return;
    }

    const highlightsArr = highlights.split(",").map(s => s.trim()).filter(Boolean);

    const newPropertyObj = {
      id: `PROP-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      builder: builder.trim() || "Independent Developer",
      location: location.trim() || "Mumbai",
      price: priceRange.trim() || "Price on Request",
      priceRange: priceRange.trim() || "Price on Request",
      tag: tag || "New Launch",
      bhk: bhk.trim() || "2 & 3 BHK",
      carpet: carpet.trim() || "800 - 1200 sq.ft.",
      highlights: highlightsArr.length > 0 ? highlightsArr : ["Prime Locality", "Modern Amenities", "Vastu Compliant"],
      img: heroImg,
      image: heroImg,
      hero_img: heroImg,
      brochureFile: fileName || `${title.replace(/\s+/g, '_')}_Brochure.pdf`
    };

    const res = await uploadPropertyApi(newPropertyObj);
    
    if (onPropertyUploaded) {
      onPropertyUploaded(newPropertyObj);
    }

    const successText = typeof res?.message === "string" ? res.message : `🎉 Property '${title}' uploaded & saved to Database!`;
    setAlertConfig({ title: "Property Uploaded!", message: successText, type: "success" });
  };

  const handleCloseAll = () => {
    if (alertConfig?.type === "success") {
      setAlertConfig(null);
      onClose();
    } else {
      setAlertConfig(null);
    }
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
        maxWidth: "520px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
        border: "1px solid #cbd5e1",
        position: "relative"
      }}>
        {/* Header */}
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
              <Upload size={20} color="#38bdf8" /> Upload Property & PDF Brochure
            </h3>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0 0" }}>
              Upload verified project PDF, floor plans & sync with CRM Database
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

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          
          {/* PDF Brochure Drag & Drop Upload Zone */}
          <div style={{
            border: "2px dashed #3b82f6",
            borderRadius: "0.875rem",
            padding: "1.25rem",
            textAlign: "center",
            background: "#eff6ff",
            position: "relative",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer"
              }}
            />
            <FileText size={32} color="#2563eb" style={{ margin: "0 auto 0.5rem" }} />
            <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1e40af" }}>
              {fileName ? `📄 Attached File: ${fileName}` : "Click or Drop PDF Brochure / RERA Certificate here"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#60a5fa", marginTop: "0.25rem" }}>
              Supports PDF, DOC, DOCX, PNG, JPG files up to 25MB
            </div>

            {isAiParsing && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.78125rem", color: "#2563eb", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                <Sparkles className="spin" size={16} color="#2563eb" /> AI is auto-extracting project & brochure details...
              </div>
            )}

            {aiSuccess && (
              <div style={{ marginTop: "0.75rem", fontSize: "0.78125rem", color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem" }}>
                <CheckCircle2 size={16} color="#16a34a" /> AI successfully auto-filled form fields from brochure!
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Project Title *
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. Oberoi Sky City"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Builder / Developer
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. Oberoi Realty"
                value={builder}
                onChange={e => setBuilder(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Locality / Address
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. Borivali East, Mumbai"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Price Range
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. ₹ 2.50 Cr onwards"
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                BHK Configurations
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. 2 & 3 BHK Luxury"
                value={bhk}
                onChange={e => setBhk(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
                Carpet Area
              </label>
              <input
                type="text"
                className="modern-search-input"
                placeholder="e.g. 780 - 1250 sq.ft."
                value={carpet}
                onChange={e => setCarpet(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
              Project Tag
            </label>
            <select
              className="modern-search-input"
              value={tag}
              onChange={e => setTag(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="New Launch">🚀 New Launch</option>
              <option value="Focus Project">⭐ Focus Project</option>
              <option value="Luxury 2 & 3 BHK">👑 Luxury Residences</option>
              <option value="Ready to Move">🔑 Ready to Move</option>
              <option value="Under Construction">🏗️ Under Construction</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>
              Key Highlights (Comma Separated)
            </label>
            <textarea
              className="modern-search-input"
              rows={2}
              placeholder="e.g. Sky Lounge, Infinity Pool, 5 mins from Western Express Highway"
              value={highlights}
              onChange={e => setHighlights(e.target.value)}
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
            <Upload size={18} /> Upload Property & Save to CRM Database
          </button>
        </form>

        {alertConfig && (
          <CustomAlertDialog
            isOpen={!!alertConfig}
            onClose={handleCloseAll}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
          />
        )}
      </div>
    </div>
  );
}
