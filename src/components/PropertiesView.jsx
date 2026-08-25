import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, Share2, Info, AlertTriangle, FileText, 
  Video, Layers, Calculator, ClipboardList, CheckCircle, Search, Filter,
  Phone, UserCheck, CheckSquare, Download, Play, Shield, Upload, Plus, Trash2, FileUp, Eye, Edit3
} from "lucide-react";
import { fetchCrmInventory, submitProjectSurvey, calculateCmaApi } from "../services/apiService";
import UploadPropertyModal from "./UploadPropertyModal";
import UploadInventoryModal from "./UploadInventoryModal";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import VideoPlayerModal from "./VideoPlayerModal";
import EditRecordModal from "./EditRecordModal";
import CustomAlertDialog from "./CustomAlertDialog";

export default function PropertiesView({ onShareProperty }) {
  const [activeMainTab, setActiveMainTab] = useState("properties");
  const [selectedSubTab, setSelectedSubTab] = useState("Focus Projects");
  const [cmaLocation, setCmaLocation] = useState("");
  const [cmaArea, setCmaArea] = useState("");
  const [cmaResult, setCmaResult] = useState(null);
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingType, setEditingType] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

  // Sub-tab Upload Modals State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("unit_plan");
  const [itemListingCategory, setItemListingCategory] = useState("My Listing");

  // Editable lists persisted in localStorage
  const [propertiesList, setPropertiesList] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_focus_projects");
      return saved ? JSON.parse(saved) : [
        {
          id: "PROP-001",
          title: "Kalpataru Vian",
          builder: "Kalpataru Limited",
          location: "Andheri West, Mumbai",
          priceRange: "₹ 2.45 Cr - 4.10 Cr",
          price: "₹ 2.45 Cr - 4.10 Cr",
          tag: "Featured Focus",
          bhk: "2 & 3 BHK Luxury",
          carpet: "740 - 1180 sq.ft",
          highlights: ["Sea Facing High-Rise Towers", "Infinity Sky Pool & Fitness Arena", "Next to Western Express Metro"],
          img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "PROP-002",
          title: "Godrej Horizon",
          builder: "Godrej Properties",
          location: "Wadala, Mumbai",
          priceRange: "₹ 1.85 Cr - 3.20 Cr",
          price: "₹ 1.85 Cr - 3.20 Cr",
          tag: "Hot Selling",
          bhk: "2 & 3 BHK",
          carpet: "680 - 1050 sq.ft",
          highlights: ["Private 5-Acre Parkland", "5 Mins from Eastern Freeway", "Double-Height Grand Lobby"],
          img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
        },
        {
          id: "PROP-003",
          title: "Oberoi Sky City",
          builder: "Oberoi Realty",
          location: "Borivali East, Mumbai",
          priceRange: "₹ 3.40 Cr - 6.20 Cr",
          price: "₹ 3.40 Cr - 6.20 Cr",
          tag: "Ready Soon",
          bhk: "3 & 4 BHK Luxury",
          carpet: "1050 - 1980 sq.ft",
          highlights: ["Integrated 25-Acre Township", "Adjoining Western Express Highway", "Clubhouse & Grand Sports Complex"],
          img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [documentsList, setDocumentsList] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_property_docs");
      return saved ? JSON.parse(saved) : [
        { id: "DOC-DEF-01", name: "Kalpataru Vian RERA Brochure", fileName: "Kalpataru_Vian_Brochure.pdf", fileType: "PDF", size: "3.4 MB", date: "24 Aug 2026", category: "Brochure / Layout" },
        { id: "DOC-DEF-02", name: "Godrej Horizon Cost Sheet & Payment Plan", fileName: "Godrej_Horizon_Cost_Sheet.docx", fileType: "DOC", size: "1.8 MB", date: "22 Aug 2026", category: "Price Sheet & Costing" },
        { id: "DOC-DEF-03", name: "Oberoi Sky City RERA Title Certificate", fileName: "Oberoi_Title_Certificate.pdf", fileType: "PDF", size: "5.6 MB", date: "20 Aug 2026", category: "RERA Approval" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [unitPlansList, setUnitPlansList] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_unit_plans");
      return saved ? JSON.parse(saved) : [
        { id: "UP-01", project: "Kalpataru Vian (2 BHK Master Plan)", area: "780 sq.ft Carpet", planImg: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
        { id: "UP-02", project: "Godrej Horizon (3 BHK Sea View Layout)", area: "1180 sq.ft Carpet", planImg: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80" },
        { id: "UP-03", project: "Oberoi Sky City (3 BHK Premium Floor)", area: "1350 sq.ft Carpet", planImg: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [videosList, setVideosList] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_videos");
      return saved ? JSON.parse(saved) : [
        { id: "VID-01", title: "Kalpataru Vian 4K Drone Tour & Sample Flat", duration: "03:45", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/watch?v=kXYiU_JCYtU" },
        { id: "VID-02", title: "Godrej Horizon Eastern Bay Sunset View Walkthrough", duration: "04:10", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U" },
        { id: "VID-03", title: "Oberoi Sky City Clubhouse & Olympic Pool Virtual Tour", duration: "05:15", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [myListingData, setMyListingData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_my_listings");
      return saved ? JSON.parse(saved) : [
        { id: "LST-101", property: "3 BHK Kalpataru Vian", locality: "Andheri West", price: "₹ 2.95 Cr", owner: "Sanjay Singhania", status: "Verified" },
        { id: "LST-102", property: "2 BHK Godrej Horizon", locality: "Wadala", price: "₹ 2.60 Cr", owner: "Vikram Kapoor", status: "Verified" },
        { id: "LST-103", property: "4 BHK Oberoi Sky City", locality: "Borivali East", price: "₹ 5.40 Cr", owner: "Deepika Padukone", status: "Active" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [employeeListingData, setEmployeeListingData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_emp_listings");
      return saved ? JSON.parse(saved) : [
        { id: "EMP-201", property: "2 BHK Sea Pearl Apartment", locality: "Bandra West", price: "₹ 3.10 Cr", agent: "Rahul Sharma (Sr. Telecaller)", status: "Active" },
        { id: "EMP-202", property: "3 BHK Oberoi Exquisite", locality: "Goregaon East", price: "₹ 4.25 Cr", agent: "Priya Sharma", status: "Under Offer" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [ownerLeadsData, setOwnerLeadsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_owner_leads");
      return saved ? JSON.parse(saved) : [
        { id: "OWN-301", name: "Sunil Gavaskar", property: "3 BHK Penthouse in Pali Hill", locality: "Bandra West", phone: "+91 98200 11223" },
        { id: "OWN-302", name: "Kareena Kapoor", property: "4 BHK Luxury Residence", locality: "Khar West", phone: "+91 98211 44556" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [cpListingData, setCpListingData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_cp_listings");
      return saved ? JSON.parse(saved) : [
        { id: "CP-401", broker: "Apex Prime Realtors (Mr. Gupta)", property: "4 BHK Duplex Penthouse", locality: "Worli Sea Face", commission: "2.0% Verified Split" },
        { id: "CP-402", broker: "Kapadia Real Estate Consultants", property: "3 BHK Sea Facing Flat", locality: "Juhu Scheme", commission: "2.5% Super Split" }
      ];
    } catch (e) {
      return [];
    }
  });

  // Survey Form State
  const [surveyBuilder, setSurveyBuilder] = useState("");
  const [surveyLocation, setSurveyLocation] = useState("");
  const [surveyPrice, setSurveyPrice] = useState("");

  // Save helpers
  const saveStateAndStorage = (key, data, setter) => {
    setter(data);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };

  const handlePropertyUploaded = (newProp) => {
    const updated = [newProp, ...propertiesList];
    saveStateAndStorage("crm_focus_projects", updated, setPropertiesList);
  };

  const handleDocumentUploaded = (newDoc) => {
    const updated = [newDoc, ...documentsList];
    saveStateAndStorage("crm_property_docs", updated, setDocumentsList);
    setSelectedSubTab("Documents");
  };

  const handleItemUploaded = (type, item) => {
    if (type === "unit_plan") {
      const updated = [{ id: `UP-${Date.now().toString().slice(-4)}`, ...item }, ...unitPlansList];
      saveStateAndStorage("crm_unit_plans", updated, setUnitPlansList);
    } else if (type === "document") {
      handleDocumentUploaded(item);
    } else if (type === "video") {
      const updated = [{ id: `VID-${Date.now().toString().slice(-4)}`, ...item }, ...videosList];
      saveStateAndStorage("crm_videos", updated, setVideosList);
    } else if (type === "listing") {
      if (item.listing_type === "My Listing") {
        const updated = [item, ...myListingData];
        saveStateAndStorage("crm_my_listings", updated, setMyListingData);
      } else if (item.listing_type === "Employee Listing") {
        const updated = [item, ...employeeListingData];
        saveStateAndStorage("crm_emp_listings", updated, setEmployeeListingData);
      } else if (item.listing_type === "Owner Lead") {
        const updated = [item, ...ownerLeadsData];
        saveStateAndStorage("crm_owner_leads", updated, setOwnerLeadsData);
      } else if (item.listing_type === "CP Listing") {
        const updated = [item, ...cpListingData];
        saveStateAndStorage("crm_cp_listings", updated, setCpListingData);
      }
    }
  };

  // Edit record handler
  const handleEditRecord = (record, type) => {
    setEditingRecord(record);
    setEditingType(type);
  };

  const handleSaveEditedRecord = (updatedRecord) => {
    if (editingType === "Property") {
      const updated = propertiesList.map(p => p.id === updatedRecord.id ? updatedRecord : p);
      saveStateAndStorage("crm_focus_projects", updated, setPropertiesList);
    } else if (editingType === "Document") {
      const updated = documentsList.map(d => d.id === updatedRecord.id ? updatedRecord : d);
      saveStateAndStorage("crm_property_docs", updated, setDocumentsList);
    } else if (editingType === "Unit Plan") {
      const updated = unitPlansList.map(u => u.id === updatedRecord.id ? updatedRecord : u);
      saveStateAndStorage("crm_unit_plans", updated, setUnitPlansList);
    } else if (editingType === "Video") {
      const updated = videosList.map(v => v.id === updatedRecord.id ? updatedRecord : v);
      saveStateAndStorage("crm_videos", updated, setVideosList);
    } else if (editingType === "My Listing") {
      const updated = myListingData.map(l => l.id === updatedRecord.id ? updatedRecord : l);
      saveStateAndStorage("crm_my_listings", updated, setMyListingData);
    } else if (editingType === "Employee Listing") {
      const updated = employeeListingData.map(l => l.id === updatedRecord.id ? updatedRecord : l);
      saveStateAndStorage("crm_emp_listings", updated, setEmployeeListingData);
    } else if (editingType === "Owner Lead") {
      const updated = ownerLeadsData.map(l => l.id === updatedRecord.id ? updatedRecord : l);
      saveStateAndStorage("crm_owner_leads", updated, setOwnerLeadsData);
    } else if (editingType === "CP Listing") {
      const updated = cpListingData.map(l => l.id === updatedRecord.id ? updatedRecord : l);
      saveStateAndStorage("crm_cp_listings", updated, setCpListingData);
    }
    setEditingRecord(null);
    setEditingType("");
  };

  // Delete confirmation handler
  const confirmDeleteRecord = (item, type, onDeleteCallback) => {
    const itemName = item.title || item.name || item.property || item.project || "this item";
    setDeleteAction(() => onDeleteCallback);
    setAlertConfig({
      title: `Delete ${type}?`,
      message: `Are you sure you want to delete '${itemName}'? This action cannot be undone.`,
      type: "warning",
      showConfirm: true
    });
  };

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

      {/* In-App Universal Edit Record Modal */}
      <EditRecordModal
        isOpen={!!editingRecord}
        onClose={() => { setEditingRecord(null); setEditingType(""); }}
        record={editingRecord}
        recordType={editingType}
        onSave={handleSaveEditedRecord}
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

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleEditRecord(doc, "Document")}
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Edit Document Details"
                >
                  <Edit3 size={13} />
                </button>

                {/* Delete button */}
                <button 
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
                  onClick={() => confirmDeleteRecord(doc, "Document", () => {
                    const updated = documentsList.filter(d => (d.id || d.name) !== (doc.id || doc.name));
                    saveStateAndStorage("crm_property_docs", updated, setDocumentsList);
                  })}
                  title="Delete Document"
                >
                  <Trash2 size={13} />
                </button>
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
            <div key={plan.id || idx} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", overflow: "hidden", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>📐 {plan.project}</h4>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button
                    onClick={() => handleEditRecord(plan, "Unit Plan")}
                    style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem 0.45rem", borderRadius: "0.375rem", cursor: "pointer" }}
                    title="Edit Unit Plan"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => confirmDeleteRecord(plan, "Unit Plan", () => {
                      const updated = unitPlansList.filter(u => (u.id || u.project) !== (plan.id || plan.project));
                      saveStateAndStorage("crm_unit_plans", updated, setUnitPlansList);
                    })}
                    style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem 0.45rem", borderRadius: "0.375rem", cursor: "pointer" }}
                    title="Delete Unit Plan"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
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
              key={vid.id || idx} 
              style={{ 
                background: "#ffffff", 
                border: "1px solid #e2e8f0", 
                borderRadius: "0.75rem", 
                overflow: "hidden", 
                padding: "0.875rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}
            >
              <div 
                onClick={() => setSelectedVideo(vid)}
                style={{ position: "relative", width: "100%", height: "150px", background: "#0f172a", borderRadius: "0.5rem", overflow: "hidden", cursor: "pointer" }}
              >
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

                <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(vid)}
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.35rem 0.65rem",
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

                  <button
                    type="button"
                    onClick={() => handleEditRecord(vid, "Video")}
                    style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer" }}
                    title="Edit Video"
                  >
                    <Edit3 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => confirmDeleteRecord(vid, "Video", () => {
                      const updated = videosList.filter(v => (v.id || v.title) !== (vid.id || vid.title));
                      saveStateAndStorage("crm_videos", updated, setVideosList);
                    })}
                    style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer" }}
                    title="Delete Video"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.6875rem", background: "#dcfce7", color: "#15803d", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.status}</span>
                  <button onClick={() => handleEditRecord(item, "My Listing")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(item, "My Listing", () => {
                    const updated = myListingData.filter(l => l.id !== item.id);
                    saveStateAndStorage("crm_my_listings", updated, setMyListingData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.6875rem", background: "#eff6ff", color: "#1d4ed8", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.status}</span>
                  <button onClick={() => handleEditRecord(item, "Employee Listing")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(item, "Employee Listing", () => {
                    const updated = employeeListingData.filter(l => l.id !== item.id);
                    saveStateAndStorage("crm_emp_listings", updated, setEmployeeListingData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>Owner: {item.name}</div>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button onClick={() => handleEditRecord(item, "Owner Lead")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(item, "Owner Lead", () => {
                    const updated = ownerLeadsData.filter(l => l.id !== item.id);
                    saveStateAndStorage("crm_owner_leads", updated, setOwnerLeadsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.6875rem", background: "#fef9c3", color: "#854d0e", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>{item.commission}</span>
                  <button onClick={() => handleEditRecord(item, "CP Listing")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(item, "CP Listing", () => {
                    const updated = cpListingData.filter(l => l.id !== item.id);
                    saveStateAndStorage("crm_cp_listings", updated, setCpListingData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
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
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>{prop.title}</h3>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() => handleEditRecord(prop, "Property")}
                      style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem 0.45rem", borderRadius: "0.35rem", cursor: "pointer" }}
                      title="Edit Property"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmDeleteRecord(prop, "Property", () => {
                        const updated = propertiesList.filter(p => p.id !== prop.id);
                        saveStateAndStorage("crm_focus_projects", updated, setPropertiesList);
                      })}
                      style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem 0.45rem", borderRadius: "0.35rem", cursor: "pointer" }}
                      title="Delete Property"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

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

      {/* Confirmation & Alert Modal */}
      {alertConfig && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(6px)",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "360px",
            padding: "1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {alertConfig.showConfirm ? "🗑️" : (alertConfig.type === "success" ? "✅" : "ℹ️")}
            </div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              {alertConfig.title}
            </h3>
            <p style={{ fontSize: "0.84375rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.4, whiteSpace: "pre-line" }}>
              {alertConfig.message}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {alertConfig.showConfirm ? (
                <>
                  <button
                    onClick={() => { setAlertConfig(null); setDeleteAction(null); }}
                    style={{ flex: 1, padding: "0.65rem", borderRadius: "0.5rem", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (deleteAction) deleteAction();
                      setAlertConfig(null);
                      setDeleteAction(null);
                    }}
                    style={{ flex: 1, padding: "0.65rem", borderRadius: "0.5rem", background: "#ef4444", color: "#ffffff", border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
                  >
                    Yes, Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAlertConfig(null)}
                  style={{ width: "100%", padding: "0.65rem", borderRadius: "0.5rem", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
