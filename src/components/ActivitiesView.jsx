import React, { useState, useEffect } from "react";
import { 
  Calendar, CheckCircle2, Users, Award, Video, Clock, 
  MapPin, ChevronRight, UserCheck, Star, ShieldCheck, Zap,
  FileCheck, UserPlus, Play, Phone, PhoneCall, Filter, ExternalLink,
  FileUp, Download, Trash2, FileText, Eye, Edit3, Search, Plus, Sparkles,
  MessageSquare, FileDown, X, Navigation, Car
} from "lucide-react";
import { 
  fetchSiteVisitsApi, saveSiteVisitApi, deleteSiteVisitApi,
  fetchQualifiedLeadsApi, saveQualifiedLeadApi, deleteQualifiedLeadApi,
  fetchClaimedLeadsApi, saveClaimedLeadApi, deleteClaimedLeadApi,
  fetchUniqueLeadsApi, saveUniqueLeadApi, deleteUniqueLeadApi,
  fetchSiteVisitSchedulesApi, saveSiteVisitScheduleApi, deleteSiteVisitScheduleApi,
  fetchMeetingSchedulesApi, saveMeetingScheduleApi, deleteMeetingScheduleApi,
  fetchVideoCallSchedulesApi, saveVideoCallScheduleApi, deleteVideoCallScheduleApi,
  fetchTeamMembersApi, saveTeamMemberApi, deleteTeamMemberApi,
  fetchSpeedCallsApi, saveSpeedCallApi, deleteSpeedCallApi,
  fetchActivityDocumentsApi, saveActivityDocumentApi, deleteActivityDocumentApi
} from "../services/apiService";
import DocUploadModal from "./DocUploadModal";
import DocumentViewerModal from "./DocumentViewerModal";
import EditRecordModal from "./EditRecordModal";
import CustomAlertDialog from "./CustomAlertDialog";
import { getLeadAvatar } from "../utils/avatarHelper";
import { exportLeadsToExcel } from "../utils/excelExport";

export default function ActivitiesView({ showToast, onCallLead }) {
  // Navigation: "visits", "schedules", "pipeline", "team", "documents"
  const [activeTabNav, setActiveTabNav] = useState("visits");
  
  // Dynamic filter pills per tab
  const [visitFilter, setVisitFilter] = useState("ALL"); // ALL, TODAY, CHAUFFEUR, SCHEDULES
  const [scheduleFilter, setScheduleFilter] = useState("ALL"); // ALL, MEETINGS, VIDEOCALLS
  const [pipelineFilter, setPipelineFilter] = useState("ALL"); // ALL, SQL, CLAIMED, UNIQUE
  const [teamFilter, setTeamFilter] = useState("ALL"); // ALL, LEADERBOARD, CALLS
  const [docFilter, setDocFilter] = useState("ALL"); // ALL, PDF, ITINERARY, FLOORPLAN
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedViewDoc, setSelectedViewDoc] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingType, setEditingType] = useState("");
  const [alertConfig, setAlertConfig] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

  // Slide-Up Bottom Drawer for Activity Item Details
  const [selectedActivityDrawer, setSelectedActivityDrawer] = useState(null);

  // Quick Add Item Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newExtra, setNewExtra] = useState("");

  // Showcase Default Fallback Records (matching Screen 6 of Master Collage)
  const SHOWCASE_VISITS = [
    { id: "SV-101", title: "Kalpataru Vian 2BHK Walkthrough", client: "Priyanka Iyer", phone: "9819944321", location: "Andheri West", date: "Today, 4:00 PM", status: "Confirmed", cab: "Innova Crysta (MH02-CK-8821)" },
    { id: "SV-102", title: "Srishti Oasis 3BHK Podium Unit", client: "Vikram Singhania", phone: "9820011223", location: "Bhandup West", date: "Tomorrow, 11:30 AM", status: "Chauffeur Dispatched", cab: "Maruti Ertiga (MH03-DE-1044)" },
    { id: "SV-103", title: "Oberoi Sky City Penthouse Visit", client: "Pravin Ladkat", phone: "9833445566", location: "Borivali East", date: "Today, 11:45 AM", status: "Verified & KYC Done", cab: "Self Driven" }
  ];

  const SHOWCASE_SV_SCHEDULES = [
    { id: "SCH-01", client: "Priyanka Iyer", project: "Kalpataru Vian", slot: "Today, 4:00 PM", cab: "Innova Crysta (MH02-CK-8821)", status: "Confirmed", phone: "9819944321" },
    { id: "SCH-02", client: "Vikram Singhania", project: "Srishti Oasis", slot: "Tomorrow, 11:30 AM", cab: "Maruti Ertiga Dispatched", status: "Dispatched", phone: "9820011223" },
    { id: "SCH-03", client: "Siddharth Malhotra", project: "Lodha Woods", slot: "Saturday, 11:00 AM", cab: "Customer Requesting Chauffeur", status: "Scheduled", phone: "9820556677" }
  ];

  const SHOWCASE_MEETINGS = [
    { id: "MTG-01", client: "Rajesh Kumar", venue: "BKC Sales Office Lounge", agenda: "Token Booking & KYC Sign", time: "Tomorrow, 2:00 PM", status: "VIP Priority", phone: "9820112233" },
    { id: "MTG-02", client: "Suresh Singh", venue: "Andheri Sales Office", agenda: "Agreement Registration & Home Loan", time: "Friday, 5:00 PM", status: "Scheduled", phone: "9820223344" },
    { id: "MTG-03", client: "Pooja Verma", venue: "Zoom Video Conference", agenda: "3BHK Cost Sheet Discussion", time: "Monday, 4:30 PM", status: "Confirmed", phone: "9820334455" }
  ];

  const SHOWCASE_VIDEO_CALLS = [
    { id: "VC-01", client: "Aarav Sharma", project: "Purva 3D Virtual Tour", platform: "Zoom HD Conference", link: "https://zoom.us/j/9867778229", time: "Today, 6:00 PM", status: "Link Sent", phone: "9867778229" },
    { id: "VC-02", client: "Meera Nair", project: "Lodha Woods 3D Walkthrough", platform: "Google Meet", link: "https://meet.google.com/xyz-abc", time: "Tomorrow, 3:00 PM", status: "Confirmed", phone: "9820445566" }
  ];

  const SHOWCASE_Q_LEADS = [
    { id: "QL-01", name: "Pooja Hegde", name_client: "Pooja Hegde", interest: "2 BHK Luxury", budget: "₹ 1.59 Cr", location: "GMLR Bhandup", score: "98% Hot Match", phone: "9820998877" },
    { id: "QL-02", name: "Siddharth Malhotra", name_client: "Siddharth Malhotra", interest: "3 BHK High Floor", budget: "₹ 2.45 Cr", location: "Andheri West", score: "94% Hot Match", phone: "9820556677" },
    { id: "QL-03", name: "Karan Joshi", name_client: "Karan Joshi", interest: "4 BHK Penthouse", budget: "₹ 6.20 Cr", location: "Worli Sea Face", score: "92% Hot Match", phone: "9820887766" }
  ];

  const SHOWCASE_TEAM = [
    { name: "Shyam Pandey", name_member: "Shyam Pandey", role: "Senior Sales Consultant", calls: "54 Calls Logged", status: "🟢 Present", visits_count: 4, calls_count: 54, score: "96%", phone: "9867778229" },
    { name: "Priya Sharma", name_member: "Priya Sharma", role: "Sales Manager", calls: "48 Calls Logged", status: "🟢 Present", visits_count: 3, calls_count: 48, score: "92%", phone: "9820123456" },
    { name: "Rajesh Kumar", name_member: "Rajesh Kumar", role: "Senior Telecaller", calls: "62 Calls Logged", status: "🟢 Present", visits_count: 2, calls_count: 62, score: "94%", phone: "9820234567" },
    { name: "Sunil Kapoor", name_member: "Sunil Kapoor", role: "Field Sales Agent", calls: "35 Calls Logged", status: "🟢 Present", visits_count: 5, calls_count: 35, score: "89%", phone: "9820345678" }
  ];

  const SHOWCASE_DOCS = [
    { id: "DOC-01", name: "Kalpataru_Vian_Brochure_2026.pdf", name_doc: "Kalpataru_Vian_Brochure_2026.pdf", category: "Brochure", file_size: "4.2 MB", file_type: "PDF" },
    { id: "DOC-02", name: "Srishti_Oasis_Floorplans_RERA.pdf", name_doc: "Srishti_Oasis_Floorplans_RERA.pdf", category: "Floorplan", file_size: "6.8 MB", file_type: "PDF" },
    { id: "DOC-03", name: "Client_Site_Visit_Itinerary_Template.docx", name_doc: "Client_Site_Visit_Itinerary_Template.docx", category: "Itinerary", file_size: "1.1 MB", file_type: "DOC" }
  ];

  // States for each category initialized with showcase records
  const [visitsData, setVisitsData] = useState(SHOWCASE_VISITS);
  const [qualifiedLeadsData, setQualifiedLeadsData] = useState(SHOWCASE_Q_LEADS);
  const [claimedLeadsData, setClaimedLeadsData] = useState([]);
  const [uniqueLeadsData, setUniqueLeadsData] = useState([]);
  const [siteVisitScheduleData, setSiteVisitScheduleData] = useState(SHOWCASE_SV_SCHEDULES);
  const [meetingScheduleData, setMeetingScheduleData] = useState(SHOWCASE_MEETINGS);
  const [videoCallScheduleData, setVideoCallScheduleData] = useState(SHOWCASE_VIDEO_CALLS);
  const [teamMembersData, setTeamMembersData] = useState(SHOWCASE_TEAM);
  const [threeMinCallsData, setThreeMinCallsData] = useState([]);
  const [uploadedActivityDocs, setUploadedActivityDocs] = useState(SHOWCASE_DOCS);

  // Load from backend on mount
  useEffect(() => {
    loadAllActivitiesData();
  }, []);

  const loadAllActivitiesData = async () => {
    try {
      const [
        visits, qLeads, cLeads, uLeads, 
        svSchedules, meetings, vCalls, 
        team, speedCalls, actDocs
      ] = await Promise.all([
        fetchSiteVisitsApi(),
        fetchQualifiedLeadsApi(),
        fetchClaimedLeadsApi(),
        fetchUniqueLeadsApi(),
        fetchSiteVisitSchedulesApi(),
        fetchMeetingSchedulesApi(),
        fetchVideoCallSchedulesApi(),
        fetchTeamMembersApi(),
        fetchSpeedCallsApi(),
        fetchActivityDocumentsApi()
      ]);

      if (Array.isArray(visits) && visits.length > 0) setVisitsData(visits);
      if (Array.isArray(qLeads) && qLeads.length > 0) setQualifiedLeadsData(qLeads);
      if (Array.isArray(cLeads) && cLeads.length > 0) setClaimedLeadsData(cLeads);
      if (Array.isArray(uLeads) && uLeads.length > 0) setUniqueLeadsData(uLeads);
      if (Array.isArray(svSchedules) && svSchedules.length > 0) setSiteVisitScheduleData(svSchedules);
      if (Array.isArray(meetings) && meetings.length > 0) setMeetingScheduleData(meetings);
      if (Array.isArray(vCalls) && vCalls.length > 0) setVideoCallScheduleData(vCalls);
      if (Array.isArray(team) && team.length > 0) setTeamMembersData(team);
      if (Array.isArray(speedCalls) && speedCalls.length > 0) setThreeMinCallsData(speedCalls);
      if (Array.isArray(actDocs) && actDocs.length > 0) setUploadedActivityDocs(actDocs);
    } catch (e) {
      console.log("[ActivitiesView Data Load Error]", e);
    }
  };

  const handleDocumentUploaded = async (newDoc) => {
    const updated = [newDoc, ...uploadedActivityDocs];
    setUploadedActivityDocs(updated);
    try {
      await saveActivityDocumentApi({
        name_doc: newDoc.name || newDoc.document_name,
        category: newDoc.category,
        file_type: newDoc.fileType || newDoc.file_type || "PDF",
        file_size: newDoc.size || newDoc.file_size || "1.5 MB",
        upload_date: newDoc.date || newDoc.upload_date,
        file_url: newDoc.file_url || newDoc.dataUrl,
        data_url: newDoc.dataUrl
      });
    } catch (e) {}
    if (showToast) showToast(`📁 Document '${newDoc.name}' saved to CRM Database!`);
  };

  const handleStartVisit = (clientName) => {
    setAlertConfig({
      title: "Site Visit Started! 🚗",
      message: `GPS navigation & attendance tracking initiated for ${clientName}. Client has been notified via WhatsApp.`,
      type: "info"
    });
    if (showToast) showToast(`🚗 Site Visit started for ${clientName}!`);
  };

  const handleDirectCall = (person) => {
    const phone = person.phone || "9867778229";
    const name = person.client || person.name_client || person.name_lead || person.name || "Client";
    if (onCallLead) {
      onCallLead({
        id: person.id || person.name || "ACT-CALL",
        name: name,
        phone: phone,
        property: person.title || person.project || "Dream Homes Project",
        location: person.location || person.venue || "Mumbai",
        bhk: person.bhk || person.interest || "3 BHK"
      });
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsAppMessage = (item, type = "visit") => {
    const client = item.client || item.name_client || item.name_lead || item.lead_name || "Client";
    const phone = (item.phone || "9867778229").replace(/\D/g, "");
    let text = "";
    if (type === "visit") {
      text = encodeURIComponent(`Hi ${client}, your VIP chauffeur is assigned for the visit to ${item.title || item.project || 'Project'} on ${item.date || item.slot || 'Today'}. Vehicle: ${item.cab || 'Innova Crysta'}. Chauffeur will report 15 mins prior.`);
    } else if (type === "meeting") {
      text = encodeURIComponent(`Hi ${client}, your meeting for ${item.agenda || 'Discussion'} is confirmed at ${item.venue || 'BKC Lounge'} for ${item.time || 'Scheduled Slot'}. Looking forward to hosting you!`);
    } else if (type === "video") {
      text = encodeURIComponent(`Hi ${client}, your 3D Virtual Tour for ${item.project || 'Luxury Residence'} is scheduled for ${item.time || 'Today'}. Join Link: ${item.link || 'https://zoom.us'}.`);
    } else {
      text = encodeURIComponent(`Hi ${client}, greeting from Dream Homes Real Estate. Following up on your requirement for ${item.interest || item.bhk || 'luxury residences'}. When would be a good time to connect?`);
    }
    window.open(`https://wa.me/91${phone}?text=${text}`, "_blank");
    if (showToast) showToast(`💬 WhatsApp message opened for ${client}!`);
  };

  // Quick Add Item Handler
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newClient && !newTitle) {
      setAlertConfig({ title: "Required", message: "Please fill in client / item name", type: "warning" });
      return;
    }

    if (activeTabNav === "visits") {
      const payload = {
        title: newTitle || `Site Visit: ${newLocation || "Mumbai"}`,
        client: newClient,
        phone: newPhone || "9820011223",
        location: newLocation || "Andheri West",
        date: newExtra || "Today, 4:00 PM",
        status: "Confirmed",
        cab: "Innova Crysta (MH02-CK-8821)"
      };
      const res = await saveSiteVisitApi(payload);
      setVisitsData(prev => [{ name: res?.visit_id, ...payload }, ...prev]);
    } else if (activeTabNav === "schedules") {
      if (scheduleFilter === "VIDEOCALLS") {
        const payload = {
          client: newClient,
          project: newTitle || "3D Virtual Tour",
          platform: "Zoom HD Tour",
          link: newExtra || "https://zoom.us/j/9820591823",
          time: "Today, 6:00 PM",
          status: "Scheduled",
          phone: newPhone || "9820011223"
        };
        const res = await saveVideoCallScheduleApi(payload);
        setVideoCallScheduleData(prev => [{ name: res?.vcs_id, ...payload }, ...prev]);
      } else {
        const payload = {
          client: newClient,
          venue: newLocation || "BKC Sales Office",
          agenda: newTitle || "Price & Booking Discussion",
          time: newExtra || "Tomorrow, 4:00 PM",
          status: "Scheduled",
          phone: newPhone || "9820011223"
        };
        const res = await saveMeetingScheduleApi(payload);
        setMeetingScheduleData(prev => [{ name: res?.mtg_id, ...payload }, ...prev]);
      }
    } else if (activeTabNav === "pipeline") {
      const payload = {
        name_client: newClient || newTitle,
        score: "94% Hot Match",
        budget: newExtra || "₹ 2.50 Cr",
        bhk: "3 BHK",
        location: newLocation || "Andheri West",
        interest: newTitle || "Luxury Apartment",
        phone: newPhone || "9820011223"
      };
      const res = await saveQualifiedLeadApi(payload);
      setQualifiedLeadsData(prev => [{ name: res?.ql_id, ...payload }, ...prev]);
    } else if (activeTabNav === "team") {
      const payload = {
        client: newClient,
        duration: "03:45 mins",
        topic: newTitle || "Amenities & Cost Sheet Discussion",
        qualityScore: "9.5/10 Pitch Score"
      };
      const res = await saveSpeedCallApi(payload);
      setThreeMinCallsData(prev => [{ name: res?.call_id, ...payload }, ...prev]);
    }

    setIsQuickAddOpen(false);
    setNewTitle("");
    setNewClient("");
    setNewPhone("");
    setNewLocation("");
    setNewExtra("");
    if (showToast) showToast(`✅ Record saved to CRM Database!`);
  };

  // Edit record
  const handleEditRecord = (record, type) => {
    setEditingRecord(record);
    setEditingType(type);
  };

  const handleSaveEditedRecord = async (updatedRecord) => {
    const itemName = updatedRecord.title || updatedRecord.name || updatedRecord.name_client || updatedRecord.name_lead || updatedRecord.lead_name || updatedRecord.client || updatedRecord.project || updatedRecord.name_member || "Record";
    
    if (editingType === "Visit") {
      setVisitsData(prev => prev.map(v => (v.name === updatedRecord.name || v.id === updatedRecord.id) ? updatedRecord : v));
      await saveSiteVisitApi({
        visit_id: updatedRecord.name || updatedRecord.id,
        title: updatedRecord.title,
        client: updatedRecord.client,
        phone: updatedRecord.phone,
        location: updatedRecord.location,
        status: updatedRecord.status
      });
    } else if (editingType === "SQL Lead") {
      setQualifiedLeadsData(prev => prev.map(q => (q.name === updatedRecord.name || q.id === updatedRecord.id) ? updatedRecord : q));
      await saveQualifiedLeadApi({
        lead_id: updatedRecord.name || updatedRecord.id,
        name_client: updatedRecord.name_client || updatedRecord.name,
        score: updatedRecord.score,
        budget: updatedRecord.budget,
        bhk: updatedRecord.bhk,
        location: updatedRecord.location,
        interest: updatedRecord.interest
      });
    } else if (editingType === "Claimed Lead") {
      setClaimedLeadsData(prev => prev.map(c => (c.name === updatedRecord.name || c.id === updatedRecord.id) ? updatedRecord : c));
      await saveClaimedLeadApi({
        claim_id: updatedRecord.name || updatedRecord.id,
        lead_name: updatedRecord.lead_name || updatedRecord.name,
        points: updatedRecord.points,
        source: updatedRecord.source,
        status: updatedRecord.status
      });
    } else if (editingType === "Unique Lead") {
      setUniqueLeadsData(prev => prev.map(u => (u.name === updatedRecord.name || u.id === updatedRecord.id) ? updatedRecord : u));
      await saveUniqueLeadApi({
        lead_id: updatedRecord.name || updatedRecord.id,
        name_lead: updatedRecord.name_lead || updatedRecord.name,
        source: updatedRecord.source,
        phone: updatedRecord.phone,
        bhk: updatedRecord.bhk
      });
    } else if (editingType === "Site Visit Schedule") {
      setSiteVisitScheduleData(prev => prev.map(s => (s.name === updatedRecord.name || s.id === updatedRecord.id) ? updatedRecord : s));
      await saveSiteVisitScheduleApi({
        sch_id: updatedRecord.name || updatedRecord.id,
        client: updatedRecord.client,
        project: updatedRecord.project,
        slot: updatedRecord.slot,
        cab: updatedRecord.cab,
        status: updatedRecord.status
      });
    } else if (editingType === "Meeting") {
      setMeetingScheduleData(prev => prev.map(m => (m.name === updatedRecord.name || m.id === updatedRecord.id) ? updatedRecord : m));
      await saveMeetingScheduleApi({
        mtg_id: updatedRecord.name || updatedRecord.id,
        client: updatedRecord.client,
        venue: updatedRecord.venue,
        agenda: updatedRecord.agenda,
        time: updatedRecord.time,
        status: updatedRecord.status
      });
    } else if (editingType === "Video Call") {
      setVideoCallScheduleData(prev => prev.map(v => (v.name === updatedRecord.name || v.id === updatedRecord.id) ? updatedRecord : v));
      await saveVideoCallScheduleApi({
        vcs_id: updatedRecord.name || updatedRecord.id,
        client: updatedRecord.client,
        project: updatedRecord.project,
        platform: updatedRecord.platform,
        link: updatedRecord.link,
        time: updatedRecord.time,
        status: updatedRecord.status
      });
    } else if (editingType === "Call Log") {
      setThreeMinCallsData(prev => prev.map(c => (c.name === updatedRecord.name || c.id === updatedRecord.id) ? updatedRecord : c));
      await saveSpeedCallApi({
        call_id: updatedRecord.name || updatedRecord.id,
        client: updatedRecord.client,
        duration: updatedRecord.duration,
        topic: updatedRecord.topic,
        quality_score: updatedRecord.quality_score || updatedRecord.qualityScore
      });
    } else if (editingType === "Activity Document") {
      setUploadedActivityDocs(prev => prev.map(d => (d.name === updatedRecord.name || d.id === updatedRecord.id) ? updatedRecord : d));
      await saveActivityDocumentApi({
        doc_id: updatedRecord.name || updatedRecord.id,
        name_doc: updatedRecord.name_doc || updatedRecord.name,
        category: updatedRecord.category,
        file_size: updatedRecord.file_size || updatedRecord.size,
        file_url: updatedRecord.file_url || updatedRecord.dataUrl
      });
    }

    if (showToast) showToast(`✅ '${itemName}' updated in CRM Database!`);
    setEditingRecord(null);
    setEditingType("");
  };

  const confirmDeleteRecord = (item, type, onDeleteCallback) => {
    const itemName = item.title || item.name || item.name_client || item.name_lead || item.lead_name || item.client || item.project || item.name_member || "this record";
    setDeleteAction(() => async () => {
      if (onDeleteCallback) onDeleteCallback();

      try {
        const id = item.name || item.id;
        if (type === "Visit") await deleteSiteVisitApi(id);
        else if (type === "SQL Lead") await deleteQualifiedLeadApi(id);
        else if (type === "Claimed Lead") await deleteClaimedLeadApi(id);
        else if (type === "Unique Lead") await deleteUniqueLeadApi(id);
        else if (type === "Site Visit Schedule") await deleteSiteVisitScheduleApi(id);
        else if (type === "Meeting") await deleteMeetingScheduleApi(id);
        else if (type === "Video Call") await deleteVideoCallScheduleApi(id);
        else if (type === "Team Member") await deleteTeamMemberApi(id);
        else if (type === "Call Log") await deleteSpeedCallApi(id);
        else if (type === "Activity Document") await deleteActivityDocumentApi(id);
      } catch (e) {
        console.error(e);
      }

      if (showToast) showToast(`🗑️ Deleted '${itemName}' successfully!`);
      setAlertConfig(null);
      setDeleteAction(null);
    });

    setAlertConfig({
      title: "Delete Record?",
      message: `Are you sure you want to permanently remove '${itemName}'? This action cannot be undone.`,
      type: "danger"
    });
  };

  // Search Filter Helper
  const filterList = (items, keys) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item => keys.some(k => item[k] && String(item[k]).toLowerCase().includes(q)));
  };

  const filteredVisits = filterList(visitsData, ["title", "client", "phone", "location", "status", "cab"]);
  const filteredQLeads = filterList(qualifiedLeadsData, ["name", "name_client", "score", "budget", "bhk", "location", "interest", "phone"]);
  const filteredCLeads = filterList(claimedLeadsData, ["name", "lead_name", "points", "source", "status", "claimed_by"]);
  const filteredULeads = filterList(uniqueLeadsData, ["name", "name_lead", "source", "phone", "bhk"]);
  const filteredSVSchedules = filterList(siteVisitScheduleData, ["project", "client", "slot", "cab", "status", "phone"]);
  const filteredMeetings = filterList(meetingScheduleData, ["client", "venue", "agenda", "time", "status", "phone"]);
  const filteredVCalls = filterList(videoCallScheduleData, ["client", "project", "platform", "time", "status", "link", "phone"]);
  const filteredTeam = filterList(teamMembersData, ["name_member", "name", "role", "email", "phone"]);
  const filtered3MinCalls = filterList(threeMinCallsData, ["client", "duration", "topic", "qualityScore", "quality_score"]);
  const filteredActDocs = filterList(uploadedActivityDocs, ["name", "name_doc", "category", "fileType", "file_type"]);

  // Export current active view to Excel
  const handleExportActiveView = () => {
    let exportItems = [];
    let reportTitle = "Activities_Report";
    if (activeTabNav === "visits") {
      exportItems = [...filteredVisits, ...filteredSVSchedules];
      reportTitle = "Site_Visits_Report";
    } else if (activeTabNav === "schedules") {
      exportItems = [...filteredMeetings, ...filteredVCalls];
      reportTitle = "Meetings_Schedules_Report";
    } else if (activeTabNav === "pipeline") {
      exportItems = [...filteredQLeads, ...filteredCLeads, ...filteredULeads];
      reportTitle = "Pipeline_Leads_Report";
    } else if (activeTabNav === "team") {
      exportItems = filteredTeam;
      reportTitle = "Team_Leaderboard_Report";
    } else {
      exportItems = filteredActDocs;
      reportTitle = "Activity_Documents_Report";
    }
    exportLeadsToExcel(exportItems, reportTitle);
    if (showToast) showToast(`📥 Exported ${exportItems.length} records to Excel!`);
  };

  return (
    <div style={{ padding: "0.5rem 0.625rem", paddingBottom: "5.5rem" }}>
      {/* Document Upload Modal */}
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

      {/* Confirmation & Alert Dialog */}
      {alertConfig && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
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
            maxWidth: "360px",
            padding: "1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {alertConfig.type === "danger" ? "🗑️" : alertConfig.type === "warning" ? "⚠️" : "🚗"}
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              {alertConfig.title}
            </h3>
            <p style={{ fontSize: "0.84375rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.4 }}>
              {alertConfig.message}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => { setAlertConfig(null); setDeleteAction(null); }}
                style={{
                  flex: 1,
                  padding: "0.65rem",
                  borderRadius: "0.5rem",
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              {deleteAction && (
                <button
                  onClick={deleteAction}
                  style={{
                    flex: 1,
                    padding: "0.65rem",
                    borderRadius: "0.5rem",
                    background: "#ef4444",
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                  }}
                >
                  Yes, Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
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
            maxWidth: "380px",
            padding: "1.25rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                + Add {activeTabNav === "visits" ? "Site Visit" : activeTabNav === "schedules" ? "Meeting / Video Tour" : activeTabNav === "pipeline" ? "Qualified Lead" : "Activity Log"}
              </h3>
              <button onClick={() => setIsQuickAddOpen(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleQuickAdd} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Client / Person Name *"
                value={newClient}
                onChange={e => setNewClient(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.84rem", outline: "none" }}
                required
              />
              <input
                type="text"
                placeholder="Title / Project / Agenda"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.84rem", outline: "none" }}
              />
              <input
                type="text"
                placeholder="Phone Number (10 digits)"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.84rem", outline: "none" }}
              />
              <input
                type="text"
                placeholder="Location / Venue / Chauffeur"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.84rem", outline: "none" }}
              />
              <input
                type="text"
                placeholder="Time Slot / Budget / Notes"
                value={newExtra}
                onChange={e => setNewExtra(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.84rem", outline: "none" }}
              />

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  style={{ flex: 1, padding: "0.6rem", borderRadius: "0.5rem", background: "#f1f5f9", color: "#475569", border: "none", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: "0.6rem", borderRadius: "0.5rem", background: "#2563eb", color: "#ffffff", border: "none", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. SUB-HEADER TAB NAVIGATION (APPLE iOS STYLE SEGMENTED CONTROL) */}
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
          { id: "visits", label: "Visits" },
          { id: "schedules", label: "Schedules" },
          { id: "pipeline", label: "Pipeline" },
          { id: "team", label: "Team" },
          { id: "documents", label: "Docs" }
        ].map((tab) => {
          const isActive = activeTabNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabNav(tab.id)}
              style={{
                flex: 1,
                padding: "8px 2px",
                border: "none",
                background: "transparent",
                color: isActive ? "#2563eb" : "#64748b",
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.8125rem",
                cursor: "pointer",
                borderBottom: isActive ? "2.5px solid #2563eb" : "2.5px solid transparent",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
                textAlign: "center"
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. DYNAMIC FILTER PILLS BAR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        overflowX: "auto",
        paddingBottom: "4px",
        marginBottom: "0.65rem",
        scrollbarWidth: "none"
      }}>
        {activeTabNav === "visits" && (
          <>
            {[
              { id: "ALL", label: `🚗 All Visits (${filteredVisits.length})` },
              { id: "CONFIRMED", label: "✅ Confirmed" },
              { id: "CHAUFFEUR", label: "🚖 Cab Assigned" },
              { id: "SCHEDULES", label: `⏰ Schedules (${filteredSVSchedules.length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setVisitFilter(f.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: visitFilter === f.id ? "#0f172a" : "#ffffff",
                  color: visitFilter === f.id ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {f.label}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "schedules" && (
          <>
            {[
              { id: "ALL", label: `📅 All (${filteredMeetings.length + filteredVCalls.length})` },
              { id: "MEETINGS", label: `🤝 In-Person (${filteredMeetings.length})` },
              { id: "VIDEOCALLS", label: `📹 3D Tours (${filteredVCalls.length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setScheduleFilter(f.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: scheduleFilter === f.id ? "#0f172a" : "#ffffff",
                  color: scheduleFilter === f.id ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {f.label}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "pipeline" && (
          <>
            {[
              { id: "ALL", label: `⭐ All SQLs (${filteredQLeads.length})` },
              { id: "CLAIMED", label: `🏆 Claimed (${filteredCLeads.length})` },
              { id: "UNIQUE", label: `✨ Unique (${filteredULeads.length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPipelineFilter(f.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: pipelineFilter === f.id ? "#0f172a" : "#ffffff",
                  color: pipelineFilter === f.id ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {f.label}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "team" && (
          <>
            {[
              { id: "ALL", label: `👥 Leaderboard (${filteredTeam.length})` },
              { id: "CALLS", label: `⏱️ 3-Min Calls (${filtered3MinCalls.length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTeamFilter(f.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: teamFilter === f.id ? "#0f172a" : "#ffffff",
                  color: teamFilter === f.id ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {f.label}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "documents" && (
          <>
            {[
              { id: "ALL", label: `📁 All Docs (${filteredActDocs.length})` },
              { id: "PDF", label: "📕 PDF Files" },
              { id: "ITINERARY", label: "📋 Itineraries" },
              { id: "FLOORPLAN", label: "📐 Floorplans" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setDocFilter(f.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: docFilter === f.id ? "#0f172a" : "#ffffff",
                  color: docFilter === f.id ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {f.label}
              </button>
            ))}
          </>
        )}
      </div>

      {/* 3. SLEEK UTILITY BAR (SEARCH + COMPACT CRM ACTION BUTTONS) */}
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
        {/* Search Input */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by client, title, location, vehicle..."
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
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "0 4px" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#ffffff",
              border: "none",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px",
              boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)"
            }}
            title="Add New Activity"
          >
            <Plus size={12} /> Add
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
            title="Upload Document / PDF"
          >
            <FileUp size={11} /> Doc
          </button>

          <button
            onClick={handleExportActiveView}
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
            title="Download Excel Report"
          >
            <FileDown size={11} />
          </button>
        </div>
      </div>

      {/* 4. ACTIVITY LIST - PIXEL-PERFECT iOS ROWS */}
      {/* --- TAB 1: VISITS --- */}
      {activeTabNav === "visits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {visitFilter !== "SCHEDULES" && filteredVisits.map((item, idx) => {
            const avatarUrl = getLeadAvatar(item.client, idx);
            return (
              <div
                key={item.id || item.name || idx}
                onClick={() => setSelectedActivityDrawer({ ...item, type: "visit" })}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.12s ease"
                }}
              >
                {/* Left: Avatar + Details */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <div style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0 }}>
                    <img
                      src={avatarUrl}
                      alt={item.client}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e2e8f0"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      bottom: "-2px",
                      right: "-2px",
                      background: "#10b981",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid #ffffff"
                    }} />
                  </div>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.client}
                      </span>
                      <span style={{
                        fontSize: "0.625rem",
                        padding: "1px 6px",
                        borderRadius: "9999px",
                        fontWeight: 700,
                        background: "#dcfce7",
                        color: "#15803d",
                        whiteSpace: "nowrap"
                      }}>
                        {item.status || "Confirmed"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600, marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      🚗 {item.title}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px", fontSize: "0.6875rem", color: "#64748b" }}>
                      <span>📍 {item.location}</span>
                      <span>•</span>
                      <span style={{ color: "#16a34a", fontWeight: 700 }}>⏰ {item.date}</span>
                    </div>

                    {item.cab && (
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        background: "#f0f9ff",
                        color: "#0284c7",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "0.65625rem",
                        fontWeight: 700,
                        marginTop: "4px"
                      }}>
                        <span>🚖 {item.cab}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Touch Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleWhatsAppMessage(item, "visit")}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#dcfce7",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#16a34a",
                      cursor: "pointer"
                    }}
                    title="Send WhatsApp Cab Itinerary"
                  >
                    <MessageSquare size={15} />
                  </button>

                  <button
                    onClick={() => handleDirectCall(item)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#eff6ff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2563eb",
                      cursor: "pointer"
                    }}
                    title="Call Client"
                  >
                    <Phone size={15} />
                  </button>

                  <button
                    onClick={() => handleStartVisit(item.client)}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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
                    title="Start Site Visit Tracking"
                  >
                    Start
                  </button>
                </div>
              </div>
            );
          })}

          {/* Site Visit Schedules in Visits Tab */}
          {(visitFilter === "ALL" || visitFilter === "SCHEDULES") && filteredSVSchedules.map((sch, idx) => {
            const avatarUrl = getLeadAvatar(sch.client, idx + 10);
            return (
              <div
                key={sch.id || sch.name || idx}
                onClick={() => setSelectedActivityDrawer({ ...sch, type: "schedule" })}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                  borderLeft: "4px solid #3b82f6",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <img
                    src={avatarUrl}
                    alt={sch.client}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{sch.client}</span>
                      <span style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "9999px", fontWeight: 700, background: "#dbeafe", color: "#1d4ed8" }}>
                        SV Schedule
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>🏢 {sch.project} • {sch.slot}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#0284c7" }}>🚖 {sch.cab}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleWhatsAppMessage(sch, "visit")}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#dcfce7", border: "none", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button
                    onClick={() => handleDirectCall(sch)}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", border: "none", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredVisits.length === 0 && filteredSVSchedules.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#ffffff", borderRadius: "16px", border: "1px solid #f1f5f9", color: "#64748b" }}>
              No site visits found matching your filter.
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: SCHEDULES (MEETINGS & VIDEO TOURS) --- */}
      {activeTabNav === "schedules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {scheduleFilter !== "VIDEOCALLS" && filteredMeetings.map((mtg, idx) => {
            const avatarUrl = getLeadAvatar(mtg.client, idx + 20);
            return (
              <div
                key={mtg.id || mtg.name || idx}
                onClick={() => setSelectedActivityDrawer({ ...mtg, type: "meeting" })}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                  borderLeft: "4px solid #f59e0b",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <img src={avatarUrl} alt={mtg.client} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{mtg.client}</span>
                      <span style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "9999px", fontWeight: 700, background: "#fef3c7", color: "#d97706" }}>
                        {mtg.status || "Scheduled"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>🤝 {mtg.agenda}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>📍 {mtg.venue} • <strong style={{ color: "#d97706" }}>{mtg.time}</strong></div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleWhatsAppMessage(mtg, "meeting")}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#dcfce7", border: "none", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button
                    onClick={() => handleDirectCall(mtg)}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", border: "none", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Phone size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (showToast) showToast(`✅ Meeting attendance & KYC verified for ${mtg.client}!`);
                    }}
                    style={{ background: "#dcfce7", color: "#15803d", border: "none", padding: "4px 8px", borderRadius: "8px", fontSize: "0.6875rem", fontWeight: 800, cursor: "pointer" }}
                  >
                    KYC
                  </button>
                </div>
              </div>
            );
          })}

          {scheduleFilter !== "MEETINGS" && filteredVCalls.map((vid, idx) => {
            const avatarUrl = getLeadAvatar(vid.client, idx + 30);
            return (
              <div
                key={vid.id || vid.name || idx}
                onClick={() => setSelectedActivityDrawer({ ...vid, type: "video" })}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                  borderLeft: "4px solid #0284c7",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <img src={avatarUrl} alt={vid.client} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{vid.client}</span>
                      <span style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "9999px", fontWeight: 700, background: "#e0f2fe", color: "#0284c7" }}>
                        {vid.platform || "Zoom HD"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>📹 {vid.project}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>⏰ {vid.time}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => window.open(vid.link || "https://zoom.us", "_blank")}
                    style={{ background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", color: "#ffffff", border: "none", padding: "5px 9px", borderRadius: "8px", fontSize: "0.6875rem", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "3px" }}
                  >
                    <Video size={12} /> Join
                  </button>
                  <button
                    onClick={() => handleWhatsAppMessage(vid, "video")}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#dcfce7", border: "none", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MessageSquare size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- TAB 3: PIPELINE (SQLs, CLAIMED, UNIQUE) --- */}
      {activeTabNav === "pipeline" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {pipelineFilter !== "CLAIMED" && pipelineFilter !== "UNIQUE" && filteredQLeads.map((lead, idx) => {
            const avatarUrl = getLeadAvatar(lead.name_client || lead.name, idx + 40);
            return (
              <div
                key={lead.id || lead.name || idx}
                onClick={() => setSelectedActivityDrawer({ ...lead, type: "sql" })}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <img src={avatarUrl} alt={lead.name_client || lead.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{lead.name_client || lead.name}</span>
                      <span style={{ fontSize: "0.625rem", padding: "1px 6px", borderRadius: "9999px", fontWeight: 700, background: "#dcfce7", color: "#15803d" }}>
                        ⭐ {lead.score || "94% Match"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 600 }}>{lead.interest || lead.bhk} • {lead.budget}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>📍 {lead.location}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleWhatsAppMessage(lead, "pipeline")}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#dcfce7", border: "none", color: "#16a34a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button
                    onClick={() => handleDirectCall(lead)}
                    style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", border: "none", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          {pipelineFilter === "CLAIMED" && filteredCLeads.map((lead, idx) => {
            const avatarUrl = getLeadAvatar(lead.lead_name || lead.name, idx + 50);
            return (
              <div
                key={lead.id || lead.name || idx}
                style={{ background: "#ffffff", borderRadius: "16px", padding: "10px 14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={avatarUrl} alt={lead.lead_name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{lead.lead_name || lead.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Source: {lead.source || "Marketplace"}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#fef3c7", color: "#d97706", padding: "3px 8px", borderRadius: "9999px" }}>
                  🏆 {lead.points || "50 Pts"}
                </span>
              </div>
            );
          })}

          {pipelineFilter === "UNIQUE" && filteredULeads.map((lead, idx) => {
            const avatarUrl = getLeadAvatar(lead.name_lead || lead.name, idx + 60);
            return (
              <div
                key={lead.id || lead.name || idx}
                style={{ background: "#ffffff", borderRadius: "16px", padding: "10px 14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={avatarUrl} alt={lead.name_lead} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{lead.name_lead || lead.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{lead.bhk || "2 BHK"} • {lead.source}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: "9999px" }}>
                  ✨ Unique
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* --- TAB 4: TEAM & QUALITY CALLS --- */}
      {activeTabNav === "team" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {teamFilter !== "CALLS" && (
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "12px", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                👥 Sales Consultants Leaderboard
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredTeam.map((member, idx) => {
                  const avatarUrl = getLeadAvatar(member.name_member || member.name, idx + 70);
                  return (
                    <div
                      key={member.name || idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: idx < filteredTeam.length - 1 ? "1px solid #f1f5f9" : "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ position: "relative", width: "38px", height: "38px" }}>
                          <img src={avatarUrl} alt={member.name} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", bottom: "-2px", right: "-2px", background: "#2563eb", color: "#ffffff", width: "16px", height: "16px", borderRadius: "50%", fontSize: "0.5625rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {idx + 1}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a" }}>{member.name_member || member.name}</div>
                          <div style={{ fontSize: "0.71875rem", color: "#64748b" }}>{member.role}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.78125rem", fontWeight: 800, color: "#16a34a" }}>{member.visits_count || 0} Visits</div>
                        <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>{member.calls_count || 0} Calls ({member.score || "90%"})</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {teamFilter === "CALLS" && filtered3MinCalls.map((call, idx) => {
            const avatarUrl = getLeadAvatar(call.client, idx + 80);
            return (
              <div
                key={call.id || call.name || idx}
                style={{ background: "#ffffff", borderRadius: "16px", padding: "10px 14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={avatarUrl} alt={call.client} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f172a" }}>{call.client}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{call.topic}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#e0f2fe", color: "#0284c7", padding: "2px 8px", borderRadius: "9999px" }}>
                    ⏱️ {call.duration || "03:00"}
                  </span>
                  <div style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 700, marginTop: "2px" }}>
                    ⭐ {call.quality_score || "9.5/10"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- TAB 5: ACTIVITY DOCUMENTS --- */}
      {activeTabNav === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredActDocs.map((doc, idx) => (
            <div
              key={doc.name || doc.id || idx}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "10px 14px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px"
              }}
            >
              <div
                onClick={() => setSelectedViewDoc(doc)}
                style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0, cursor: "pointer" }}
              >
                <div style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: (doc.file_type === "PDF" || (doc.name_doc || doc.name || "").endsWith(".pdf")) ? "#fee2e2" : "#e0e7ff",
                  color: (doc.file_type === "PDF" || (doc.name_doc || doc.name || "").endsWith(".pdf")) ? "#dc2626" : "#4338ca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  flexShrink: 0
                }}>
                  {doc.file_type || doc.fileType || "PDF"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {doc.name_doc || doc.name}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>
                    {doc.category || "Report"} • {doc.file_size || "1.2 MB"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  onClick={() => setSelectedViewDoc(doc)}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    border: "none",
                    padding: "5px 9px",
                    borderRadius: "8px",
                    fontSize: "0.6875rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  <Eye size={12} /> View
                </button>
                <button
                  onClick={() => confirmDeleteRecord(doc, "Activity Document", () => {
                    setUploadedActivityDocs(prev => prev.filter(d => (d.name || d.id) !== (doc.name || doc.id)));
                  })}
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "5px", borderRadius: "8px", cursor: "pointer" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {filteredActDocs.length === 0 && (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", background: "#ffffff", borderRadius: "16px", border: "1px solid #f1f5f9", color: "#64748b" }}>
              No activity documents match your search.
            </div>
          )}
        </div>
      )}

      {/* 5. SLIDE-UP DETAIL DRAWER FOR ACTIVE ITEM */}
      {selectedActivityDrawer && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end"
        }}>
          <div style={{
            background: "#ffffff",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
            padding: "1.25rem",
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow: "0 -10px 40px rgba(0,0,0,0.2)"
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={getLeadAvatar(selectedActivityDrawer.client || selectedActivityDrawer.name_client || selectedActivityDrawer.name, 99)}
                  alt="Avatar"
                  style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                />
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    {selectedActivityDrawer.client || selectedActivityDrawer.name_client || selectedActivityDrawer.name || "Client Activity"}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {selectedActivityDrawer.title || selectedActivityDrawer.project || selectedActivityDrawer.agenda || "Scheduled Event"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivityDrawer(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>TIMING / SLOT</div>
                <div style={{ fontSize: "0.84375rem", color: "#0f172a", fontWeight: 800, marginTop: "2px" }}>
                  {selectedActivityDrawer.date || selectedActivityDrawer.slot || selectedActivityDrawer.time || "Scheduled Today"}
                </div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>STATUS</div>
                <div style={{ fontSize: "0.84375rem", color: "#16a34a", fontWeight: 800, marginTop: "2px" }}>
                  ● {selectedActivityDrawer.status || "Confirmed"}
                </div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>LOCATION / VENUE</div>
                <div style={{ fontSize: "0.84375rem", color: "#0f172a", fontWeight: 800, marginTop: "2px" }}>
                  {selectedActivityDrawer.location || selectedActivityDrawer.venue || "Mumbai Prime Area"}
                </div>
              </div>
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "12px" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>CHAUFFEUR / CAB</div>
                <div style={{ fontSize: "0.84375rem", color: "#0284c7", fontWeight: 800, marginTop: "2px" }}>
                  {selectedActivityDrawer.cab || "Self Driven / Walk-in"}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  handleDirectCall(selectedActivityDrawer);
                  setSelectedActivityDrawer(null);
                }}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                }}
              >
                <Phone size={16} /> Click-to-Call via CRM Bridge
              </button>

              <button
                onClick={() => {
                  handleWhatsAppMessage(selectedActivityDrawer, selectedActivityDrawer.type || "visit");
                  setSelectedActivityDrawer(null);
                }}
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  border: "none",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <MessageSquare size={16} /> Send WhatsApp Confirmation
              </button>

              {selectedActivityDrawer.location && (
                <button
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedActivityDrawer.location + ' Mumbai')}`, '_blank')}
                  style={{
                    background: "#f1f5f9",
                    color: "#0f172a",
                    border: "none",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Navigation size={16} /> Open in Google Maps
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
