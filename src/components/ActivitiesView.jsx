import React, { useState, useEffect } from "react";
import { 
  Calendar, CheckCircle2, Users, Award, Video, Clock, 
  MapPin, ChevronRight, UserCheck, Star, ShieldCheck, Zap,
  FileCheck, UserPlus, Play, PhoneCall, Filter, ExternalLink,
  FileUp, Download, Trash2, FileText, Eye, Edit3
} from "lucide-react";
import { fetchCrmActivities } from "../services/apiService";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import EditRecordModal from "./EditRecordModal";
import CustomAlertDialog from "./CustomAlertDialog";

export default function ActivitiesView({ showToast }) {
  const [selectedTab, setSelectedTab] = useState("My Visits");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingType, setEditingType] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

  // Persistent State for each activity category
  const [visitsData, setVisitsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_visits");
      return saved ? JSON.parse(saved) : [
        { id: "VISIT-101", title: "Site Visit: Kalpataru Vian", client: "Priyanka Iyer", phone: "+91 98450 77123", date: "Today, 4:00 PM", status: "Confirmed", location: "Andheri West" },
        { id: "VISIT-102", title: "Site Visit: Purva Estrella", client: "Aarav Sharma", phone: "+91 98205 91823", date: "Tomorrow, 11:30 AM", status: "Scheduled", location: "Lokhandwala" },
        { id: "VISIT-103", title: "Site Visit: Godrej Horizon", client: "Meera Patel", phone: "+91 98921 00987", date: "14 Aug, 2:30 PM", status: "Pending", location: "Wadala" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [qualifiedLeadsData, setQualifiedLeadsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_sql");
      return saved ? JSON.parse(saved) : [
        { id: "LEAD-0007", name: "Rajesh Kumar", score: "94% Hot Match", budget: "₹ 2.15 Cr", bhk: "3 BHK", location: "Andheri West", time: "Today, 11:00 AM", interest: "3BHK High Rise" },
        { id: "LEAD-0033", name: "Kiran Bhat", score: "88% Qualified", budget: "₹ 1.30 Cr", bhk: "2 BHK", location: "Navi Mumbai", time: "Yesterday, 3:30 PM", interest: "2BHK Smart Flat" },
        { id: "LEAD-0013", name: "Deepak Reddy", score: "91% Hot Match", budget: "₹ 3.50 Cr", bhk: "Penthouse", location: "Thane", time: "10 Aug 2026", interest: "Penthouse Sea Facing" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [claimedLeadsData, setClaimedLeadsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_claimed");
      return saved ? JSON.parse(saved) : [
        { id: "LEAD-0049", name: "Kiran Bhat (Thane)", timeAgo: "Today, 10:15 AM", points: "50 Points", source: "Facebook Campaign", status: "Active in Queue" },
        { id: "LEAD-0052", name: "Siddharth Malhotra", timeAgo: "Yesterday, 3:45 PM", points: "50 Points", source: "Google Ads", status: "Site Visit Booked" },
        { id: "LEAD-0055", name: "Ananya Panday", timeAgo: "10 Aug 2026", points: "50 Points", source: "Instagram Ads", status: "Follow-up Pending" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [uniqueLeadsData, setUniqueLeadsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_unique");
      return saved ? JSON.parse(saved) : [
        { id: "LEAD-SELF-01", name: "Vikramaditya Roy", source: "Self Referral / Direct Walk-in", bhk: "4 BHK", phone: "+91 98199 00112", date: "Today, 1:20 PM" },
        { id: "LEAD-SELF-02", name: "Radhika Merchant", source: "Exhibition Stall Inquiry", bhk: "3 BHK", phone: "+91 98200 77665", date: "Yesterday, 5:10 PM" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [siteVisitScheduleData, setSiteVisitScheduleData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_schedules");
      return saved ? JSON.parse(saved) : [
        { id: "SCH-01", client: "Priyanka Iyer", project: "Kalpataru Vian, Andheri", slot: "Today, 4:00 PM - 5:00 PM", cab: "Driver Assigned (MH-02-BZ-4412)", status: "Confirmed" },
        { id: "SCH-02", client: "Meera Patel", project: "Purva Estrella, Lokhandwala", slot: "Tomorrow, 2:00 PM - 3:00 PM", cab: "Cab Self-Drive Requested", status: "Pending Cab" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [meetingScheduleData, setMeetingScheduleData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_meetings");
      return saved ? JSON.parse(saved) : [
        { id: "MTG-01", client: "Rajesh Kumar", venue: "Corporate Sales Office, BKC", agenda: "Final Price Negotiation & Token Booking", time: "Tomorrow, 3:00 PM" },
        { id: "MTG-02", client: "Deepak Reddy", venue: "Thane Site Office", agenda: "Floor Layout Customization Discussion", time: "15 Aug, 11:00 AM" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [videoCallScheduleData, setVideoCallScheduleData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_videocalls");
      return saved ? JSON.parse(saved) : [
        { id: "VID-01", client: "Aarav Sharma", project: "3BHK Bandra Sea View Virtual Tour", platform: "Zoom HD Tour", link: "https://zoom.us/j/9820591823", time: "Today, 6:00 PM" },
        { id: "VID-02", client: "Neha Verma", project: "Purva Estrella Penthouse 3D Tour", platform: "Google Meet Tour", link: "https://meet.google.com/abc-defg-hij", time: "Tomorrow, 4:30 PM" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [threeMinCallsData, setThreeMinCallsData] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_act_3mincalls");
      return saved ? JSON.parse(saved) : [
        { id: "CALL-301", client: "Rajesh Kumar", duration: "04:12 mins", topic: "Detailed Discussion on 3BHK Carpet Area & Payment Schedule", qualityScore: "9.5/10 Pitch Score" },
        { id: "CALL-302", client: "Priyanka Iyer", duration: "03:45 mins", topic: "Site Visit Confirmation & Amenities Overview", qualityScore: "9.0/10 Pitch Score" },
        { id: "CALL-303", client: "Deepak Reddy", duration: "05:20 mins", topic: "Penthouse Sea Facing View & Car Parking Allocation", qualityScore: "9.8/10 Pitch Score" }
      ];
    } catch (e) {
      return [];
    }
  });

  const [uploadedActivityDocs, setUploadedActivityDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_activity_docs");
      return saved ? JSON.parse(saved) : [
        { id: "ACT-DOC-1", name: "August Site Visit Itinerary & Logistics Plan", fileName: "Site_Visit_Itinerary_Aug.pdf", fileType: "PDF", size: "2.1 MB", date: "16 Aug 2026", category: "Client Visit Report" },
        { id: "ACT-DOC-2", name: "Sales Pitch Negotiation Script & Closing Guide", fileName: "Sales_Closing_Script.docx", fileType: "DOC", size: "1.2 MB", date: "14 Aug 2026", category: "Training & Scripts" },
        { id: "ACT-DOC-3", name: "Objection Handling & Price Closing Playbook", fileName: "Objection_Handling_Playbook.pdf", fileType: "PDF", size: "3.4 MB", date: "12 Aug 2026", category: "Training & Scripts" }
      ];
    } catch (e) {
      return [];
    }
  });

  const saveStorage = (key, data, setter) => {
    setter(data);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };

  const handleDocumentUploaded = (newDoc) => {
    const updated = [newDoc, ...uploadedActivityDocs];
    saveStorage("crm_activity_docs", updated, setUploadedActivityDocs);
    if (showToast) showToast(`📁 Document '${newDoc.name}' uploaded successfully!`);
  };

  const handleDownloadDoc = (doc) => {
    if (doc.dataUrl) {
      const link = document.createElement("a");
      link.href = doc.dataUrl;
      link.download = doc.fileName || `${doc.name}.${doc.fileType === "PDF" ? "pdf" : "docx"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (showToast) showToast(`📥 Downloading '${doc.name}'...`);
    } else {
      setSelectedViewDoc(doc);
    }
  };

  const handleStartVisit = (clientName) => {
    setAlertConfig({
      title: "Site Visit Event Started! 🚗",
      message: `Starting GPS Site Visit Navigation & Logging for ${clientName}...`,
      type: "info"
    });
    if (showToast) showToast(`🚗 Site Visit started for ${clientName}!`);
  };

  // Edit record
  const handleEditRecord = (record, type) => {
    setEditingRecord(record);
    setEditingType(type);
  };

  const handleSaveEditedRecord = (updatedRecord) => {
    const itemName = updatedRecord.title || updatedRecord.name || updatedRecord.client || updatedRecord.project || "Record";
    if (editingType === "Visit") {
      const updated = visitsData.map(v => v.id === updatedRecord.id ? updatedRecord : v);
      saveStorage("crm_act_visits", updated, setVisitsData);
    } else if (editingType === "SQL Lead") {
      const updated = qualifiedLeadsData.map(q => q.id === updatedRecord.id ? updatedRecord : q);
      saveStorage("crm_act_sql", updated, setQualifiedLeadsData);
    } else if (editingType === "Claimed Lead") {
      const updated = claimedLeadsData.map(c => c.id === updatedRecord.id ? updatedRecord : c);
      saveStorage("crm_act_claimed", updated, setClaimedLeadsData);
    } else if (editingType === "Unique Lead") {
      const updated = uniqueLeadsData.map(u => u.id === updatedRecord.id ? updatedRecord : u);
      saveStorage("crm_act_unique", updated, setUniqueLeadsData);
    } else if (editingType === "Site Visit Schedule") {
      const updated = siteVisitScheduleData.map(s => s.id === updatedRecord.id ? updatedRecord : s);
      saveStorage("crm_act_schedules", updated, setSiteVisitScheduleData);
    } else if (editingType === "Meeting") {
      const updated = meetingScheduleData.map(m => m.id === updatedRecord.id ? updatedRecord : m);
      saveStorage("crm_act_meetings", updated, setMeetingScheduleData);
    } else if (editingType === "Video Call") {
      const updated = videoCallScheduleData.map(v => v.id === updatedRecord.id ? updatedRecord : v);
      saveStorage("crm_act_videocalls", updated, setVideoCallScheduleData);
    } else if (editingType === "Call Log") {
      const updated = threeMinCallsData.map(c => c.id === updatedRecord.id ? updatedRecord : c);
      saveStorage("crm_act_3mincalls", updated, setThreeMinCallsData);
    } else if (editingType === "Activity Document") {
      const updated = uploadedActivityDocs.map(d => d.id === updatedRecord.id ? updatedRecord : d);
      saveStorage("crm_activity_docs", updated, setUploadedActivityDocs);
    }
    if (showToast) showToast(`✅ '${itemName}' updated successfully!`);
    setEditingRecord(null);
    setEditingType("");
  };

  const confirmDeleteRecord = (item, type, onDeleteCallback) => {
    const itemName = item.title || item.name || item.client || item.project || "this record";
    setDeleteAction(() => () => {
      onDeleteCallback();
      if (showToast) showToast(`🗑️ '${itemName}' deleted successfully!`);
    });
    setAlertConfig({
      title: `Delete ${type}?`,
      message: `Are you sure you want to delete '${itemName}'? This action cannot be undone.`,
      type: "warning",
      showConfirm: true
    });
  };

  const activitiesTabs = [
    "My Visits",
    "Qualified Leads",
    "Leads Claimed",
    "Unique Leads Created",
    "Site Visit Schedule",
    "Meeting Schedule",
    "Video Call Schedule",
    "My Team",
    "Three Minute Calls",
    "Activity Documents"
  ];

  return (
    <div style={{ padding: "0.875rem 0.75rem", paddingBottom: "5rem" }}>
      <DocUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
        categoryTitle="Activity & Schedule Documents"
      />

      {/* In-App Document Viewer Dialog */}
      <DocumentViewerModal
        isOpen={!!selectedViewDoc}
        onClose={() => setSelectedViewDoc(null)}
        doc={selectedViewDoc}
      />

      {/* In-App Universal Edit Record Modal */}
      <EditRecordModal
        isOpen={!!editingRecord}
        onClose={() => { setEditingRecord(null); setEditingType(""); }}
        record={editingRecord}
        recordType={editingType}
        onSave={handleSaveEditedRecord}
      />

      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>⚡ Activity & Schedules</h2>
          <p style={{ fontSize: "0.78125rem", color: "#64748b", margin: "0.1rem 0 0 0" }}>Track client visits, qualified SQLs & schedule reports</p>
        </div>

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
      </div>

      {/* Horizontal Sub Tabs */}
      <div className="sub-tabs-scroll">
        {activitiesTabs.map(tab => (
          <button 
            key={tab}
            className={`sub-tab-chip ${selectedTab === tab ? "active" : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab === "Activity Documents" && "📁 "}
            {tab === "My Visits" && "🚗 "}
            {tab === "Qualified Leads" && "⭐ "}
            {tab === "Leads Claimed" && "🏆 "}
            {tab === "Site Visit Schedule" && "⏰ "}
            {tab === "Meeting Schedule" && "📅 "}
            {tab === "Video Call Schedule" && "🎥 "}
            {tab === "My Team" && "👥 "}
            {tab === "Three Minute Calls" && "⏱️ "}
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic View rendering per selected sub-tab */}
      {selectedTab === "Activity Documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {/* Quick PDF/DOC Upload Banner */}
          <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
            <div>
              <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#1e40af" }}>📁 Activity & Schedule PDF / DOC Reports</div>
              <div style={{ fontSize: "0.71875rem", color: "#3b82f6" }}>Upload, view & share visit summaries, itineraries, scripts & schedule docs (.pdf, .doc, .docx)</div>
            </div>
            <button
              onClick={() => setIsDocModalOpen(true)}
              style={{ background: "#2563eb", color: "#ffffff", border: "none", padding: "0.45rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}
            >
              <FileUp size={14} /> + Upload
            </button>
          </div>

          {uploadedActivityDocs.map((doc, idx) => (
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
                gap: "0.5rem" 
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
                    {doc.category || "Report"} • {doc.size || "1.2 MB"} • {doc.date}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                {/* View Document Button */}
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
                  onClick={() => handleEditRecord(doc, "Activity Document")}
                  style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer" }}
                  title="Edit Document"
                >
                  <Edit3 size={13} />
                </button>

                {/* Delete Button */}
                <button 
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.35rem", borderRadius: "0.375rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} 
                  onClick={() => confirmDeleteRecord(doc, "Activity Document", () => {
                    const updated = uploadedActivityDocs.filter(d => (d.id || d.name) !== (doc.id || doc.name));
                    saveStorage("crm_activity_docs", updated, setUploadedActivityDocs);
                  })}
                  title="Delete Document"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "My Visits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {visitsData.map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: "700", color: "#2563eb", background: "#eff6ff", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  📍 {item.location}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#16a34a" }}>● {item.status}</span>
                  <button onClick={() => handleEditRecord(item, "Visit")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(item, "Visit", () => {
                    const updated = visitsData.filter(v => v.id !== item.id);
                    saveStorage("crm_act_visits", updated, setVisitsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#0f172a", margin: "0.4rem 0 0.2rem 0" }}>{item.title}</h4>
              <p style={{ fontSize: "0.78125rem", color: "#64748b" }}>Client: {item.client} ({item.phone})</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px solid #f1f5f9", fontSize: "0.75rem", color: "#475569" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Calendar size={13} color="#2563eb" /> {item.date}</div>
                <button style={{ background: "#2563eb", color: "#ffffff", border: "none", padding: "0.35rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.6875rem", fontWeight: "700", cursor: "pointer" }} onClick={() => handleStartVisit(item.client)}>
                  Start Visit Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Qualified Leads" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {qualifiedLeadsData.map(lead => (
            <div key={lead.id} style={{ background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#15803d", background: "#dcfce7", padding: "0.15rem 0.55rem", borderRadius: "9999px" }}>
                  ⭐ {lead.score}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.time}</span>
                  <button onClick={() => handleEditRecord(lead, "SQL Lead")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(lead, "SQL Lead", () => {
                    const updated = qualifiedLeadsData.filter(q => q.id !== lead.id);
                    saveStorage("crm_act_sql", updated, setQualifiedLeadsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#0f172a", margin: "0.3rem 0" }}>{lead.name}</h4>
              <div style={{ fontSize: "0.78125rem", color: "#475569" }}>Interested: {lead.interest}</div>
              <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600", marginTop: "0.2rem" }}>Target: {lead.budget} • {lead.location}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Leads Claimed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {claimedLeadsData.map(lead => (
            <div key={lead.id} style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{lead.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.6875rem", background: "#fef3c7", color: "#d97706", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "9999px" }}>
                    🏆 {lead.points}
                  </span>
                  <button onClick={() => handleEditRecord(lead, "Claimed Lead")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(lead, "Claimed Lead", () => {
                    const updated = claimedLeadsData.filter(c => c.id !== lead.id);
                    saveStorage("crm_act_claimed", updated, setClaimedLeadsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#64748b", margin: "0.2rem 0" }}>Source: {lead.source}</div>
              <div style={{ fontSize: "0.71875rem", color: "#94a3b8" }}>Claimed: {lead.timeAgo}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Unique Leads Created" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {uniqueLeadsData.map(lead => (
            <div key={lead.id} style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{lead.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#2563eb", background: "#eff6ff", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                    {lead.bhk}
                  </span>
                  <button onClick={() => handleEditRecord(lead, "Unique Lead")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(lead, "Unique Lead", () => {
                    const updated = uniqueLeadsData.filter(u => u.id !== lead.id);
                    saveStorage("crm_act_unique", updated, setUniqueLeadsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#64748b", marginTop: "0.2rem" }}>Source: {lead.source} • {lead.phone}</div>
              <div style={{ fontSize: "0.71875rem", color: "#94a3b8", marginTop: "0.2rem" }}>Created: {lead.date}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Site Visit Schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {siteVisitScheduleData.map(sch => (
            <div key={sch.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{sch.project}</div>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button onClick={() => handleEditRecord(sch, "Site Visit Schedule")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(sch, "Site Visit Schedule", () => {
                    const updated = siteVisitScheduleData.filter(s => s.id !== sch.id);
                    saveStorage("crm_act_schedules", updated, setSiteVisitScheduleData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#475569", margin: "0.2rem 0" }}>Client: {sch.client}</div>
              <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600" }}>⏰ Slot: {sch.slot}</div>
              <div style={{ fontSize: "0.71875rem", color: "#64748b", marginTop: "0.3rem", background: "#f8fafc", padding: "0.3rem", borderRadius: "0.375rem" }}>
                🚗 Cab Logistics: {sch.cab}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Meeting Schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {meetingScheduleData.map(mtg => (
            <div key={mtg.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>Client: {mtg.client}</div>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <button onClick={() => handleEditRecord(mtg, "Meeting")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(mtg, "Meeting", () => {
                    const updated = meetingScheduleData.filter(m => m.id !== mtg.id);
                    saveStorage("crm_act_meetings", updated, setMeetingScheduleData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#2563eb", fontWeight: "600", margin: "0.2rem 0" }}>📍 Venue: {mtg.venue}</div>
              <div style={{ fontSize: "0.75rem", color: "#475569" }}>Agenda: {mtg.agenda}</div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: "700", marginTop: "0.3rem" }}>⏰ Scheduled: {mtg.time}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Video Call Schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {videoCallScheduleData.map(vid => (
            <div key={vid.id} style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{vid.project}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.6875rem", background: "#dbeafe", color: "#1d4ed8", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                    🎥 {vid.platform}
                  </span>
                  <button onClick={() => handleEditRecord(vid, "Video Call")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(vid, "Video Call", () => {
                    const updated = videoCallScheduleData.filter(v => v.id !== vid.id);
                    saveStorage("crm_act_videocalls", updated, setVideoCallScheduleData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#475569", margin: "0.3rem 0" }}>Client: {vid.client} | {vid.time}</div>
              <button 
                style={{ width: "100%", background: "#2563eb", color: "#ffffff", border: "none", padding: "0.4rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
                onClick={() => window.open(vid.link, '_blank')}
              >
                <Video size={14} /> Join Video Tour Link
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "My Team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "700", marginBottom: "0.5rem" }}>👥 Sales Team Leaderboard</h4>
            {[
              { name: "Rahul Sharma", role: "Telecaller", calls: 48, visits: 6, score: "94%" },
              { name: "Priya Sharma", role: "Sr. Telecaller", calls: 42, visits: 5, score: "91%" },
              { name: "Rajesh Kumar", role: "Mining Specialist", calls: 39, visits: 4, score: "88%" },
              { name: "Amit Patel", role: "Telecaller", calls: 31, visits: 3, score: "84%" }
            ].map((member, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: idx < 4 ? "1px solid #f1f5f9" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", fontWeight: "700", fontSize: "0.8125rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: "700", color: "#0f172a" }}>{member.name}</div>
                    <div style={{ fontSize: "0.71875rem", color: "#64748b" }}>{member.role}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "0.78125rem" }}>
                  <div style={{ fontWeight: "700", color: "#16a34a" }}>{member.visits} Visits</div>
                  <div style={{ color: "#64748b", fontSize: "0.71875rem" }}>{member.calls} Calls ({member.score})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "Three Minute Calls" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {threeMinCallsData.map(call => (
            <div key={call.id} style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{call.client}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#0284c7", background: "#e0f2fe", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                    ⏱️ {call.duration}
                  </span>
                  <button onClick={() => handleEditRecord(call, "Call Log")} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Edit"><Edit3 size={12} /></button>
                  <button onClick={() => confirmDeleteRecord(call, "Call Log", () => {
                    const updated = threeMinCallsData.filter(c => c.id !== call.id);
                    saveStorage("crm_act_3mincalls", updated, setThreeMinCallsData);
                  })} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "0.25rem", borderRadius: "0.35rem", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#475569", margin: "0.3rem 0" }}>Topic: {call.topic}</div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: "700" }}>⭐ {call.qualityScore}</div>
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
