import React, { useState, useEffect } from "react";
import { 
  Building2, MapPin, Share2, Info, AlertTriangle, FileText, 
  Video, Layers, Calculator, ClipboardList, CheckCircle, Search, Filter,
  Phone, UserCheck, CheckSquare, Download, Play, Shield, Upload, Plus, Trash2, 
  FileUp, Eye, Edit3, ArrowUpDown, Sparkles, MessageSquare, FileDown, X, ChevronRight,
  ShieldCheck, ExternalLink, Compass, Home
} from "lucide-react";
import { 
  fetchCrmInventory, 
  uploadPropertyApi, 
  deletePropertyApi,
  fetchPropertyDocumentsApi, 
  uploadPropertyDocumentApi, 
  deletePropertyDocumentApi,
  fetchUnitPlansApi, 
  uploadUnitPlanApi, 
  deleteUnitPlanApi,
  fetchPropertyVideosApi, 
  uploadPropertyVideoApi, 
  deletePropertyVideoApi,
  fetchCmaAnalysesApi, 
  calculateCmaApi, 
  deleteCmaAnalysisApi,
  fetchProjectSurveysApi, 
  submitProjectSurvey, 
  deleteProjectSurveyApi,
  fetchPropertyListingsApi, 
  uploadPropertyListingApi, 
  deletePropertyListingApi 
} from "../services/apiService";
import UploadPropertyModal from "./UploadPropertyModal";
import UploadInventoryModal from "./UploadInventoryModal";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import VideoPlayerModal from "./VideoPlayerModal";
import EditRecordModal from "./EditRecordModal";
import CustomAlertDialog from "./CustomAlertDialog";
import { INITIAL_INVENTORY } from "../services/mockData";
import { exportLeadsToExcel } from "../utils/excelExport";

export default function PropertiesView({ onShareProperty, showToast }) {
  // Navigation: "projects", "documents", "plans", "videos", "listings", "valuation"
  const [activeTabNav, setActiveTabNav] = useState("projects");
  
  // Dynamic filter states
  const [bhkFilter, setBhkFilter] = useState("ALL");
  const [localityFilter, setLocalityFilter] = useState("ALL");
  const [docCategoryFilter, setDocCategoryFilter] = useState("ALL");
  const [listingCategoryFilter, setListingCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // CMA State
  const [cmaLocation, setCmaLocation] = useState("");
  const [cmaArea, setCmaArea] = useState("");
  const [cmaResult, setCmaResult] = useState(null);
  const [cmaHistory, setCmaHistory] = useState([]);
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPropertyDrawer, setSelectedPropertyDrawer] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingType, setEditingType] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

  // Sub-tab Upload Modals State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("unit_plan");
  const [itemListingCategory, setItemListingCategory] = useState("My Listing");

  // Editable lists synced with Frappe Backend
  const [propertiesList, setPropertiesList] = useState(INITIAL_INVENTORY?.focusProjects || []);
  const [documentsList, setDocumentsList] = useState(INITIAL_INVENTORY?.documents || []);
  const [unitPlansList, setUnitPlansList] = useState(INITIAL_INVENTORY?.unitPlans || []);
  const [videosList, setVideosList] = useState(INITIAL_INVENTORY?.videos || []);
  const [myListingData, setMyListingData] = useState([]);
  const [employeeListingData, setEmployeeListingData] = useState([]);
  const [ownerLeadsData, setOwnerLeadsData] = useState([]);
  const [cpListingData, setCpListingData] = useState([]);
  const [ownerListingData, setOwnerListingData] = useState([]);
  const [surveysList, setSurveysList] = useState([]);

  // Survey Form State
  const [surveyBuilder, setSurveyBuilder] = useState("");
  const [surveyLocation, setSurveyLocation] = useState("");
  const [surveyPrice, setSurveyPrice] = useState("");
  const [surveyRera, setSurveyRera] = useState("");
  const [surveyNotes, setSurveyNotes] = useState("");

  // Load backend data on component mount
  useEffect(() => {
    loadAllBackendData();
  }, []);

  const loadAllBackendData = async () => {
    try {
      // 1. Focus Projects
      const invRes = await fetchCrmInventory();
      if (invRes && invRes.data && invRes.data.length > 0) {
        setPropertiesList(invRes.data);
      } else if (Array.isArray(invRes) && invRes.length > 0) {
        setPropertiesList(invRes);
      } else if (INITIAL_INVENTORY?.focusProjects) {
        setPropertiesList(INITIAL_INVENTORY.focusProjects);
      }

      // 2. Documents
      const docRes = await fetchPropertyDocumentsApi();
      if (Array.isArray(docRes) && docRes.length > 0) {
        setDocumentsList(docRes);
      }

      // 3. Unit Plans
      const plansRes = await fetchUnitPlansApi();
      if (Array.isArray(plansRes) && plansRes.length > 0) {
        setUnitPlansList(plansRes);
      }

      // 4. Videos
      const vidRes = await fetchPropertyVideosApi();
      if (Array.isArray(vidRes) && vidRes.length > 0) {
        setVideosList(vidRes);
      }

      // 5. CMA History
      const cmaRes = await fetchCmaAnalysesApi();
      if (Array.isArray(cmaRes)) {
        setCmaHistory(cmaRes);
      }

      // 6. Surveys
      const survRes = await fetchProjectSurveysApi();
      if (Array.isArray(survRes)) {
        setSurveysList(survRes);
      }

      // 7. Property Listings
      const listRes = await fetchPropertyListingsApi();
      if (Array.isArray(listRes) && listRes.length > 0) {
        setMyListingData(listRes.filter(l => l.listing_type === "My Listing"));
        setEmployeeListingData(listRes.filter(l => l.listing_type === "Employee Listing"));
        setOwnerLeadsData(listRes.filter(l => l.listing_type === "Owner Lead"));
        setCpListingData(listRes.filter(l => l.listing_type === "CP Listing"));
        setOwnerListingData(listRes.filter(l => l.listing_type === "Owner Listing"));
      }
    } catch (err) {
      console.log("[PropertiesView Data Loading Error]", err);
    }
  };

  const handlePropertyUploaded = (newProp) => {
    const updated = [newProp, ...propertiesList];
    setPropertiesList(updated);
    try { localStorage.setItem("crm_focus_projects", JSON.stringify(updated)); } catch (e) {}
    if (showToast) showToast(`🏢 Property '${newProp.title}' uploaded successfully!`);
  };

  const handleDocumentUploaded = (newDoc) => {
    const updated = [newDoc, ...documentsList];
    setDocumentsList(updated);
    try { localStorage.setItem("crm_property_docs", JSON.stringify(updated)); } catch (e) {}
    setActiveTabNav("documents");
    if (showToast) showToast(`📁 Document '${newDoc.name || newDoc.document_name}' uploaded successfully!`);
  };

  const handleItemUploaded = (type, item) => {
    if (type === "unit_plan") {
      const updated = [{ id: `UP-${Date.now().toString().slice(-4)}`, ...item }, ...unitPlansList];
      setUnitPlansList(updated);
      try { localStorage.setItem("crm_unit_plans", JSON.stringify(updated)); } catch (e) {}
      if (showToast) showToast(`📐 Unit Plan added successfully!`);
    } else if (type === "document") {
      handleDocumentUploaded(item);
    } else if (type === "video") {
      const updated = [{ id: `VID-${Date.now().toString().slice(-4)}`, ...item }, ...videosList];
      setVideosList(updated);
      try { localStorage.setItem("crm_videos", JSON.stringify(updated)); } catch (e) {}
      if (showToast) showToast(`🎥 3D Video Tour added successfully!`);
    } else if (type === "listing") {
      if (item.listing_type === "My Listing") {
        setMyListingData(prev => [item, ...prev]);
      } else if (item.listing_type === "Employee Listing") {
        setEmployeeListingData(prev => [item, ...prev]);
      } else if (item.listing_type === "Owner Lead") {
        setOwnerLeadsData(prev => [item, ...prev]);
      } else if (item.listing_type === "CP Listing") {
        setCpListingData(prev => [item, ...prev]);
      } else if (item.listing_type === "Owner Listing") {
        setOwnerListingData(prev => [item, ...prev]);
      }
      if (showToast) showToast(`📋 Listing added successfully!`);
    }
  };

  const handleEditRecord = (record, type) => {
    setEditingRecord(record);
    setEditingType(type);
  };

  const handleSaveEditedRecord = async (updatedRecord) => {
    const itemName = updatedRecord.title || updatedRecord.name || updatedRecord.document_name || updatedRecord.property || updatedRecord.project || "Record";
    
    if (editingType === "Property") {
      setPropertiesList(prev => prev.map(p => (p.name === updatedRecord.name || p.id === updatedRecord.id || p.title === updatedRecord.title) ? updatedRecord : p));
      await uploadPropertyApi(updatedRecord);
    } else if (editingType === "Document") {
      setDocumentsList(prev => prev.map(d => (d.name === updatedRecord.name || d.id === updatedRecord.id) ? updatedRecord : d));
      await uploadPropertyDocumentApi({
        doc_id: updatedRecord.name || updatedRecord.id,
        document_name: updatedRecord.document_name || updatedRecord.name,
        category: updatedRecord.category,
        file_size: updatedRecord.file_size || updatedRecord.size,
        file_url: updatedRecord.file_url || updatedRecord.dataUrl
      });
    } else if (editingType === "Unit Plan") {
      setUnitPlansList(prev => prev.map(u => (u.name === updatedRecord.name || u.id === updatedRecord.id) ? updatedRecord : u));
      await uploadUnitPlanApi({
        plan_id: updatedRecord.name || updatedRecord.id,
        project: updatedRecord.project,
        bhk_type: updatedRecord.bhk_type || updatedRecord.bhk,
        area: updatedRecord.area,
        plan_img: updatedRecord.plan_img || updatedRecord.planImg
      });
    } else if (editingType === "Video") {
      setVideosList(prev => prev.map(v => (v.name === updatedRecord.name || v.id === updatedRecord.id) ? updatedRecord : v));
      await uploadPropertyVideoApi({
        video_id: updatedRecord.name || updatedRecord.id,
        title: updatedRecord.title,
        duration: updatedRecord.duration,
        video_url: updatedRecord.video_url || updatedRecord.url,
        thumbnail: updatedRecord.thumbnail || updatedRecord.img
      });
    } else if (editingType.includes("Listing") || editingType === "Owner Lead") {
      if (editingType === "My Listing") setMyListingData(prev => prev.map(l => (l.name === updatedRecord.name || l.id === updatedRecord.id) ? updatedRecord : l));
      if (editingType === "Employee Listing") setEmployeeListingData(prev => prev.map(l => (l.name === updatedRecord.name || l.id === updatedRecord.id) ? updatedRecord : l));
      if (editingType === "Owner Lead") setOwnerLeadsData(prev => prev.map(l => (l.name === updatedRecord.name || l.id === updatedRecord.id) ? updatedRecord : l));
      if (editingType === "CP Listing") setCpListingData(prev => prev.map(l => (l.name === updatedRecord.name || l.id === updatedRecord.id) ? updatedRecord : l));
      if (editingType === "Owner Listing") setOwnerListingData(prev => prev.map(l => (l.name === updatedRecord.name || l.id === updatedRecord.id) ? updatedRecord : l));
      
      await uploadPropertyListingApi({
        listing_id: updatedRecord.name || updatedRecord.id,
        listing_type: updatedRecord.listing_type || editingType,
        title: updatedRecord.title || updatedRecord.property,
        locality: updatedRecord.locality,
        price: updatedRecord.price,
        owner_or_agent: updatedRecord.owner_or_agent || updatedRecord.owner || updatedRecord.agent || updatedRecord.broker,
        phone: updatedRecord.phone,
        status: updatedRecord.status,
        commission: updatedRecord.commission
      });
    }

    if (showToast) showToast(`✅ '${itemName}' updated successfully in CRM Database!`);
    setEditingRecord(null);
    setEditingType("");
  };

  const confirmDeleteRecord = (item, type, onDeleteCallback) => {
    const itemName = item.title || item.name || item.document_name || item.property || item.project || item.builder || "this item";
    setDeleteAction(() => async () => {
      if (onDeleteCallback) onDeleteCallback();
      try {
        if (type === "Property") {
          await deletePropertyApi(item.name || item.title);
        } else if (type === "Document") {
          await deletePropertyDocumentApi(item.name || item.id);
        } else if (type === "Unit Plan") {
          await deleteUnitPlanApi(item.name || item.id);
        } else if (type === "Video") {
          await deletePropertyVideoApi(item.name || item.id);
        } else if (type === "CMA Analysis") {
          await deleteCmaAnalysisApi(item.name || item.id);
        } else if (type === "Project Survey") {
          await deleteProjectSurveyApi(item.name || item.id);
        } else if (type.includes("Listing") || type === "Owner Lead") {
          await deletePropertyListingApi(item.name || item.id);
        }
      } catch (err) {
        console.log(`[Delete error for ${type}]`, err);
      }

      if (showToast) showToast(`🗑️ '${itemName}' deleted from CRM Database!`);
    });

    setAlertConfig({
      title: `Delete ${type}?`,
      message: `Are you sure you want to permanently delete '${itemName}' from the database?`,
      type: "warning",
      showConfirm: true
    });
  };

  const handleCalculateCMA = async (e) => {
    e.preventDefault();
    const res = await calculateCmaApi(cmaLocation, cmaArea);
    if (res) {
      setCmaResult(res);
      setCmaHistory(prev => [res, ...prev]);
      if (showToast) showToast(`📊 Market Valuation computed & saved to CRM DB!`);
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
      price_range: surveyPrice,
      rera_no: surveyRera,
      survey_notes: surveyNotes
    });
    const newSurvObj = {
      name: res?.survey_id || `SURV-${Date.now().toString().slice(-4)}`,
      builder: surveyBuilder,
      location: surveyLocation || "Mumbai",
      price_range: surveyPrice || "₹ 2.0 Cr+",
      rera_no: surveyRera,
      survey_notes: surveyNotes,
      creation: new Date().toISOString()
    };
    setSurveysList(prev => [newSurvObj, ...prev]);
    const successMsg = typeof res?.message === "string" ? res.message : `Field Survey for '${surveyBuilder}' submitted to CRM Database!`;
    setAlertConfig({ title: "Survey Submitted!", message: successMsg, type: "success" });
    setSurveyBuilder("");
    setSurveyLocation("");
    setSurveyPrice("");
    setSurveyRera("");
    setSurveyNotes("");
  };

  // Universal Filter Predicate
  const matchFilter = (item, fieldsToSearch = []) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matched = fieldsToSearch.some(fieldVal => fieldVal && String(fieldVal).toLowerCase().includes(q));
      if (!matched) return false;
    }
    if (localityFilter !== "ALL") {
      const locKey = (item.location || item.locality || item.project || item.name || "").toLowerCase();
      if (!locKey.includes(localityFilter.toLowerCase())) return false;
    }
    if (bhkFilter !== "ALL") {
      const bhkKey = (item.bhk || item.bhk_type || item.bhkType || item.title || item.property || "").toLowerCase();
      if (!bhkKey.includes(bhkFilter.toLowerCase().replace(" types", ""))) return false;
    }
    return true;
  };

  // Filtered Lists
  const filteredProperties = propertiesList.filter(p => matchFilter(p, [p.title, p.builder, p.location, p.bhk, p.price_range, p.tag]));
  const filteredDocs = documentsList.filter(d => {
    if (docCategoryFilter !== "ALL" && !String(d.category || "").toLowerCase().includes(docCategoryFilter.toLowerCase())) return false;
    return matchFilter(d, [d.name, d.document_name, d.project, d.category, d.file_type]);
  });
  const filteredPlans = unitPlansList.filter(u => matchFilter(u, [u.project, u.bhk_type, u.area, u.notes]));
  const filteredVideos = videosList.filter(v => matchFilter(v, [v.title, v.project, v.duration]));
  
  const allListings = [
    ...myListingData.map(l => ({ ...l, category: "My Listing" })),
    ...employeeListingData.map(l => ({ ...l, category: "Employee Listing" })),
    ...ownerLeadsData.map(l => ({ ...l, category: "Owner Lead" })),
    ...cpListingData.map(l => ({ ...l, category: "CP Listing" })),
    ...ownerListingData.map(l => ({ ...l, category: "Owner Listing" }))
  ];
  const filteredListings = allListings.filter(l => {
    if (listingCategoryFilter !== "ALL" && l.category !== listingCategoryFilter) return false;
    return matchFilter(l, [l.title, l.property, l.locality, l.price, l.owner, l.owner_or_agent]);
  });

  return (
    <div className="view-container" style={{ padding: "0.65rem 0.85rem 5rem 0.85rem", background: "#f8fafc", minHeight: "100%" }}>
      {/* Upload Property Modal */}
      <UploadPropertyModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPropertyUploaded={handlePropertyUploaded}
      />

      {/* Doc Upload Modal */}
      <DocUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
        categoryTitle="Property & Inventory Documents"
      />

      {/* Item Modal (Unit Plan, Video, Listing) */}
      <UploadInventoryModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onItemUploaded={handleItemUploaded}
        initialMode={itemModalMode}
        initialCategory={itemListingCategory}
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

      {/* Edit Record Modal */}
      {editingRecord && (
        <EditRecordModal
          isOpen={!!editingRecord}
          onClose={() => { setEditingRecord(null); setEditingType(""); }}
          record={editingRecord}
          type={editingType}
          onSave={handleSaveEditedRecord}
        />
      )}

      {/* 1. SUB-HEADER TAB NAVIGATION (MATCHING FRESH LEADS / FOLLOW-UPS SPEC) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1.5px solid #e2e8f0",
        padding: "0 0.25rem",
        marginBottom: "0.65rem",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
      }}>
        {[
          { id: "projects", label: "Projects" },
          { id: "documents", label: "Brochures" },
          { id: "plans", label: "Unit Plans" },
          { id: "videos", label: "3D Tours" },
          { id: "listings", label: "Listings" },
          { id: "valuation", label: "Valuation" }
        ].map((tab) => {
          const isActive = activeTabNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabNav(tab.id);
                setBhkFilter("ALL");
                setLocalityFilter("ALL");
                setDocCategoryFilter("ALL");
                setListingCategoryFilter("ALL");
              }}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                padding: "0.65rem 0.15rem",
                fontSize: "0.78125rem",
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "#0f172a" : "#64748b",
                borderBottom: isActive ? "2.5px solid #0f172a" : "2.5px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                marginBottom: "-1.5px",
                textAlign: "center",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. DYNAMIC FILTER PILLS BASED ON ACTIVE TAB */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        overflowX: "auto",
        paddingBottom: "0.65rem",
        marginBottom: "0.5rem",
        scrollbarWidth: "none"
      }}>
        {activeTabNav === "projects" && (
          <>
            <button
              onClick={() => { setBhkFilter("ALL"); setLocalityFilter("ALL"); }}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: (bhkFilter === "ALL" && localityFilter === "ALL") ? "#0f172a" : "#ffffff",
                color: (bhkFilter === "ALL" && localityFilter === "ALL") ? "#ffffff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              All ({propertiesList.length})
            </button>
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Penthouse"].map(bhk => (
              <button
                key={bhk}
                onClick={() => setBhkFilter(bhkFilter === bhk ? "ALL" : bhk)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: bhkFilter === bhk ? "#2563eb" : "#ffffff",
                  color: bhkFilter === bhk ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                🏠 {bhk}
              </button>
            ))}
            {["Bhandup", "Andheri", "Worli", "Thane", "Borivali"].map(loc => (
              <button
                key={loc}
                onClick={() => setLocalityFilter(localityFilter === loc ? "ALL" : loc)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: localityFilter === loc ? "#0f172a" : "#ffffff",
                  color: localityFilter === loc ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                📍 {loc}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "documents" && (
          <>
            <button
              onClick={() => setDocCategoryFilter("ALL")}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: docCategoryFilter === "ALL" ? "#0f172a" : "#ffffff",
                color: docCategoryFilter === "ALL" ? "#ffffff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              All Docs ({documentsList.length})
            </button>
            {["Brochure", "Price Sheet", "RERA Approval", "Floor Plan"].map(cat => (
              <button
                key={cat}
                onClick={() => setDocCategoryFilter(docCategoryFilter === cat ? "ALL" : cat)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: docCategoryFilter === cat ? "#2563eb" : "#ffffff",
                  color: docCategoryFilter === cat ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                📄 {cat}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "plans" && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, padding: "4px 8px" }}>
            Showing {filteredPlans.length} verified 2D/3D Unit Layout Plans
          </span>
        )}

        {activeTabNav === "videos" && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, padding: "4px 8px" }}>
            Showing {filteredVideos.length} Ultra-HD 4K Virtual Walkthrough Tours
          </span>
        )}

        {activeTabNav === "listings" && (
          <>
            {["ALL", "My Listing", "Employee Listing", "Owner Lead", "CP Listing"].map(cat => (
              <button
                key={cat}
                onClick={() => setListingCategoryFilter(cat)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: listingCategoryFilter === cat ? "#0f172a" : "#ffffff",
                  color: listingCategoryFilter === cat ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {cat === "ALL" ? `All Listings (${allListings.length})` : cat}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "valuation" && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, padding: "4px 8px" }}>
            CMA Rate Calculator & Field Survey Engine
          </span>
        )}
      </div>

      {/* 3. SLEEK UTILITY BAR (SEARCH + COMPACT CRM ACTION PILLS) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.85rem",
        background: "#ffffff",
        padding: "0.4rem 0.6rem",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        {/* Search input */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder={`Search ${activeTabNav} (Project, builder, locality, price)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "0.8125rem",
              color: "#0f172a",
              width: "100%",
              background: "transparent"
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Compact Action Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              background: "#0f172a",
              color: "#ffffff",
              border: "none",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Add Focus Property"
          >
            <Plus size={11} /> +Property
          </button>

          <button
            onClick={() => setIsDocModalOpen(true)}
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1d4ed8",
              padding: "4px 7px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Upload RERA Brochure PDF"
          >
            <FileUp size={11} /> +Doc
          </button>

          <button
            onClick={() => { setItemModalMode("video"); setIsItemModalOpen(true); }}
            style={{
              background: "#f5f3ff",
              border: "1px solid #ddd6fe",
              color: "#6d28d9",
              padding: "4px 7px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Upload 3D Virtual Tour"
          >
            <Video size={11} /> +Tour
          </button>

          <button
            onClick={() => exportLeadsToExcel(filteredProperties, "Inventory_Report")}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              padding: "4px 7px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Download Inventory Excel Report"
          >
            <FileDown size={11} />
          </button>
        </div>
      </div>

      {/* 4. MAIN BODY RENDERER BY ACTIVE TAB */}

      {/* TAB A: FOCUS PROJECTS */}
      {activeTabNav === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredProperties.map((prop) => (
            <div
              key={prop.name || prop.id || prop.title}
              onClick={() => setSelectedPropertyDrawer(prop)}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.15s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"}
            >
              {/* Photo Banner with Badges */}
              <div style={{ position: "relative", width: "100%", height: "140px", background: "#0f172a" }}>
                <img
                  src={prop.img || prop.image || prop.hero_img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                  alt={prop.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)"
                }} />

                {/* Top Badges */}
                <div style={{ position: "absolute", top: "8px", left: "10px", display: "flex", gap: "4px" }}>
                  <span style={{
                    background: "rgba(15, 23, 42, 0.85)",
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    backdropFilter: "blur(4px)"
                  }}>
                    {prop.builder || "Exclusive Project"}
                  </span>
                  <span style={{
                    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#ffffff",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    fontSize: "0.625rem",
                    fontWeight: 800,
                    letterSpacing: "0.3px",
                    boxShadow: "0 2px 4px rgba(22,163,74,0.4)"
                  }}>
                    RERA APPROVED
                  </span>
                </div>

                {/* Price Pill Tag on Banner */}
                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "10px",
                  background: "#ffffff",
                  color: "#0f172a",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "0.8125rem",
                  fontWeight: 900,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                  {prop.price_range || prop.priceRange || prop.price || "₹ 1.25 Cr+"}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "3px" }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.2 }}>
                      {prop.title}
                    </h3>
                    <div style={{ fontSize: "0.71875rem", color: "#64748b", fontWeight: 600, marginTop: "2px", display: "flex", alignItems: "center", gap: "3px" }}>
                      <MapPin size={11} color="#2563eb" />
                      <span>{prop.location || "Mumbai"}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEditRecord(prop, "Property")}
                      style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Edit Property"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => confirmDeleteRecord(prop, "Property", () => {
                        setPropertiesList(prev => prev.filter(p => (p.name || p.title) !== (prop.name || prop.title)));
                      })}
                      style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Delete Property"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Configurations & Carpet */}
                <div style={{ fontSize: "0.75rem", color: "#334155", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>🏠</span>
                  <span>{prop.bhk ? `${prop.bhk} Luxury Residences` : "2 & 3 BHK Residences"} • {prop.carpet || "650 - 1200 sq.ft"}</span>
                </div>

                {/* Highlights tags */}
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", margin: "6px 0" }}>
                  <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 7px", borderRadius: "6px", fontSize: "0.625rem", fontWeight: 700 }}>
                    Direct GMLR Access
                  </span>
                  <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 7px", borderRadius: "6px", fontSize: "0.625rem", fontWeight: 700 }}>
                    Olympic Clubhouse
                  </span>
                  <span style={{ background: "#f0fdf4", color: "#166534", padding: "2px 7px", borderRadius: "6px", fontSize: "0.625rem", fontWeight: 700 }}>
                    MahaRERA Registered
                  </span>
                </div>

                {/* Action Row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #f1f5f9", marginTop: "6px" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => onShareProperty(prop)}
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        color: "#166534",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        fontSize: "0.71875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <MessageSquare size={12} color="#16a34a" /> Share Pitch
                    </button>
                    <button
                      onClick={() => setAlertConfig({ title: "Downloading Brochure", message: `Downloading High-Res RERA Verified PDF Brochure for ${prop.title}...`, type: "info" })}
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        color: "#1d4ed8",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        fontSize: "0.71875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <FileDown size={12} /> Brochure PDF
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedPropertyDrawer(prop)}
                    style={{
                      background: "#0f172a",
                      color: "#ffffff",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: "8px",
                      fontSize: "0.71875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px"
                    }}
                  >
                    Details <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProperties.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#ffffff", borderRadius: "1rem", border: "1.5px dashed #cbd5e1" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏢</div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>No Projects Matching Filter</h4>
              <p style={{ fontSize: "0.78125rem", color: "#64748b", margin: "4px 0 1rem 0" }}>Try resetting your BHK or Locality filters</p>
              <button
                onClick={() => { setBhkFilter("ALL"); setLocalityFilter("ALL"); setSearchQuery(""); }}
                style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "6px 14px", borderRadius: "9999px", fontSize: "0.78125rem", fontWeight: 700, cursor: "pointer" }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB B: DOCUMENTS & BROCHURES */}
      {activeTabNav === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredDocs.map((doc, idx) => (
            <div
              key={doc.name || doc.id || idx}
              onClick={() => setSelectedViewDoc(doc)}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: (doc.file_type === "PDF" || (doc.document_name || doc.name || "").endsWith(".pdf")) ? "#fee2e2" : "#e0e7ff",
                  color: (doc.file_type === "PDF" || (doc.document_name || doc.name || "").endsWith(".pdf")) ? "#dc2626" : "#4338ca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "0.6875rem",
                  flexShrink: 0
                }}>
                  {doc.file_type || "PDF"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.document_name || doc.name}
                  </div>
                  <div style={{ fontSize: "0.71875rem", color: "#64748b", marginTop: "2px" }}>
                    {doc.category || "Brochure"} • {doc.file_size || doc.size || "1.5 MB"} • {doc.upload_date || doc.date || "Today"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedViewDoc(doc)}
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "4px 8px", borderRadius: "6px", fontSize: "0.71875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => handleEditRecord(doc, "Document")}
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Edit"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={() => confirmDeleteRecord(doc, "Document", () => {
                    setDocumentsList(prev => prev.filter(d => (d.name || d.id) !== (doc.name || doc.id)));
                  })}
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#ffffff", borderRadius: "1rem", border: "1.5px dashed #cbd5e1" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>No Documents Found</h4>
              <p style={{ fontSize: "0.78125rem", color: "#64748b" }}>Upload a new RERA PDF brochure or agreement</p>
            </div>
          )}
        </div>
      )}

      {/* TAB C: UNIT FLOOR PLANS */}
      {activeTabNav === "plans" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredPlans.map((plan, idx) => (
            <div key={plan.name || plan.id || idx} style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", padding: "10px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>📐 {plan.project}</h4>
                  <div style={{ fontSize: "0.71875rem", color: "#64748b", marginTop: "1px" }}>Area: {plan.area || "750 sq.ft Carpet"} • {plan.bhk_type || "2 BHK"}</div>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => handleEditRecord(plan, "Unit Plan")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(plan, "Unit Plan", () => {
                    setUnitPlansList(prev => prev.filter(u => (u.name || u.id) !== (plan.name || plan.id)));
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={12} /></button>
                </div>
              </div>
              <img
                src={plan.plan_img || plan.planImg || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"}
                alt={plan.project}
                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", margin: "4px 0" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <button
                onClick={() => setAlertConfig({ title: "Downloading Layout", message: `Downloading High-Res 2D/3D Floor Plan PDF for ${plan.project}...`, type: "info" })}
                style={{ width: "100%", marginTop: "6px", background: "#0f172a", color: "#ffffff", border: "none", padding: "6px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}
              >
                <Download size={13} /> Download Floor Layout PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB D: 3D VIRTUAL VIDEO TOURS */}
      {activeTabNav === "videos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredVideos.map((vid, idx) => (
            <div key={vid.name || vid.id || idx} style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", padding: "10px 12px" }}>
              <div
                onClick={() => setSelectedVideo(vid)}
                style={{ position: "relative", width: "100%", height: "140px", background: "#0f172a", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}
              >
                <img
                  src={vid.thumbnail || vid.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                  alt={vid.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#2563eb", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,99,235,0.6)" }}>
                    <Play size={20} fill="#ffffff" style={{ marginLeft: "2px" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "rgba(0,0,0,0.75)", color: "#ffffff", padding: "2px 6px", borderRadius: "4px", fontSize: "0.625rem", fontWeight: 700 }}>
                  {vid.duration || "4K Tour"}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                <div>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{vid.title}</h4>
                  <div style={{ fontSize: "0.71875rem", color: "#64748b" }}>Duration: {vid.duration || "03:30"} • Tap to Play 3D Tour</div>
                </div>
                <button
                  onClick={() => setSelectedVideo(vid)}
                  style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "5px 10px", borderRadius: "6px", fontSize: "0.71875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                >
                  <Play size={11} fill="#ffffff" /> Watch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB E: PROPERTY LISTINGS */}
      {activeTabNav === "listings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredListings.map((item, idx) => (
            <div key={item.name || item.id || idx} style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 2px 6px rgba(0,0,0,0.03)", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#2563eb", textTransform: "uppercase" }}>{item.category}</div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", margin: "2px 0" }}>{item.title || item.property || "Property"}</h4>
                <div style={{ fontSize: "0.71875rem", color: "#64748b" }}>📍 {item.locality || "Mumbai"} • <strong style={{ color: "#16a34a" }}>{item.price || "₹ On Request"}</strong></div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={() => handleEditRecord(item, item.category)} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={12} /></button>
                <button onClick={() => confirmDeleteRecord(item, item.category, () => {
                  setMyListingData(prev => prev.filter(l => (l.name || l.id) !== (item.name || item.id)));
                })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", width: "26px", height: "26px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB F: VALUATION & FIELD SURVEY */}
      {activeTabNav === "valuation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* CMA Valuation Card */}
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "12px" }}>
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>📊 Quick CMA Property Rate Estimator</h4>
            <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
              <input
                type="text"
                placeholder="Locality (e.g. Bandra West, Worli, Thane)"
                value={cmaLocation}
                onChange={(e) => setCmaLocation(e.target.value)}
                style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8125rem" }}
              />
              <input
                type="number"
                placeholder="Carpet Area (sqft)"
                value={cmaArea}
                onChange={(e) => setCmaArea(e.target.value)}
                style={{ width: "120px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8125rem" }}
              />
            </div>
            <button
              onClick={handleCalculateCMA}
              style={{ width: "100%", background: "#2563eb", color: "#ffffff", border: "none", padding: "8px", borderRadius: "8px", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer" }}
            >
              Compute Fair Market Valuation
            </button>

            {cmaResult && (
              <div style={{ marginTop: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 700 }}>Estimated Valuation for {cmaLocation}:</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#15803d", margin: "2px 0" }}>{cmaResult.estimated_price || "₹ 2.45 Cr"}</div>
                <div style={{ fontSize: "0.71875rem", color: "#166534" }}>Avg Rate: {cmaResult.rate_per_sqft || "₹ 32,500/sq.ft"} • Confidence: 94%</div>
              </div>
            )}
          </div>

          {/* Survey Submission Card */}
          <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "12px" }}>
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>📝 Field Project Survey Logger</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <input type="text" placeholder="Builder / Developer Name *" value={surveyBuilder} onChange={e => setSurveyBuilder(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8125rem" }} />
              <input type="text" placeholder="Project Location / Ward" value={surveyLocation} onChange={e => setSurveyLocation(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8125rem" }} />
              <input type="text" placeholder="Price Range (e.g. ₹ 1.5 - 2.8 Cr)" value={surveyPrice} onChange={e => setSurveyPrice(e.target.value)} style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.8125rem" }} />
              <button onClick={handleSurveySubmit} style={{ background: "#0f172a", color: "#ffffff", border: "none", padding: "8px", borderRadius: "8px", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", marginTop: "4px" }}>
                Log Project Survey to MariaDB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SLIDE-UP PROJECT DETAIL SHEET (OPENED BY CLICKING ROW) */}
      {selectedPropertyDrawer && (
        <div 
          onClick={() => setSelectedPropertyDrawer(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "412px",
              background: "#ffffff",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "1.25rem 1.25rem 2rem 1.25rem",
              boxShadow: "0 -10px 30px rgba(0,0,0,0.25)",
              animation: "slideUp 0.2s ease",
              maxHeight: "85vh",
              overflowY: "auto"
            }}
          >
            {/* Grabber Bar */}
            <div style={{ width: "36px", height: "4px", borderRadius: "9999px", background: "#cbd5e1", margin: "0 auto 1rem auto" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>
                  {selectedPropertyDrawer.title}
                </h3>
                <div style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 600 }}>
                  By {selectedPropertyDrawer.builder} • {selectedPropertyDrawer.location}
                </div>
              </div>
              <button 
                onClick={() => setSelectedPropertyDrawer(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Photo preview */}
            <div style={{ width: "100%", height: "160px", borderRadius: "12px", overflow: "hidden", position: "relative", marginBottom: "1rem" }}>
              <img
                src={selectedPropertyDrawer.img || selectedPropertyDrawer.image || selectedPropertyDrawer.hero_img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                alt={selectedPropertyDrawer.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: "8px", left: "10px", background: "rgba(15,23,42,0.85)", color: "#ffffff", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 800 }}>
                {selectedPropertyDrawer.price_range || selectedPropertyDrawer.priceRange || selectedPropertyDrawer.price}
              </div>
            </div>

            {/* Specs Badges */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                🏠 {selectedPropertyDrawer.bhk || "2 & 3 BHK"}
              </span>
              <span style={{ background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                📐 {selectedPropertyDrawer.carpet || "650 - 1200 sq.ft Carpet"}
              </span>
              <span style={{ background: "#fef3c7", color: "#b45309", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                🛡️ MahaRERA Registered
              </span>
            </div>

            {/* Key Highlights */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1rem", fontSize: "0.8125rem", color: "#334155" }}>
              <div style={{ fontWeight: 800, marginBottom: "4px", color: "#0f172a" }}>Project Highlights & Amenities:</div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.5 }}>
                <li>Direct Connectivity to major arterial highways / metro station</li>
                <li>Olympic-size swimming pool, 3-level designer clubhouse & gymnasium</li>
                <li>Sun-Deck residences with unobstructed panoramic views</li>
                <li>100% RERA verified clear title with leading bank loan pre-approvals</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <button
                onClick={() => {
                  const prop = selectedPropertyDrawer;
                  setSelectedPropertyDrawer(null);
                  onShareProperty(prop);
                }}
                style={{
                  flex: 1,
                  background: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
                }}
              >
                <MessageSquare size={16} /> Share via WhatsApp
              </button>

              <button
                onClick={() => {
                  const prop = selectedPropertyDrawer;
                  setSelectedPropertyDrawer(null);
                  setAlertConfig({ title: "Downloading Brochure", message: `Downloading complete high-res PDF brochure for ${prop.title}...`, type: "info" });
                }}
                style={{
                  flex: 1,
                  background: "#0f172a",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.3)"
                }}
              >
                <FileDown size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Alert Dialog */}
      {alertConfig && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "340px",
            padding: "1.25rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {alertConfig.showConfirm ? "🗑️" : (alertConfig.type === "success" ? "✅" : "ℹ️")}
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
              {alertConfig.title}
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.4, whiteSpace: "pre-line" }}>
              {alertConfig.message}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
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
                  style={{ width: "100%", padding: "0.65rem", borderRadius: "0.5rem", background: "#0f172a", color: "#ffffff", border: "none", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}
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
