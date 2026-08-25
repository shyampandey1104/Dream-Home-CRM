import React, { useState, useEffect } from "react";
import { 
  Calendar, CheckCircle2, Users, Award, Video, Clock, 
  MapPin, ChevronRight, UserCheck, Star, ShieldCheck, Zap,
  FileCheck, UserPlus, Play, PhoneCall, Filter, ExternalLink,
  FileUp, Download, Trash2, FileText, Eye
} from "lucide-react";
import { fetchCrmActivities } from "../services/apiService";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import CustomAlertDialog from "./CustomAlertDialog";

export default function ActivitiesView() {
  const [selectedTab, setSelectedTab] = useState("My Visits");
  const [liveActivities, setLiveActivities] = useState([]);
  const [backendCategories, setBackendCategories] = useState(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);

  const [uploadedActivityDocs, setUploadedActivityDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("crm_activity_docs");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    fetchCrmActivities().then((res) => {
      if (res) {
        if (res.categories) setBackendCategories(res.categories);
        if (res.data) setLiveActivities(res.data);
      }
    });
  }, []);

  const handleDocumentUploaded = (newDoc) => {
    const updated = [newDoc, ...uploadedActivityDocs];
    setUploadedActivityDocs(updated);
    try {
      localStorage.setItem("crm_activity_docs", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteDoc = (docId) => {
    const updated = uploadedActivityDocs.filter(d => d.id !== docId);
    setUploadedActivityDocs(updated);
    try {
      localStorage.setItem("crm_activity_docs", JSON.stringify(updated));
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

  const handleStartVisit = (clientName) => {
    setAlertConfig({
      title: "Site Visit Event Started! 🚗",
      message: `Starting GPS Site Visit Navigation & Logging for ${clientName}...`,
      type: "info"
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

  // Mock data datasets for each tab
  const visitsData = [
    { id: "VISIT-101", title: "Site Visit: Kalpataru Vian", client: "Priyanka Iyer", phone: "+91 98450 77123", date: "Today, 4:00 PM", status: "Confirmed", location: "Andheri West" },
    { id: "VISIT-102", title: "Site Visit: Purva Estrella", client: "Aarav Sharma", phone: "+91 98205 91823", date: "Tomorrow, 11:30 AM", status: "Scheduled", location: "Lokhandwala" },
    { id: "VISIT-103", title: "Site Visit: Godrej Horizon", client: "Meera Patel", phone: "+91 98921 00987", date: "14 Aug, 2:30 PM", status: "Pending", location: "Wadala" }
  ];

  const qualifiedLeadsData = [
    { id: "LEAD-0007", name: "Rajesh Kumar", score: "94% Hot Match", budget: "₹ 2.15 Cr", bhk: "3 BHK", location: "Andheri West", manager: "Assigned to Ibrahim" },
    { id: "LEAD-0033", name: "Kiran Bhat", score: "88% Qualified", budget: "₹ 1.30 Cr", bhk: "2 BHK", location: "Navi Mumbai", manager: "Pending Manager Review" },
    { id: "LEAD-0013", name: "Deepak Reddy", score: "91% Hot Match", budget: "₹ 3.50 Cr", bhk: "Penthouse", location: "Thane", manager: "Assigned to Ibrahim" }
  ];

  const claimedLeadsData = [
    { id: "LEAD-0049", name: "Kiran Bhat (Thane)", claimedAt: "Today, 10:15 AM", rewardPointsUsed: "50 Points", status: "Active in Queue" },
    { id: "LEAD-0052", name: "Siddharth Malhotra", claimedAt: "Yesterday, 3:45 PM", rewardPointsUsed: "50 Points", status: "Site Visit Booked" },
    { id: "LEAD-0055", name: "Ananya Panday", claimedAt: "10 Aug 2026", rewardPointsUsed: "50 Points", status: "Follow-up Pending" }
  ];

  const uniqueLeadsData = [
    { id: "LEAD-SELF-01", name: "Vikramaditya Roy", source: "Self Referral / Direct Walk-in", bhk: "4 BHK", phone: "+91 98199 00112", date: "Today, 1:20 PM" },
    { id: "LEAD-SELF-02", name: "Radhika Merchant", source: "Exhibition Stall Inquiry", bhk: "3 BHK", phone: "+91 98200 77665", date: "Yesterday, 5:10 PM" }
  ];

  const siteVisitScheduleData = [
    { id: "SCH-01", client: "Priyanka Iyer", project: "Kalpataru Vian, Andheri", slot: "Today, 4:00 PM - 5:00 PM", cab: "Driver Assigned (MH-02-BZ-4412)", status: "Confirmed" },
    { id: "SCH-02", client: "Meera Patel", project: "Purva Estrella, Lokhandwala", slot: "Tomorrow, 2:00 PM - 3:00 PM", cab: "Cab Self-Drive Requested", status: "Pending Cab" }
  ];

  const meetingScheduleData = [
    { id: "MTG-01", client: "Rajesh Kumar", venue: "Corporate Sales Office, BKC", agenda: "Final Price Negotiation & Token Booking", time: "Tomorrow, 3:00 PM" },
    { id: "MTG-02", client: "Deepak Reddy", venue: "Thane Site Office", agenda: "Floor Layout Customization Discussion", time: "15 Aug, 11:00 AM" }
  ];

  const videoCallScheduleData = [
    { id: "VID-01", client: "Aarav Sharma", project: "3BHK Bandra Sea View Virtual Tour", platform: "Zoom HD Tour", link: "https://zoom.us/j/9820591823", time: "Today, 6:00 PM" },
    { id: "VID-02", client: "Neha Verma", project: "Purva Estrella Penthouse 3D Tour", platform: "Google Meet Tour", link: "https://meet.google.com/abc-defg-hij", time: "Tomorrow, 4:30 PM" }
  ];

  const threeMinCallsData = [
    { id: "CALL-301", client: "Rajesh Kumar", duration: "04:12 mins", topic: "Detailed Discussion on 3BHK Carpet Area & Payment Schedule", qualityScore: "9.5/10 Pitch Score" },
    { id: "CALL-302", client: "Priyanka Iyer", duration: "03:45 mins", topic: "Site Visit Confirmation & Amenities Overview", qualityScore: "9.0/10 Pitch Score" },
    { id: "CALL-303", client: "Deepak Reddy", duration: "05:20 mins", topic: "Penthouse Sea Facing View & Car Parking Allocation", qualityScore: "9.8/10 Pitch Score" }
  ];

  const allActivityDocs = [
    ...uploadedActivityDocs,
    { id: "ACT-DOC-1", name: "August Site Visit Itinerary & Logistics Plan", fileName: "Site_Visit_Itinerary_Aug.pdf", fileType: "PDF", size: "2.1 MB", date: "16 Aug 2026", category: "Client Visit Report" },
    { id: "ACT-DOC-2", name: "Sales Pitch Negotiation Script & Closing Guide", fileName: "Sales_Closing_Script.docx", fileType: "DOC", size: "1.2 MB", date: "14 Aug 2026", category: "Training & Scripts" },
    { id: "ACT-DOC-3", name: "Objection Handling & Price Closing Playbook", fileName: "Objection_Handling_Playbook.pdf", fileType: "PDF", size: "3.4 MB", date: "12 Aug 2026", category: "Training & Scripts" },
    { id: "ACT-DOC-4", name: "Mumbai Micro-Market Price Growth Report 2026", fileName: "Market_Growth_Report_2026.pdf", fileType: "PDF", size: "4.8 MB", date: "10 Aug 2026", category: "Market Report" },
    { id: "ACT-DOC-5", name: "Quarterly Telecaller Incentive & Bonus Policy", fileName: "Incentive_Bonus_Policy.docx", fileType: "DOC", size: "1.5 MB", date: "08 Aug 2026", category: "Policy Doc" }
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

          {allActivityDocs.map((doc, idx) => (
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

                {/* Delete Button */}
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
      )}

      {selectedTab === "My Visits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(backendCategories?.myVisits || visitsData).map(item => (
            <div key={item.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: "700", color: "#2563eb", background: "#eff6ff", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  📍 {item.location}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#16a34a" }}>● {item.status}</span>
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
          {(backendCategories?.qualifiedLeads || qualifiedLeadsData).map(lead => (
            <div key={lead.id} style={{ background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#15803d", background: "#dcfce7", padding: "0.15rem 0.55rem", borderRadius: "9999px" }}>
                  ⭐ {lead.score}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.time}</span>
              </div>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#0f172a", margin: "0.3rem 0" }}>{lead.name}</h4>
              <div style={{ fontSize: "0.78125rem", color: "#475569" }}>Interested: {lead.interest}</div>
              <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600", marginTop: "0.2rem" }}>Target: {lead.budget}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Leads Claimed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(backendCategories?.claimedLeads || claimedLeadsData).map(lead => (
            <div key={lead.id} style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{lead.name}</div>
                <span style={{ fontSize: "0.6875rem", background: "#fef3c7", color: "#d97706", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "9999px" }}>
                  🏆 {lead.points}
                </span>
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
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#2563eb", background: "#eff6ff", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  {lead.bhk}
                </span>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#64748b", marginTop: "0.2rem" }}>Source: {lead.source} • {lead.phone}</div>
              <div style={{ fontSize: "0.71875rem", color: "#94a3b8", marginTop: "0.2rem" }}>Created: {lead.date}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Site Visit Schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(backendCategories?.siteVisits || siteVisitScheduleData).map(sch => (
            <div key={sch.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{sch.project}</div>
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
          {(backendCategories?.meetings || meetingScheduleData).map(mtg => (
            <div key={mtg.id} style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>Client: {mtg.client}</div>
              <div style={{ fontSize: "0.78125rem", color: "#2563eb", fontWeight: "600", margin: "0.2rem 0" }}>📍 Venue: {mtg.venue}</div>
              <div style={{ fontSize: "0.75rem", color: "#475569" }}>Agenda: {mtg.agenda}</div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: "700", marginTop: "0.3rem" }}>⏰ Scheduled: {mtg.time}</div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "Video Call Schedule" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(backendCategories?.videoCalls || videoCallScheduleData).map(vid => (
            <div key={vid.id} style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: "0.75rem", padding: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{vid.project}</span>
                <span style={{ fontSize: "0.6875rem", background: "#dbeafe", color: "#1d4ed8", fontWeight: "700", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  🎥 {vid.platform}
                </span>
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
            {(backendCategories?.teamMembers || [
              { name: "Rahul Sharma", role: "Telecaller", calls: 48, visits: 6, score: "94%" },
              { name: "Priya Sharma", role: "Sr. Telecaller", calls: 42, visits: 5, score: "91%" },
              { name: "Rajesh Kumar", role: "Mining Specialist", calls: 39, visits: 4, score: "88%" },
              { name: "Amit Patel", role: "Telecaller", calls: 31, visits: 3, score: "84%" }
            ]).map((member, idx) => (
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
          {(backendCategories?.threeMinCalls || threeMinCallsData).map(call => (
            <div key={call.id} style={{ background: "#ffffff", padding: "0.875rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a" }}>{call.client}</div>
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#0284c7", background: "#e0f2fe", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  ⏱️ {call.duration}
                </span>
              </div>
              <div style={{ fontSize: "0.78125rem", color: "#475569", margin: "0.3rem 0" }}>Topic: {call.topic}</div>
              <div style={{ fontSize: "0.71875rem", color: "#16a34a", fontWeight: "700" }}>⭐ {call.qualityScore}</div>
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
