import React, { useState } from "react";
import { 
  Phone, Users, Flame, Calendar, TrendingUp, ArrowRight, Award, 
  CheckCircle, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, 
  ShieldCheck, MapPin, Building, ChevronRight, RotateCcw, Clock, Check
} from "lucide-react";
import FilterBar from "./FilterBar";

const AVATAR_LIST = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
];

export default function PerformanceView({ 
  metrics, 
  userProfile, 
  onStartCalling, 
  onClaimLeads, 
  onOpenColdDialer, 
  leads = [], 
  onCallLead,
  showToast 
}) {
  const [dateFilter, setDateFilter] = useState("This Month");
  const [orderFilter, setOrderFilter] = useState("Calls Made");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [leadFlag, setLeadFlag] = useState(true);
  const [activeMetricFilter, setActiveMetricFilter] = useState("Qualified Leads");

  // Interactive Verification State ("verify ka sath")
  const [isMeetingVerified, setIsMeetingVerified] = useState(() => {
    return localStorage.getItem("crm_meeting_verified_4230005") === "true";
  });
  const [verifiedTimestamp, setVerifiedTimestamp] = useState(() => {
    return localStorage.getItem("crm_meeting_verified_time") || "Today, 11:45 AM";
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const greetingName = userProfile?.name ? userProfile.name.split(" ")[0] : "Shyam";

  const handleToggleVerification = () => {
    if (!isMeetingVerified) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const timeStr = `Today, ${now}`;
      setIsMeetingVerified(true);
      setVerifiedTimestamp(timeStr);
      localStorage.setItem("crm_meeting_verified_4230005", "true");
      localStorage.setItem("crm_meeting_verified_time", timeStr);
      if (showToast) {
        showToast("✅ Meeting Verified! Pravin Ladkat (Lead #4230005) - Attendance & KYC recorded.");
      }
    } else {
      setIsMeetingVerified(false);
      localStorage.removeItem("crm_meeting_verified_4230005");
      if (showToast) {
        showToast("Meeting marked unverified.");
      }
    }
  };

  // Dynamic Lead Metric Calculations based on live CRM state
  const qualifiedLeads = leads.filter(l => l.priority === "HOT" || l.status === "CLOSED" || (l.history && l.history.some(h => (h.outcome || '').includes("Interested") || (h.outcome || '').includes("Hot") || (h.outcome || '').includes("Closed"))));
  const myVisitsLeads = leads.filter(l => l.service === "Site Visit Booking" || (l.history && l.history.some(h => (h.outcome || '').includes("Visit"))));
  const leadsClaimed = leads.filter(l => l.assigned_to || (l.callCount && l.callCount > 0) || (l.history && l.history.length > 0));
  const siteVisitLeads = leads.filter(l => l.service === "Site Visit Booking" || (l.history && l.history.some(h => (h.outcome || '').includes("Visit"))));
  const meetingLeads = leads.filter(l => l.status === "FOLLOWUP_TODAY" || (l.history && l.history.some(h => (h.outcome || '').includes("Meeting"))));
  const videoCallLeads = leads.filter(l => (l.notes || "").toLowerCase().includes("video") || (l.notes || "").toLowerCase().includes("virtual") || l.service === "Home Buying");
  const threeMinCallLeads = leads.filter(l => (l.callCount && l.callCount >= 2) || l.priority === "HOT");

  // Dynamic Metric Totals
  const totalCallsCount = leads.reduce((sum, l) => sum + (l.callCount || (l.history?.length || 0)), 0);
  const displayCallsCount = metrics?.mtdCallsMade !== undefined ? metrics.mtdCallsMade : totalCallsCount;

  const followupsDoneCount = leads.filter(l => l.status === "FOLLOWUP_TODAY" || l.status === "FOLLOWUP" || l.callbackTime || (l.history && l.history.some(h => (h.outcome || '').includes("Follow") || (h.outcome || '').includes("Call Back")))).length;
  const displayFollowups = metrics?.followupsDone !== undefined ? metrics.followupsDone : followupsDoneCount;

  const displayHotLeads = metrics?.hotLeadsPassed !== undefined ? metrics.hotLeadsPassed : (qualifiedLeads.length || 8);
  const displayVisits = metrics?.visitsBooked !== undefined ? metrics.visitsBooked : (siteVisitLeads.length || 3);

  const closedDeals = leads.filter(l => l.status === "CLOSED" || (l.history && l.history.some(h => (h.outcome || '').includes("Closed") || (h.outcome || '').includes("Won"))));
  const closedCount = metrics?.conversionsCount !== undefined ? metrics.conversionsCount : (closedDeals.length || 4);
  const conversionAmountStr = metrics?.conversionsAmount || `₹ 1.20 Cr`;

  const unverifiedCount = isMeetingVerified ? 0 : (metrics?.unverifiedCount ?? 1);

  const metricCategories = [
    { id: "My Visits", title: "My Visits", count: metrics?.myVisitsCount ?? (myVisitsLeads.length || 4), icon: "🚗", color: "#2563eb", bg: "#eff6ff", leads: myVisitsLeads.length ? myVisitsLeads : leads.slice(0, 4) },
    { id: "Qualified Leads", title: "Qualified Leads", count: metrics?.qualifiedLeadsCount ?? (qualifiedLeads.length || 8), icon: "🔥", color: "#dc2626", bg: "#fef2f2", leads: qualifiedLeads.length ? qualifiedLeads : leads.filter(l => l.priority === "HOT") },
    { id: "Leads Claimed", title: "Leads Claimed", count: metrics?.leadsClaimedCount ?? (leadsClaimed.length || 14), icon: "🎯", color: "#16a34a", bg: "#f0fdf4", leads: leadsClaimed.length ? leadsClaimed : leads },
    { id: "Unique Leads Created", title: "Unique Leads", count: metrics?.uniqueLeadsCount ?? leads.length, icon: "✨", color: "#9333ea", bg: "#faf5ff", leads: leads },
    { id: "Site Visit Schedule", title: "Site Visits", count: metrics?.siteVisitScheduleCount ?? (siteVisitLeads.length || 3), icon: "📅", color: "#ea580c", bg: "#fff7ed", leads: siteVisitLeads.length ? siteVisitLeads : leads.slice(0, 3) },
    { id: "Meeting Schedule", title: "Meetings", count: metrics?.meetingScheduleCount ?? (meetingLeads.length || 5), icon: "🤝", color: "#0284c7", bg: "#f0f9ff", leads: meetingLeads.length ? meetingLeads : leads.slice(1, 4) },
    { id: "Video Call Schedule", title: "Video Calls", count: metrics?.videoCallScheduleCount ?? (videoCallLeads.length || 2), icon: "🎥", color: "#4f46e5", bg: "#eef2ff", leads: videoCallLeads.length ? videoCallLeads : leads.slice(2, 4) },
    { id: "My Team", title: "My Team", count: metrics?.myTeamCount ?? (metrics?.teamMembers?.length || 6), icon: "👥", color: "#0891b2", bg: "#ecfeff", leads: [] },
    { id: "Three Minute Calls", title: "3-Min Calls", count: metrics?.threeMinCallsCount ?? (threeMinCallLeads.length || 12), icon: "⏱️", color: "#d97706", bg: "#fffbeb", leads: threeMinCallLeads.length ? threeMinCallLeads : leads.slice(0, 5) }
  ];

  const activeCategoryObj = metricCategories.find(c => c.id === activeMetricFilter) || metricCategories[1];
  let activeDisplayLeads = (activeCategoryObj.leads || []).filter(l => {
    if (priorityFilter && l.priority !== priorityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (l.name || l.lead_name || "").toLowerCase().includes(q);
      const matchPhone = (l.phone || "").includes(q);
      const matchLoc = (l.location || "").toLowerCase().includes(q);
      const matchBhk = (l.bhkType || l.bhk_type || "").toLowerCase().includes(q);
      const matchNotes = (l.notes || "").toLowerCase().includes(q);
      return matchName || matchPhone || matchLoc || matchBhk || matchNotes;
    }
    return true;
  });

  const handleWhatsAppLead = (lead) => {
    const rawPhone = (lead.phone || "").replace(/\D/g, "");
    const cleanPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const clientName = lead.name || lead.lead_name || "Client";
    const project = lead.project || lead.bhkType || "Luxury Property";
    const text = encodeURIComponent(`Hi ${clientName}, this is Shyam Pandey from Dream Homes Real Estate regarding ${project}. Would you like to review the floor plans & pricing brochure?`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="view-container" style={{ padding: "0.75rem 0.65rem 5.5rem 0.65rem" }}>
      {/* 1. Unclaimed Fresh Leads Card */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        padding: "0.85rem 1rem",
        marginBottom: "0.75rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0f172a" }}>
            Unclaimed Fresh Leads ({metrics?.unclaimedCount ?? 5})
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.3rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Lead Flag is On</span>
            <input 
              type="checkbox" 
              checked={leadFlag} 
              onChange={() => setLeadFlag(!leadFlag)}
              style={{ cursor: "pointer", accentColor: "#2563eb", width: "15px", height: "15px" }} 
            />
          </div>
        </div>

        <button
          onClick={onClaimLeads}
          style={{
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            padding: "0.5rem 0.9rem",
            borderRadius: "0.5rem",
            fontSize: "0.78125rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)",
            whiteSpace: "nowrap"
          }}
        >
          Claim Leads Now &gt;&gt;
        </button>
      </div>

      {/* 2. Reward Points Dark Card */}
      <div style={{
        background: "#1e293b",
        borderRadius: "0.875rem",
        padding: "0.85rem 1rem",
        marginBottom: "0.75rem",
        color: "#ffffff",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff" }}>
            Reward Points
          </span>
          <div style={{
            background: "#0f172a",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "9999px",
            padding: "0.2rem 0.65rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem"
          }}>
            <span>🪙</span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#ffffff" }}>
              {metrics?.rewardPoints ?? 2400}
            </span>
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.6rem" }}>
          Used Points
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
            <span>🪙</span>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#ffffff" }}>
              {metrics?.usedPoints ?? 0}
            </span>
          </div>
        </div>

        <div 
          onClick={onClaimLeads}
          style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
        >
          Claim Leads Now. &gt;&gt;
        </div>
      </div>

      {/* 3. Training Modules (1) Card */}
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
          Training Modules (1)
        </div>
        <div style={{
          background: "#059669",
          borderRadius: "0.625rem",
          padding: "0.75rem 0.85rem",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <Calendar size={18} color="#ffffff" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.78125rem", fontWeight: 800, color: "#ffffff" }}>
                SY Circle - Cross-Referral Program
              </div>
              <div style={{ fontSize: "0.6875rem", color: "#a7f3d0", marginTop: "0.1rem" }}>
                Due Date : 30 Jun 2026
              </div>
            </div>
          </div>
          <span style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            fontSize: "0.6875rem",
            fontWeight: 800,
            padding: "0.2rem 0.5rem",
            borderRadius: "0.35rem"
          }}>
            Completed
          </span>
        </div>
      </div>

      {/* 4. Unverified Meetings (1) Card */}
      <div style={{
        background: isMeetingVerified ? "#f0fdf4" : "#ffffff",
        border: isMeetingVerified ? "1px solid #86efac" : "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        padding: "0.75rem 0.85rem",
        marginBottom: "0.85rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Clock size={18} color={isMeetingVerified ? "#16a34a" : "#64748b"} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: isMeetingVerified ? "#15803d" : "#0f172a" }}>
              {isMeetingVerified ? "Verified Meetings" : `Unverified Meetings (${unverifiedCount})`}
            </div>
            <div style={{ fontSize: "0.6875rem", color: "#64748b", marginTop: "0.1rem" }}>
              Lead Id: 4230005 | Pravin Ladkat
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleVerification}
          style={{
            background: isMeetingVerified ? "#dcfce7" : "#ffffff",
            color: isMeetingVerified ? "#15803d" : "#0f172a",
            border: isMeetingVerified ? "1px solid #86efac" : "1px solid #cbd5e1",
            padding: "0.3rem 0.75rem",
            borderRadius: "0.45rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          {isMeetingVerified ? "Verified ✓" : "Verify"}
        </button>
      </div>

      {/* 5. Good afternoon greeting */}
      <div style={{ marginBottom: "0.75rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.15rem 0" }}>
          Good afternoon, {greetingName}! 👋
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
          Click any performance card to filter lead details
        </p>
      </div>

      {/* 3x3 Interactive Metric Categories Grid */}
      <div style={{ marginBottom: "0.875rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem", padding: "0 0.1rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Operational Pipeline Categories
          </span>
          <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>
            Tap card to inspect leads
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.55rem" }}>
          {metricCategories.map(cat => {
            const isSelected = activeMetricFilter === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveMetricFilter(cat.id)}
                style={{
                  background: isSelected ? cat.bg : "#ffffff",
                  border: isSelected ? `2px solid ${cat.color}` : "1px solid #e2e8f0",
                  borderRadius: "0.875rem",
                  padding: "0.7rem 0.55rem",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isSelected ? `0 6px 18px ${cat.color}30` : "0 1px 3px rgba(0,0,0,0.03)",
                  transform: isSelected ? "translateY(-1.5px)" : "none"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: cat.color }}>
                    {cat.count}
                  </span>
                </div>
                <div style={{
                  fontSize: "0.71875rem",
                  fontWeight: 800,
                  color: isSelected ? "#0f172a" : "#334155",
                  marginTop: "0.35rem",
                  lineHeight: "1.2",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {cat.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtered Drilldown Leads List (Luxury iOS Style) */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        padding: "0.875rem",
        marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "1rem" }}>{activeCategoryObj.icon}</span>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {activeCategoryObj.title} ({activeCategoryObj.id === "My Team" ? 4 : activeDisplayLeads.length})
            </h3>
          </div>
          <span style={{
            fontSize: "0.6875rem",
            color: activeCategoryObj.color,
            fontWeight: 800,
            background: activeCategoryObj.bg,
            padding: "0.15rem 0.5rem",
            borderRadius: "9999px"
          }}>
            Filter Active
          </span>
        </div>

        {activeCategoryObj.id === "My Team" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { name: "Shyam Pandey", role: "Senior Sales Consultant", calls: "54 Calls Logged", status: "🟢 Online", phone: "9867778229", avatar: "/profile.jpg" },
              { name: "Priya Sharma", role: "Sales Manager", calls: "48 Calls Logged", status: "🟢 Online", phone: "9819922114", avatar: AVATAR_LIST[1] },
              { name: "Rajesh Kumar", role: "Senior Telecaller", calls: "62 Calls Logged", status: "🟢 Online", phone: "9820033441", avatar: AVATAR_LIST[2] },
              { name: "Karan Joshi", role: "Property Specialist", calls: "35 Calls Logged", status: "🟡 In Meeting", phone: "9833445566", avatar: AVATAR_LIST[6] }
            ].map((t, idx) => (
              <div key={idx} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.65rem 0.75rem",
                background: "#f8fafc",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    onError={(e) => { e.target.src = AVATAR_LIST[idx % AVATAR_LIST.length]; }}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a" }}>{t.name}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>{t.role} • {t.calls}</div>
                  </div>
                </div>
                <span style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 800, background: "#dcfce7", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {activeDisplayLeads.slice(0, 6).map((lead, idx) => {
              const avatarUrl = AVATAR_LIST[idx % AVATAR_LIST.length];
              const isHot = lead.priority === "HOT";
              return (
                <div
                  key={lead.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.65rem 0.75rem",
                    background: "#f8fafc",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flex: 1, minWidth: 0 }}>
                    <img 
                      src={avatarUrl} 
                      alt={lead.name}
                      style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: isHot ? "1.5px solid #ef4444" : "1px solid #cbd5e1" }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lead.name || lead.lead_name}
                        </span>
                        <span style={{
                          fontSize: "0.625rem",
                          fontWeight: 800,
                          padding: "0.1rem 0.35rem",
                          borderRadius: "4px",
                          background: isHot ? "#fee2e2" : "#fef3c7",
                          color: isHot ? "#dc2626" : "#d97706"
                        }}>
                          {lead.priority || "WARM"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.6875rem", color: "#64748b", marginTop: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        📍 {lead.location || "Mumbai"} • 🏢 {lead.bhkType || lead.bhk_type || "2 BHK"} • ₹ {lead.budget || "1.85 Cr"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginLeft: "0.5rem" }}>
                    <button
                      onClick={() => handleWhatsAppLead(lead)}
                      title="Send WhatsApp Message"
                      style={{
                        background: "#25d366",
                        color: "#ffffff",
                        border: "none",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(37, 211, 102, 0.35)"
                      }}
                    >
                      <MessageSquare size={14} />
                    </button>

                    <button
                      onClick={() => onCallLead && onCallLead(lead)}
                      title="Direct Exotel / SIM Call"
                      style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "#ffffff",
                        border: "none",
                        padding: "0.4rem 0.75rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)"
                      }}
                    >
                      <Phone size={13} /> Call
                    </button>
                  </div>
                </div>
              );
            })}

            {activeDisplayLeads.length === 0 && (
              <div style={{ textAlign: "center", padding: "1.5rem", color: "#64748b", fontSize: "0.8125rem" }}>
                No leads currently match this performance category.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Filter Toolbar */}
      <FilterBar
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        orderFilter={orderFilter} setOrderFilter={setOrderFilter}
        search={search} setSearch={setSearch}
        showPriorityPills={true}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
      />

      {/* 5 High-Impact Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-title">MTD Calls Made</span>
            <Phone size={16} className="metric-icon" />
          </div>
          <div className="metric-value">{displayCallsCount}</div>
          <div className="metric-trend">
            <TrendingUp size={14} /> +{metrics?.callsMomPercent || "16.4"}% MOM
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-title">Follow-ups Done</span>
            <Users size={16} className="metric-icon" />
          </div>
          <div className="metric-value">{displayFollowups}</div>
          <div className="metric-trend">
            <TrendingUp size={14} /> +{metrics?.followupsMomPercent || "10.5"}% MOM
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-title">Hot Leads Passed</span>
            <Flame size={16} className="metric-icon" />
          </div>
          <div className="metric-value">{displayHotLeads}</div>
          <div className="metric-trend">
            <TrendingUp size={14} /> +{metrics?.hotLeadsMomPercent || "28.5"}% MOM
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <span className="metric-title">Visits Booked</span>
            <Calendar size={16} className="metric-icon" />
          </div>
          <div className="metric-value">{displayVisits}</div>
          <div className="metric-trend">
            <TrendingUp size={14} /> +{metrics?.visitsMomPercent || "33.3"}% MOM
          </div>
        </div>

        <div className="metric-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", gridColumn: "span 2" }}>
          <div className="metric-card-top">
            <span className="metric-title" style={{ color: "#15803d" }}>Total Conversions</span>
            <TrendingUp size={18} style={{ color: "#16a34a" }} />
          </div>
          <div className="metric-value" style={{ color: "#15803d" }}>{conversionAmountStr}</div>
          <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 700, marginTop: "0.4rem" }}>
            {closedCount} deals closed | +{metrics?.conversionsMomPercent || "40"}% MOM
          </div>
        </div>
      </div>

      {/* Target Progress & MoM Chart Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title-row">
            <span className="chart-title">🌀 Monthly Call Target</span>
            <span className="chart-target-value">{displayCallsCount} / {metrics?.mtdCallsTarget || 80}</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, Math.round((displayCallsCount / (metrics?.mtdCallsTarget || 80)) * 100))}%` }}
            ></div>
          </div>
          <div className="progress-labels">
            <span>{Math.round((displayCallsCount / (metrics?.mtdCallsTarget || 80)) * 100)}% Achieved</span>
            <span>Target: 100%</span>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title-row">
            <span className="chart-title">📊 Month-over-Month Comparison</span>
            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.7rem", fontWeight: 600 }}>
              <span style={{ color: "#2563eb" }}>■ This Month</span>
              <span style={{ color: "#94a3b8" }}>■ Last Month</span>
            </div>
          </div>

          <div className="mom-bar-chart">
            <div className="bar-group">
              <div className="bars-pair">
                <div className="bar this-month" style={{ height: `${Math.min(120, Math.max(30, displayCallsCount * 0.6))}px` }} title={`Calls: ${displayCallsCount}`}></div>
                <div className="bar last-month" style={{ height: "90px" }} title="Last Month: 120"></div>
              </div>
              <span className="bar-label">Calls</span>
            </div>

            <div className="bar-group">
              <div className="bars-pair">
                <div className="bar this-month" style={{ height: `${Math.min(120, Math.max(20, displayHotLeads * 3))}px` }} title={`Hot Leads: ${displayHotLeads}`}></div>
                <div className="bar last-month" style={{ height: "30px" }} title="Last Month: 14"></div>
              </div>
              <span className="bar-label">Hot Leads</span>
            </div>

            <div className="bar-group">
              <div className="bars-pair">
                <div className="bar this-month" style={{ height: `${Math.min(120, Math.max(20, displayVisits * 4))}px` }} title={`Visits: ${displayVisits}`}></div>
                <div className="bar last-month" style={{ height: "25px" }} title="Last Month: 9"></div>
              </div>
              <span className="bar-label">Visits</span>
            </div>

            <div className="bar-group">
              <div className="bars-pair">
                <div className="bar this-month" style={{ height: `${Math.min(120, Math.max(20, closedCount * 6))}px` }} title={`Conversions: ${closedCount}`}></div>
                <div className="bar last-month" style={{ height: "15px" }} title="Last Month: 5"></div>
              </div>
              <span className="bar-label">Conversions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Button Grid */}
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
        <button 
          className="start-calling-btn" 
          style={{ flex: 1, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)" }} 
          onClick={onStartCalling}
        >
          <Phone size={18} />
          <span>Start Calling Pipeline</span>
        </button>
        <button 
          className="start-calling-btn" 
          style={{ flex: 1, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }} 
          onClick={onOpenColdDialer}
        >
          <Sparkles size={18} />
          <span>Cold Meeting Logger</span>
        </button>
      </div>
    </div>
  );
}
