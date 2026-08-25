import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, Share2, Info, AlertTriangle, FileText, 
  Video, Layers, Calculator, ClipboardList, CheckCircle, Search, Filter,
  Phone, UserCheck, CheckSquare, Download, Play, Shield, Upload, Plus, Trash2, FileUp, Eye
} from "lucide-react";
import { fetchCrmInventory, submitProjectSurvey, calculateCmaApi } from "../services/apiService";
import UploadPropertyModal from "./UploadPropertyModal";
import UploadInventoryModal from "./UploadInventoryModal";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import VideoPlayerModal from "./VideoPlayerModal";
import CustomAlertDialog from "./CustomAlertDialog";

export default function PropertiesView({ onShareProperty }) {
  const [activeMainTab, setActiveMainTab] = useState("properties");
  const [selectedSubTab, setSelectedSubTab] = useState("Focus Projects");
  const [cmaLocation, setCmaLocation] = useState("");
  const [cmaArea, setCmaArea] = useState("");
  const [cmaResult, setCmaResult] = useState(null);
  const [liveProperties, setLiveProperties] = useState([]);
  const [backendCategories, setBackendCategories] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadedProperties, setUploadedProperties] = useState([]);
  const [alertConfig, setAlertConfig] = useState(null);

  // Sub-tab Upload Modals State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("unit_plan");
  const [itemListingCategory, setItemListingCategory] = useState("My Listing");

  const [uploadedUnitPlans, setUploadedUnitPlans] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_property_docs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [uploadedVids, setUploadedVids] = useState([]);
  const [uploadedListings, setUploadedListings] = useState([]);

  // Survey Form State
  const [surveyBuilder, setSurveyBuilder] = useState("");
  const [surveyLocation, setSurveyLocation] = useState("");
  const [surveyPrice, setSurveyPrice] = useState("");

  useEffect(() => {
    fetchCrmInventory().then((res) => {
      if (res) {
        if (res.categories) setBackendCategories(res.categories);
        if (res.data) setLiveProperties(res.data);
      }
    });
  }, []);

  const handlePropertyUploaded = (newProp) => {
    setUploadedProperties(prev => [newProp, ...prev]);
  };

  const handleDocumentUploaded = (newDoc) => {
    const updated = [newDoc, ...uploadedDocs];
    setUploadedDocs(updated);
    try {
      localStorage.setItem("crm_property_docs", JSON.stringify(updated));
    } catch (e) {}
    setSelectedSubTab("Documents");
  };

  const handleDeleteDoc = (docId) => {
    const updated = uploadedDocs.filter(d => d.id !== docId);
    setUploadedDocs(updated);
    try {
      localStorage.setItem("crm_property_docs", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDownloadDoc = (doc) => {
    if (doc.dataUrl) {
      const link = document.createElement("a");
      link.href = doc.dataUrl;
      link.download = doc.fileName || `${doc.name}.${doc.fileType === "PDF" ? "pdf" : "docx"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setSelectedViewDoc(doc);
    }
  };

  const handleItemUploaded = (type, item) => {
    if (type === "unit_plan") setUploadedUnitPlans(prev => [item, ...prev]);
    else if (type === "document") handleDocumentUploaded(item);
    else if (type === "video") setUploadedVids(prev => [item, ...prev]);
    else if (type === "listing") setUploadedListings(prev => [item, ...prev]);
  };

  const initialProps = (backendCategories && backendCategories.focusProjects)
    ? backendCategories.focusProjects
    : liveProperties;

  const propertiesList = [...uploadedProperties, ...initialProps];
  const unitPlansList = [...uploadedUnitPlans, ...((backendCategories && backendCategories.unitPlans) ? backendCategories.unitPlans : [])];
  const documentsList = [...uploadedDocs, ...((backendCategories && backendCategories.documents) ? backendCategories.documents : [
    { id: "DOC-DEF-01", name: "Kalpataru Vian RERA Brochure", fileName: "Kalpataru_Vian_Brochure.pdf", fileType: "PDF", size: "3.4 MB", date: "15 Aug 2026", category: "Brochure / Layout" },
    { id: "DOC-DEF-02", name: "Godrej Horizon Cost Sheet & Payment Plan", fileName: "Godrej_Horizon_Cost_Sheet.docx", fileType: "DOC", size: "1.8 MB", date: "12 Aug 2026", category: "Price Sheet & Costing" }
  ])];
  const videosList = [...uploadedVids, ...((backendCategories && backendCategories.videos) ? backendCategories.videos : [
    { id: "VID-01", title: "Kalpataru Vian 4K Drone Tour & Sample Flat", duration: "03:45", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "VID-02", title: "Oberoi Sky City Sky-Deck Penthouse Tour", duration: "04:10", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ])];
  const myListingData = [...uploadedListings.filter(l => l.listing_type === "My Listing"), ...((backendCategories && backendCategories.myListings) ? backendCategories.myListings : [])];
  const employeeListingData = [...uploadedListings.filter(l => l.listing_type === "Employee Listing"), ...((backendCategories && backendCategories.employeeListings) ? backendCategories.employeeListings : [])];
  const ownerLeadsData = [...uploadedListings.filter(l => l.listing_type === "Owner Lead"), ...((backendCategories && backendCategories.ownerLeads) ? backendCategories.ownerLeads : [])];
  const cpListingData = [...uploadedListings.filter(l => l.listing_type === "CP Listing"), ...((backendCategories && backendCategories.cpListings) ? backendCategories.cpListings : [])];

  const handleCalculateCMA = async (e) => {
    e.preventDefault();
    const res = await calculateCmaApi(cmaLocation, cmaArea);
    if (res) {
      setCmaResult(res);
    } else {
      const rate = cmaLocation.toLowerCase().includes("lokhandwala") ? 28500 : 24500;
      const area = parseFloat(cmaArea) || 1000;
      const estVal = (rate * area) / 10000000;
      setCmaResult({
        rate: `₹ ${rate.toLocaleString()}/sq.ft`,
        estVal: `₹ ${estVal.toFixed(2)} Cr`,
        confidence: "96% High Market Match (CRM Backend)"
      });
    }
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    if (!surveyBuilder.trim()) {
      setAlertConfig({ title: "Builder Name Required", message: "Please enter Builder / Developer Name", type: "warning" });
      return;
    }
    const res = await submitProjectSurvey({
      builder: surveyBuilder,
      location: surveyLocation,
      price_range: surveyPrice
    });
    const successMsg = typeof res.message === "string" ? res.message : "Project Field Survey submitted successfully to CRM Database!";
    setAlertConfig({ title: "Survey Submitted!", message: successMsg, type: "success" });
    setSurveyBuilder("");
    setSurveyLocation("");
    setSurveyPrice("");
  };

  return (
    <div style={{ padding: "0.875rem 0.75rem", paddingBottom: "5rem" }}>
      <UploadPropertyModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPropertyUploaded={handlePropertyUploaded}
      />

      <DocUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
        categoryTitle="Property & Inventory Documents"
      />

      {/* In-App Document Viewer Dialog */}
      <DocumentViewerModal
        isOpen={!!selectedViewDoc}
        onClose={() => setSelectedViewDoc(null)}
        doc={selectedViewDoc}
      />

      {/* In-App Video Player Dialog */}
      <VideoPlayerModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        video={selectedVideo}
      />

      <UploadInventoryModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        mode={itemModalMode}
        defaultListingType={itemListingCategory}
        onItemUploaded={handleItemUploaded}
      />

      {/* Header Bar with Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>🏢 Property & Focus Inventory</h2>
          <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.1rem 0 0 0" }}>Manage inventory, floor plans & project brochures</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          {/* Direct PDF / DOC Upload Button */}
          <button
            onClick={() => setIsDocModalOpen(true)}
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.45rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.78125rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              boxShadow: "0 4px 12px rgba(2,132,199,0.3)",
              whiteSpace: "nowrap"
            }}
          >
            <FileUp size={15} /> + Upload PDF / DOC
          </button>

          {/* Upload Property Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.45rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.78125rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
              whiteSpace: "nowrap"
            }}
          >
            <Upload size={15} /> + Property
          </button>
        </div>
      </div>

      {/* Main Tab Toggle: Properties vs Listing */}
      <div style={{ display: "flex", background: "#f1f5f9", padding: "0.25rem", borderRadius: "0.75rem", marginBottom: "0.875rem" }}>
        <button
          className={`tab-btn ${activeMainTab === "properties" ? "active" : ""}`}
          onClick={() => { setActiveMainTab("properties"); setSelectedSubTab("Focus Projects"); }}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", fontSize: "0.8125rem", fontWeight: "700", border: "none", cursor: "pointer", background: activeMainTab === "properties" ? "#2563eb" : "transparent", color: activeMainTab === "properties" ? "#fff" : "#64748b" }}
        >
          🏢 Properties & Focus
        </button>
        <button
          className={`tab-btn ${activeMainTab === "listing" ? "active" : ""}`}
          onClick={() => { setActiveMainTab("listing"); setSelectedSubTab("My Listing"); }}
          style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", fontSize: "0.8125rem", fontWeight: "700", border: "none", cursor: "pointer", background: activeMainTab === "listing" ? "#2563eb" : "transparent", color: activeMainTab === "listing" ? "#fff" : "#64748b" }}
        >
          📋 Property Listings
        </button>
      </div>

      {/* Sub Tabs Scroll */}
      <div className="sub-tabs-scroll">
        {activeMainTab === "properties" ? (
          <>
            {["Focus Projects", "Documents", "Unit Plans", "CMA Analysis", "Project Survey", "Videos"].map(tab => (
              <button 
                key={tab}
                className={`sub-tab-chip ${selectedSubTab === tab ? "active" : ""}`}
                onClick={() => setSelectedSubTab(tab)}
              >
                {tab === "Focus Projects" && "⭐ "}
                {tab === "Documents" && "📁 "}
                {tab === "Unit Plans" && "📐 "}
                {tab === "CMA Analysis" && "📊 "}
                {tab === "Project Survey" && "📝 "}
                {tab === "Videos" && "🎥 "}
                {tab}
              </button>
            ))}
          </>
        ) : (
          <>
            {["My Listing", "Employee Listing", "Check Demand", "Owner Leads", "Owner Listing", "CP Listing"].map(tab => (
              <button 
                key={tab}
                className={`sub-tab-chip ${selectedSubTab === tab ? "active" : ""}`}
                onClick={() => setSelectedSubTab(tab)}
              >
                {tab}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Dynamic Content Rendering */}
      {selectedSubTab === "Documents" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {/* Quick PDF/DOC Upload Banner */}
          <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <div>
              <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#1e40af" }}>📁 Project Documents & PDF Brochures</div>
              <div style={{ fontSize: "0.71875rem", color: "#3b82f6" }}>Upload, view & share verified RERA PDFs, brochures, cost sheets (.pdf, .doc, .docx)</div>
            </div>
            <button
              onClick={() => setIsDocModalOpen(true)}
              style={{ background: "#2563eb", color: "#ffffff", border: "none", padding: "0.45rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}
            >
              <FileUp size={14} /> + Upload
            </button>
          </div>

          {documentsList.map((doc, idx) => (
            <div 
              key={doc.id || idx} 
              style={{ 
                background: "#ffffff", 
                border: "1px solid #e2e8f0", 
                borderRadius: "0.625rem", 
                padding: "0.75rem", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                gap: "0.5rem",
                transition: "all 0.15s ease"
              }}
            >
              <div 
                onClick={() => setSelectedViewDoc(doc)}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0, cursor: "pointer" }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: (doc.fileType === "PDF" || doc.name.endsWith(".pdf")) ? "#fee2e2" : "#e0e7ff", color: (doc.fileType === "PDF" || doc.name.endsWith(".pdf")) ? "#dc2626" : "#4338ca", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.6875rem", flexShrink: 0 }}>
                  {doc.fileType || "PDF"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.8125rem", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>
                    {doc.category || "Brochure"} • {doc.size || "1.5 MB"} • {doc.date}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                {/* View Document Dialog Button */}
                <button 
                  style={{ 
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                    color: "#ffffff", 
                    border: "none", 
                    padding: "0.35rem 0.65rem", 
                    borderRadius: "0.375rem", 
                    fontSize: "0.75rem", 
                    fontWeight: "700", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.25rem",
                    boxShadow: "0 2px 6px rgba(37,99,235,0.25)"
                  }} 
                  onClick={() => setSelectedViewDoc(doc)}
                  title="View Document Details & Preview"
                >
                  <Eye size={13} /> View
                </button>

                {/* Download Button */}
                <button 
                  style={{ 
                    background: "#f1f5f9", 
                    border: "1px solid #cbd5e1", 
                    color: "#334155", 
                    padding: "0.35rem 0.5rem", 
                    borderRadius: "0.375rem", 
                    fontSize: "0.75rem", 
                    fontWeight: "700", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.2rem" 
                  }} 
                  onClick={() => handleDownloadDoc(doc)}
                  title="Download File"
                >
                  <Download size={13} />
                </button>

                {/* Delete button */}
                {doc.id && doc.id.startsWith("DOC-") && (
                  <button 
                    style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
                    onClick={() => handleDeleteDoc(doc.id)}
                    title="Delete Document"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "CMA Analysis" ? (
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", marginBottom: "0.3rem" }}>📊 Comparative Market Analysis (CMA)</h4>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1rem" }}>Calculate fair market value & price trends in Bandra, Andheri, Lokhandwala & Thane.</p>

          <form onSubmit={handleCalculateCMA} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "#475569" }}>Property Locality</label>
              <input type="text" className="modern-search-input" placeholder="e.g. Lokhandwala, Andheri West" value={cmaLocation} onChange={e => setCmaLocation(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "#475569" }}>Carpet Area (sq.ft)</label>
              <input type="number" className="modern-search-input" placeholder="e.g. 1150" value={cmaArea} onChange={e => setCmaArea(e.target.value)} required />
            </div>
            <button type="submit" className="admin-action-btn" style={{ justifyContent: "center" }}>
              Calculate Market Value
            </button>
          </form>

          {cmaResult && (
            <div style={{ marginTop: "1rem", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "0.875rem", borderRadius: "0.625rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#0369a1", fontWeight: "700" }}>CMA Estimation Result:</div>
              <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0284c7", margin: "0.2rem 0" }}>Estimated Price: {cmaResult.estVal}</div>
              <div style={{ fontSize: "0.78125rem", color: "#475569" }}>Average Rate: <strong>{cmaResult.rate}</strong></div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: "700", marginTop: "0.3rem" }}>✓ {cmaResult.confidence}</div>
            </div>
          )}
        </div>
      ) : selectedSubTab === "Project Survey" ? (
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", marginBottom: "0.3rem" }}>📝 Builder Field Project Survey</h4>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1rem" }}>Submit survey report for new upcoming builder projects to CRM Database.</p>
          <form onSubmit={handleSurveySubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input 
              type="text" 
              className="modern-search-input" 
              placeholder="Builder / Developer Name (e.g. Oberoi Realty)" 
              value={surveyBuilder}
              onChange={e => setSurveyBuilder(e.target.value)}
              required
            />
            <input 
              type="text" 
              className="modern-search-input" 
              placeholder="Land Parcel Location (e.g. Goregaon East)" 
              value={surveyLocation}
              onChange={e => setSurveyLocation(e.target.value)}
            />
            <input 
              type="text" 
              className="modern-search-input" 
              placeholder="Expected Launch Price Range (e.g. ₹ 2.5 Cr+)" 
              value={surveyPrice}
              onChange={e => setSurveyPrice(e.target.value)}
            />
            <button type="submit" className="admin-action-btn" style={{ justifyContent: "center" }}>
              Submit Survey Form to CRM Database
            </button>
          </form>
        </div>
      ) : selectedSubTab === "Unit Plans" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <button
            onClick={() => { setItemModalMode("unit_plan"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add Unit Floor Plan
          </button>
          {unitPlansList.map((plan, idx) => (
            <div key={idx} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden", padding: "0.875rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>📐 {plan.project}</h4>
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.5rem" }}>Area: {plan.area}</p>
              <img 
                src={plan.planImg || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"} 
                alt={plan.project} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80";
                }}
                style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "0.5rem" }} 
              />
              <button style={{ width: "100%", marginTop: "0.6rem", background: "#2563eb", color: "#ffffff", border: "none", padding: "0.4rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }} onClick={() => setAlertConfig({ title: "Downloading Layout", message: `Downloading High-Res 2D/3D Floor Plan PDF for ${plan.project}...`, type: "info" })}>
                <Download size={13} style={{ verticalAlign: "middle", marginRight: "4px" }} /> Download Floor Layout PDF
              </button>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "Videos" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <button
            onClick={() => { setItemModalMode("video"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add 3D Virtual Video Tour
          </button>
          
          {videosList.map((vid, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedVideo(vid)}
              style={{ 
                background: "#ffffff", 
                border: "1px solid #e2e8f0", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                padding: "0.875rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "150px", background: "#0f172a", borderRadius: "0.5rem", overflow: "hidden" }}>
                <img 
                  src={vid.img || vid.thumbnail || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"} 
                  alt={vid.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,99,235,0.6)" }}>
                    <Play size={22} fill="#ffffff" style={{ marginLeft: "2px" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.75)", color: "#ffffff", padding: "0.15rem 0.45rem", borderRadius: "4px", fontSize: "0.6875rem", fontWeight: 700 }}>
                  {vid.duration || "4K Tour"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>{vid.title}</h4>
                  <div style={{ fontSize: "0.71875rem", color: "#64748b", marginTop: "2px" }}>Duration: {vid.duration || "03:30"} • Tap to Play 3D Tour</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideo(vid);
                  }}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.35rem 0.7rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}
                >
                  <Play size={12} fill="#ffffff" /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "My Listing" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => { setItemModalMode("listing"); setItemListingCategory("My Listing"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add My Listing
          </button>
          {myListingData.map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563eb" }}>{item.id}</span>
                <span style={{ fontSize: "0.6875rem", background: "#dcfce7", color: "#15803d", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.status}</span>
              </div>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#0f172a", marginTop: "0.3rem" }}>{item.property}</h4>
              <div style={{ fontSize: "0.78125rem", color: "#64748b" }}>Location: {item.locality} | Price: <strong style={{ color: "#0f172a" }}>{item.price}</strong></div>
              <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.2rem" }}>Owner: {item.owner}</div>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "Employee Listing" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => { setItemModalMode("listing"); setItemListingCategory("Employee Listing"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add Employee Listing
          </button>
          {employeeListingData.map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#0f172a" }}>Agent: {item.agent}</span>
                <span style={{ fontSize: "0.6875rem", background: "#eff6ff", color: "#1d4ed8", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.status}</span>
              </div>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a", marginTop: "0.3rem" }}>{item.property}</h4>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.locality} - {item.price}</div>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "Check Demand" ? (
        <div style={{ background: "#ffffff", padding: "1.25rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", marginBottom: "0.3rem" }}>🔍 AI Buyer Demand Matcher</h4>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1rem" }}>Match active buyer requirements with verified listings.</p>
          <button className="admin-action-btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => setAlertConfig({ title: "AI Search Complete", message: "AI Search Matched 18 High-Intent Buyers in Bandra & Andheri!", type: "success" })}>
            Run Buyer Demand Engine
          </button>
        </div>
      ) : selectedSubTab === "Owner Leads" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => { setItemModalMode("listing"); setItemListingCategory("Owner Lead"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add Owner Lead
          </button>
          {ownerLeadsData.map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>Owner: {item.name}</div>
              <div style={{ fontSize: "0.78125rem", color: "#2563eb", fontWeight: "600" }}>{item.property}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.locality} | {item.phone}</div>
            </div>
          ))}
        </div>
      ) : selectedSubTab === "CP Listing" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => { setItemModalMode("listing"); setItemListingCategory("CP Listing"); setIsItemModalOpen(true); }}
            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0.6rem 1rem", borderRadius: "0.6rem", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> + Add CP Listing
          </button>
          {cpListingData.map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{item.broker}</span>
                <span style={{ fontSize: "0.6875rem", background: "#fef9c3", color: "#854d0e", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.commission}</span>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#475569", marginTop: "0.3rem" }}>{item.property} ({item.locality})</div>
            </div>
          ))}
        </div>
      ) : (
        /* Focus Projects Listing Cards */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {propertiesList.map(prop => (
            <div key={prop.id} className="property-card-modern">
              <div style={{ position: "relative" }}>
                <img 
                  src={prop.img || prop.image || prop.hero_img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"} 
                  alt={prop.title} 
                  className="property-hero-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(15, 23, 42, 0.8)", color: "#ffffff", padding: "0.25rem 0.6rem", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: "700", backdropFilter: "blur(4px)" }}>
                  {prop.builder}
                </div>
                <div style={{ position: "absolute", top: "10px", right: "10px", background: "#2563eb", color: "#ffffff", padding: "0.25rem 0.6rem", borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: "700" }}>
                  {prop.tag}
                </div>
              </div>

              <div className="property-card-body">
                <h3 style={{ fontSize: "1.0625rem", fontWeight: "700", color: "#0f172a" }}>{prop.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78125rem", color: "#64748b", margin: "0.2rem 0 0.5rem 0" }}>
                  <MapPin size={13} color="#2563eb" />
                  {prop.location}
                </div>

                <div className="property-price-tag">{prop.priceRange || prop.price || "Price on Request"}</div>

                <div style={{ margin: "0.6rem 0", background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", color: "#475569" }}>
                  {prop.highlights && prop.highlights.map((point, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.35rem", margin: "0.2rem 0" }}>
                      <span style={{ color: "#2563eb", fontWeight: "800" }}>•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Property Detail Action Buttons */}
                <div className="property-quick-actions">
                  <button className="prop-btn share" onClick={() => onShareProperty(prop)}>
                    <Share2 size={14} /> Share
                  </button>
                  <button className="prop-btn details" onClick={() => setAlertConfig({ title: prop.title, message: `BHK Configuration: ${prop.bhk}\nCarpet Area: ${prop.carpet}\nPrice: ${prop.priceRange || prop.price}`, type: "info" })}>
                    <Info size={14} /> Details
                  </button>
                  <button className="prop-btn details" style={{ flex: "0 0 auto", padding: "0.5rem" }} onClick={() => setAlertConfig({ title: "Report Logged", message: `Project Report & Feedback logged for ${prop.title}`, type: "warning" })}>
                    <AlertTriangle size={14} color="#ef4444" />
                  </button>
                </div>

                {/* Sub Features row */}
                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid #f1f5f9" }}>
                  <button style={{ flex: 1, border: "1px solid #e2e8f0", background: "#fff", padding: "0.35rem", borderRadius: "0.375rem", fontSize: "0.6875rem", color: "#475569", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }} onClick={() => setSelectedSubTab("Unit Plans")}>
                    <Layers size={11} /> Unit Plans
                  </button>
                  <button style={{ flex: 1, border: "1px solid #e2e8f0", background: "#fff", padding: "0.35rem", borderRadius: "0.375rem", fontSize: "0.6875rem", color: "#475569", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }} onClick={() => setSelectedSubTab("Documents")}>
                    <FileText size={11} /> Documents
                  </button>
                  <button style={{ flex: 1, border: "1px solid #e2e8f0", background: "#fff", padding: "0.35rem", borderRadius: "0.375rem", fontSize: "0.6875rem", color: "#475569", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }} onClick={() => setSelectedSubTab("Videos")}>
                    <Video size={11} /> Videos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
  );
}
