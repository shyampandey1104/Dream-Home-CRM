import React, { useState, useEffect } from "react";
import { X, Upload, Layers, FileText, Video, ClipboardList, CheckCircle2, Save, Link2 } from "lucide-react";
import { 
  uploadUnitPlanApi, 
  uploadPropertyDocumentApi, 
  uploadPropertyVideoApi, 
  uploadPropertyListingApi 
} from "../services/apiService";
import CustomAlertDialog from "./CustomAlertDialog";

export default function UploadInventoryModal({ isOpen, onClose, mode = "unit_plan", defaultListingType = "My Listing", onItemUploaded }) {
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  useEffect(() => {
    if (isOpen) setAlertConfig(null);
  }, [isOpen]);

  const handleCloseAll = () => {
    setAlertConfig(null);
    onClose();
  };

  // Unit Plan state
  const [projectTitle, setProjectTitle] = useState("");
  const [bhkType, setBhkType] = useState("2 BHK");
  const [area, setArea] = useState("");
  const [planImg, setPlanImg] = useState("");

  // Document state
  const [docName, setDocName] = useState("");
  const [docProject, setDocProject] = useState("");
  const [docCategory, setDocCategory] = useState("Brochure");
  const [docSize, setDocSize] = useState("2.5 MB");
  const [docUrl, setDocUrl] = useState("");

  // Video state
  const [videoTitle, setVideoTitle] = useState("");
  const [videoProject, setVideoProject] = useState("");
  const [videoDuration, setVideoDuration] = useState("03:30");
  const [videoThumb, setVideoThumb] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Listing state
  const [listingCategory, setListingCategory] = useState(defaultListingType);
  const [listingTitle, setListingTitle] = useState("");
  const [listingLocality, setListingLocality] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingOwner, setListingOwner] = useState("");
  const [listingPhone, setListingPhone] = useState("");
  const [listingStatus, setListingStatus] = useState("Active");
  const [listingCommission, setListingCommission] = useState("2.0% CP Split");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "unit_plan") {
        const payload = {
          project: projectTitle,
          bhk_type: bhkType,
          area: area ? `${area} sq.ft. Carpet` : "750 sq.ft. Carpet",
          plan_img: planImg || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        };
        const res = await uploadUnitPlanApi(payload);
        if (onItemUploaded) onItemUploaded("unit_plan", { project: `${projectTitle} - ${bhkType}`, area: payload.area, planImg: payload.plan_img });
        const successText = typeof res.message === "string" ? res.message : "Unit Plan saved to CRM Database!";
        setAlertConfig({ title: "Unit Plan Saved!", message: successText, type: "success" });
      } else if (mode === "document") {
        const payload = {
          document_name: docName,
          project: docProject,
          category: docCategory,
          file_size: docSize,
          file_url: docUrl || "/files/brochure.pdf"
        };
        const res = await uploadPropertyDocumentApi(payload);
        if (onItemUploaded) onItemUploaded("document", { name: docName, size: docSize, date: `${docCategory} (Verified)`, url: payload.file_url });
        const successText = typeof res.message === "string" ? res.message : "Document saved to CRM Database!";
        setAlertConfig({ title: "Document Saved!", message: successText, type: "success" });
      } else if (mode === "video") {
        const payload = {
          title: videoTitle,
          project: videoProject,
          duration: videoDuration,
          thumbnail: videoThumb || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
          video_url: videoUrl
        };
        const res = await uploadPropertyVideoApi(payload);
        if (onItemUploaded) onItemUploaded("video", { title: videoTitle, duration: videoDuration, img: payload.thumbnail, url: videoUrl });
        const successText = typeof res.message === "string" ? res.message : "Video Walkthrough saved to CRM Database!";
        setAlertConfig({ title: "Video Saved!", message: successText, type: "success" });
      } else if (mode === "listing") {
        const payload = {
          listing_type: listingCategory,
          title: listingTitle,
          locality: listingLocality,
          price: listingPrice,
          owner_or_agent: listingOwner,
          phone: listingPhone,
          status: listingStatus,
          commission: listingCommission
        };
        const res = await uploadPropertyListingApi(payload);
        if (onItemUploaded) onItemUploaded("listing", {
          id: `LIST-${Date.now().toString().slice(-4)}`,
          property: listingTitle,
          locality: listingLocality,
          price: listingPrice,
          owner: listingOwner,
          agent: listingOwner,
          name: listingOwner,
          phone: listingPhone,
          broker: listingOwner,
          status: listingStatus,
          commission: listingCommission,
          listing_type: listingCategory
        });
        const successText = typeof res.message === "string" ? res.message : `${listingCategory} item saved to CRM Database!`;
        setAlertConfig({ title: "Item Saved!", message: successText, type: "success" });
      }
    } catch (err) {
      console.log("[Upload Error]", err);
      setAlertConfig({ title: "Error", message: "Failed to save data. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === "unit_plan") return "📐 Upload Unit Floor Plan";
    if (mode === "document") return "📁 Upload Project Document";
    if (mode === "video") return "🎥 Add 3D Virtual Video Tour";
    return "📋 Add Property Listing Item";
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
        border: "1px solid #cbd5e1"
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
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: 0 }}>{getTitle()}</h3>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.2rem 0 0 0" }}>Save directly to CRM Database & App View</p>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* MODE: UNIT PLAN */}
          {mode === "unit_plan" && (
            <>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Project Name *</label>
                <input type="text" className="modern-search-input" placeholder="e.g. Kalpataru Vian" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>BHK Config</label>
                  <input type="text" className="modern-search-input" placeholder="e.g. 2BHK Smart" value={bhkType} onChange={e => setBhkType(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Carpet Area (sq.ft)</label>
                  <input type="number" className="modern-search-input" placeholder="e.g. 780" value={area} onChange={e => setArea(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Floor Plan Image URL</label>
                <input type="url" className="modern-search-input" placeholder="https://images.unsplash.com/..." value={planImg} onChange={e => setPlanImg(e.target.value)} />
              </div>
            </>
          )}

          {/* MODE: DOCUMENT */}
          {mode === "document" && (
            <>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Document Name *</label>
                <input type="text" className="modern-search-input" placeholder="e.g. Purva Estrella RERA Approval.pdf" value={docName} onChange={e => setDocName(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Project Name</label>
                <input type="text" className="modern-search-input" placeholder="e.g. Purva Estrella" value={docProject} onChange={e => setDocProject(e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Category</label>
                  <select className="modern-search-input" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                    <option value="RERA Certificate">RERA Certificate</option>
                    <option value="Brochure">Brochure</option>
                    <option value="Payment Plan">Payment Plan</option>
                    <option value="Master Layout">Master Layout</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>File Size</label>
                  <input type="text" className="modern-search-input" placeholder="e.g. 4.2 MB" value={docSize} onChange={e => setDocSize(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Document PDF URL / Link</label>
                <input type="text" className="modern-search-input" placeholder="/files/document.pdf" value={docUrl} onChange={e => setDocUrl(e.target.value)} />
              </div>
            </>
          )}

          {/* MODE: VIDEO */}
          {mode === "video" && (
            <>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Video Title *</label>
                <input type="text" className="modern-search-input" placeholder="e.g. Godrej Horizon 4K Penthouse Walkthrough" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Project Name</label>
                <input type="text" className="modern-search-input" placeholder="e.g. Godrej Horizon" value={videoProject} onChange={e => setVideoProject(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Duration</label>
                <input type="text" className="modern-search-input" placeholder="e.g. 04:15" value={videoDuration} onChange={e => setVideoDuration(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Thumbnail Image URL</label>
                <input type="url" className="modern-search-input" placeholder="https://images.unsplash.com/..." value={videoThumb} onChange={e => setVideoThumb(e.target.value)} />
              </div>
            </>
          )}

          {/* MODE: LISTING */}
          {mode === "listing" && (
            <>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Listing Category *</label>
                <select className="modern-search-input" value={listingCategory} onChange={e => setListingCategory(e.target.value)}>
                  <option value="My Listing">My Listing</option>
                  <option value="Employee Listing">Employee Listing</option>
                  <option value="Owner Lead">Owner Lead</option>
                  <option value="CP Listing">CP Listing</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Property Title *</label>
                <input type="text" className="modern-search-input" placeholder="e.g. 3BHK Luxury Duplex" value={listingTitle} onChange={e => setListingTitle(e.target.value)} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Locality</label>
                  <input type="text" className="modern-search-input" placeholder="e.g. Bandra West" value={listingLocality} onChange={e => setListingLocality(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Price / Rent</label>
                  <input type="text" className="modern-search-input" placeholder="e.g. ₹ 3.50 Cr" value={listingPrice} onChange={e => setListingPrice(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Owner / Agent Name</label>
                  <input type="text" className="modern-search-input" placeholder="e.g. Rajesh Shah" value={listingOwner} onChange={e => setListingOwner(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78125rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem", display: "block" }}>Phone Number</label>
                  <input type="text" className="modern-search-input" placeholder="+91 98200 11223" value={listingPhone} onChange={e => setListingPhone(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
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
              boxShadow: "0 8px 20px rgba(22,163,74,0.3)",
              marginTop: "0.5rem"
            }}
          >
            <Save size={18} /> {loading ? "Saving to Database..." : "Save Item to CRM Database"}
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
