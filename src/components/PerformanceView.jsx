import React, { useState } from "react";
import { 
  Phone, Users, Flame, Calendar, TrendingUp, Award, 
  CheckCircle, CheckCircle2, ShieldAlert, Sparkles, MessageSquare, 
  ShieldCheck, MapPin, Building, ChevronRight, RotateCcw, Clock, Check,
  BarChart3, Target, LayoutGrid, Layers
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
  const [activeSection, setActiveSection] = useState("overview"); // "overview" | "pipeline" | "analytics" | "all"
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
  const conversionAmountStr = metrics?.conversionsAmount || `₹ 245K`;

  const unverifiedCount = isMeetingVerified ? 0 : (metrics?.unverifiedCount ?? 1);

  const metricCategories = [
    { id: "My Visits", title: "My Visits", count: metrics?.myVisitsCount ?? (myVisitsLeads.length || 2), icon: "🚗", color: "#2563eb", bg: "#eff6ff", leads: myVisitsLeads.length ? myVisitsLeads : leads.slice(0, 4) },
    { id: "Qualified Leads", title: "Qualified Leads", count: metrics?.qualifiedLeadsCount ?? (qualifiedLeads.length || 4), icon: "🔥", color: "#dc2626", bg: "#fef2f2", leads: qualifiedLeads.length ? qualifiedLeads : leads.filter(l => l.priority === "HOT") },
    { id: "Leads Claimed", title: "Leads Claimed", count: metrics?.leadsClaimedCount ?? (leadsClaimed.length || 14), icon: "🎯", color: "#16a34a", bg: "#f0fdf4", leads: leadsClaimed.length ? leadsClaimed : leads },
    { id: "Unique Leads Created", title: "Unique Leads", count: metrics?.uniqueLeadsCount ?? (leads.length || 10), icon: "✨", color: "#9333ea", bg: "#faf5ff", leads: leads },
    { id: "Site Visit Schedule", title: "Site Visits", count: metrics?.siteVisitScheduleCount ?? (siteVisitLeads.length || 2), icon: "📅", color: "#ea580c", bg: "#fff7ed", leads: siteVisitLeads.length ? siteVisitLeads : leads.slice(0, 3) },
    { id: "Meeting Schedule", title: "Meetings", count: metrics?.meetingScheduleCount ?? (meetingLeads.length || 5), icon: "🤝", color: "#0284c7", bg: "#f0f9ff", leads: meetingLeads.length ? meetingLeads : leads.slice(1, 4) },
    { id: "Video Call Schedule", title: "Video Calls", count: metrics?.videoCallScheduleCount ?? (videoCallLeads.length || 4), icon: "🎥", color: "#4f46e5", bg: "#eef2ff", leads: videoCallLeads.length ? videoCallLeads : leads.slice(2, 4) },
    { id: "My Team", title: "My Team", count: metrics?.myTeamCount ?? (metrics?.teamMembers?.length || 6), icon: "👥", color: "#0891b2", bg: "#ecfeff", leads: [] },
    { id: "Three Minute Calls", title: "3-Min Calls", count: metrics?.threeMinCallsCount ?? (threeMinCallLeads.length || 4), icon: "⏱️", color: "#d97706", bg: "#fffbeb", leads: threeMinCallLeads.length ? threeMinCallLeads : leads.slice(0, 5) }
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

  // Helper render for Section 1: Overview & Daily Actions
  const renderOverviewSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
      {/* Unverified Meetings Alert */}
      <div style={{
        background: isMeetingVerified ? "#f0fdf4" : "#fffbeb",
        border: isMeetingVerified ? "1px solid #86efac" : "1.5px solid #fde68a",
        borderRadius: "0.875rem",
        padding: "0.75rem 0.85rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: isMeetingVerified ? "#dcfce7" : "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Clock size={18} color={isMeetingVerified ? "#16a34a" : "#d97706"} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: isMeetingVerified ? "#15803d" : "#92400e" }}>
                {isMeetingVerified ? "Verified Meetings" : `Unverified Meetings (${unverifiedCount})`}
              </span>
              {!isMeetingVerified && (
                <span style={{ fontSize: "0.625rem", background: "#fee2e2", color: "#dc2626", fontWeight: 800, padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                  PENDING KYC
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.71875rem", color: "#64748b", marginTop: "0.15rem" }}>
              Lead #4230005: Pravin Ladkat • Site Visit Oberoi Sky City
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleVerification}
          style={{
            background: isMeetingVerified ? "#dcfce7" : "#059669",
            color: isMeetingVerified ? "#15803d" : "#ffffff",
            border: isMeetingVerified ? "1px solid #86efac" : "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: isMeetingVerified ? "none" : "0 2px 6px rgba(5, 150, 105, 0.3)",
            whiteSpace: "nowrap"
          }}
        >
          {isMeetingVerified ? "Verified ✓" : "Verify Now"}
        </button>
      </div>

      {/* Agent Rewards & Unclaimed Pool Card */}
      <div style={{
        background: "#1e293b",
        borderRadius: "0.875rem",
        padding: "0.85rem 1rem",
        color: "#ffffff",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Agent Rewards & Fresh Pool
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🪙</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff" }}>
                {metrics?.rewardPoints ?? 2400}
              </span>
              <span style={{ fontSize: "0.71875rem", color: "#cbd5e1" }}>Points Earned</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.6875rem", color: "#94a3b8" }}>Used Points</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "#ffffff", marginTop: "0.15rem" }}>
              🪙 {metrics?.usedPoints ?? 0}
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "0.5rem",
          padding: "0.5rem 0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#f1f5f9" }}>
              ⚡ Unclaimed Fresh Pool: <strong style={{ color: "#38bdf8" }}>{metrics?.unclaimedCount ?? 5} Leads</strong>
            </span>
            <span style={{ fontSize: "0.65rem", background: "#16a34a", color: "#ffffff", padding: "0.1rem 0.35rem", borderRadius: "4px", fontWeight: 700 }}>
              ACTIVE ON
            </span>
          </div>

          <button
            onClick={onClaimLeads}
            style={{
              background: "#f59e0b",
              color: "#0f172a",
              border: "none",
              padding: "0.25rem 0.65rem",
              borderRadius: "0.35rem",
              fontSize: "0.71875rem",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            Claim Leads &gt;&gt;
          </button>
        </div>
      </div>

      {/* Training Module Card */}
      <div style={{
        background: "#0284c7",
        borderRadius: "0.75rem",
        padding: "0.7rem 0.85rem",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Calendar size={18} color="#ffffff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.78125rem", fontWeight: 800, color: "#ffffff" }}>
              SY Circle - Cross-Referral Program
            </div>
            <div style={{ fontSize: "0.6875rem", color: "#bae6fd", marginTop: "0.1rem" }}>
              Due Date: 30 Jun 2026
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
          Completed ✓
        </span>
      </div>

      {/* Daily High-Impact Metric Cards (2x2 Grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.55rem", marginTop: "0.25rem" }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.75rem 0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748b", fontSize: "0.71875rem", fontWeight: 700 }}>
            <span>MTD Calls Made</span>
            <Phone size={15} color="#2563eb" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginTop: "0.2rem" }}>
            {displayCallsCount}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 700, marginTop: "0.2rem" }}>
            +{metrics?.callsMomPercent || "16.4"}% MOM
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.75rem 0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748b", fontSize: "0.71875rem", fontWeight: 700 }}>
            <span>Follow-ups Done</span>
            <Users size={15} color="#16a34a" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginTop: "0.2rem" }}>
            {displayFollowups}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 700, marginTop: "0.2rem" }}>
            +{metrics?.followupsMomPercent || "10.5"}% MOM
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.75rem 0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748b", fontSize: "0.71875rem", fontWeight: 700 }}>
            <span>Hot Leads Passed</span>
            <Flame size={15} color="#dc2626" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginTop: "0.2rem" }}>
            {displayHotLeads}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 700, marginTop: "0.2rem" }}>
            +{metrics?.hotLeadsMomPercent || "28.5"}% MOM
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.75rem 0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#64748b", fontSize: "0.71875rem", fontWeight: 700 }}>
            <span>Visits Booked</span>
            <Calendar size={15} color="#ea580c" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "#0f172a", marginTop: "0.2rem" }}>
            {displayVisits}
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#16a34a", fontWeight: 700, marginTop: "0.2rem" }}>
            +{metrics?.visitsMomPercent || "33.3"}% MOM
          </div>
        </div>
      </div>

      {/* Direct Calling Quick CTAs */}
      <div style={{ display: "flex", gap: "0.55rem", marginTop: "0.25rem" }}>
        <button 
          className="start-calling-btn" 
          style={{ flex: 1, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", padding: "0.7rem", borderRadius: "0.65rem", fontSize: "0.8125rem" }} 
          onClick={onStartCalling}
        >
          <Phone size={16} />
          <span>Start Calling Pipeline</span>
        </button>
        <button 
          className="start-calling-btn" 
          style={{ flex: 1, background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", padding: "0.7rem", borderRadius: "0.65rem", fontSize: "0.8125rem" }} 
          onClick={onOpenColdDialer}
        >
          <Sparkles size={16} />
          <span>Cold Meeting Logger</span>
        </button>
      </div>
    </div>
  );

  // Helper render for Section 2: Pipeline 3x3 & Drilldown
  const renderPipelineSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* 3x3 Operational Metric Categories Grid */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.45rem" }}>
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
                  transition: "all 0.18s ease",
                  boxShadow: isSelected ? `0 4px 12px ${cat.color}25` : "0 1px 3px rgba(0,0,0,0.03)",
                  transform: isSelected ? "translateY(-1px)" : "none"
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

      {/* Filter Bar for Drilldown Leads */}
      <FilterBar
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        orderFilter={orderFilter} setOrderFilter={setOrderFilter}
        search={search} setSearch={setSearch}
        showPriorityPills={true}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
      />

      {/* Drilldown Leads List */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "1rem",
        padding: "0.85rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem", paddingBottom: "0.45rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "1.1rem" }}>{activeCategoryObj.icon}</span>
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
                    border: "1px solid #e2e8f0"
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
    </div>
  );

  // Helper render for Section 3: Goals, Conversions & Analytics
  const renderAnalyticsSection = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Total Conversions Card */}
      <div style={{
        background: "#f0fdf4",
        border: "1.5px solid #bbf7d0",
        borderRadius: "0.875rem",
        padding: "0.9rem 1rem",
        boxShadow: "0 2px 8px rgba(22, 163, 74, 0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Total Conversions
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#15803d", marginTop: "0.2rem" }}>
              {conversionAmountStr}
            </div>
          </div>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#dcfce7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <TrendingUp size={22} color="#16a34a" />
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 700, marginTop: "0.45rem" }}>
          {closedCount} deals closed | +{metrics?.conversionsMomPercent || "40"}% MOM
        </div>
      </div>

      {/* Monthly Call Target Progress */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        padding: "0.9rem 1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a" }}>🌀 Monthly Call Target</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 900, color: "#2563eb" }}>{displayCallsCount} / {metrics?.mtdCallsTarget || 80}</span>
        </div>
        <div className="progress-bar-track" style={{ height: "10px", borderRadius: "9999px", background: "#f1f5f9", overflow: "hidden" }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${Math.min(100, Math.round((displayCallsCount / (metrics?.mtdCallsTarget || 80)) * 100))}%`,
              height: "100%",
              background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
              borderRadius: "9999px"
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.71875rem", color: "#64748b", marginTop: "0.35rem", fontWeight: 600 }}>
          <span style={{ color: "#16a34a", fontWeight: 800 }}>{Math.round((displayCallsCount / (metrics?.mtdCallsTarget || 80)) * 100)}% Achieved</span>
          <span>Target: 100%</span>
        </div>
      </div>

      {/* Month-over-Month Comparison Chart */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        padding: "0.9rem 1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.84375rem", fontWeight: 800, color: "#0f172a" }}>📊 Month-over-Month Growth</span>
          <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.6875rem", fontWeight: 700 }}>
            <span style={{ color: "#2563eb" }}>■ This Month</span>
            <span style={{ color: "#94a3b8" }}>■ Last Month</span>
          </div>
        </div>

        <div className="mom-bar-chart" style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "140px", paddingTop: "1rem" }}>
          <div className="bar-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div className="bars-pair" style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <div className="bar this-month" style={{ width: "16px", height: `${Math.min(100, Math.max(30, displayCallsCount * 0.5))}px`, background: "#2563eb", borderRadius: "3px 3px 0 0" }} />
              <div className="bar last-month" style={{ width: "16px", height: "65px", background: "#cbd5e1", borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b" }}>Calls</span>
          </div>

          <div className="bar-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div className="bars-pair" style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <div className="bar this-month" style={{ width: "16px", height: `${Math.min(100, Math.max(20, displayHotLeads * 3))}px`, background: "#ef4444", borderRadius: "3px 3px 0 0" }} />
              <div className="bar last-month" style={{ width: "16px", height: "25px", background: "#cbd5e1", borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b" }}>Hot Leads</span>
          </div>

          <div className="bar-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div className="bars-pair" style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <div className="bar this-month" style={{ width: "16px", height: `${Math.min(100, Math.max(20, displayVisits * 4))}px`, background: "#f59e0b", borderRadius: "3px 3px 0 0" }} />
              <div className="bar last-month" style={{ width: "16px", height: "20px", background: "#cbd5e1", borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b" }}>Visits</span>
          </div>

          <div className="bar-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
            <div className="bars-pair" style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
              <div className="bar this-month" style={{ width: "16px", height: `${Math.min(100, Math.max(20, closedCount * 6))}px`, background: "#10b981", borderRadius: "3px 3px 0 0" }} />
              <div className="bar last-month" style={{ width: "16px", height: "15px", background: "#cbd5e1", borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b" }}>Closed</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="view-container" style={{ padding: "0.75rem 0.65rem 5.5rem 0.65rem" }}>
      {/* Top Greeting & Status Pill */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "0.875rem",
        padding: "0.75rem 0.85rem",
        marginBottom: "0.65rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#2563eb",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.95rem",
            flexShrink: 0
          }}>
            SP
          </div>
          <div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#0f172a" }}>
              Good afternoon, {greetingName}! 👋
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.15rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.6875rem", color: "#b45309", background: "#fef3c7", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>
                👑 Senior Consultant
              </span>
              <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>
                MahaRERA: A51800045492
              </span>
            </div>
          </div>
        </div>

        <div style={{
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "9999px",
          padding: "0.2rem 0.55rem",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: "0.6875rem", fontWeight: 800, color: "#065f46" }}>24 Active</span>
        </div>
      </div>

      {/* iOS App Segmented Control Tabs (No Endless Scrolling!) */}
      <div style={{
        display: "flex",
        background: "#f1f5f9",
        padding: "3px",
        borderRadius: "0.75rem",
        marginBottom: "0.75rem",
        gap: "3px"
      }}>
        <button
          onClick={() => setActiveSection("overview")}
          style={{
            flex: 1,
            padding: "0.5rem 0.3rem",
            border: "none",
            borderRadius: "0.6rem",
            fontSize: "0.71875rem",
            fontWeight: 800,
            cursor: "pointer",
            background: activeSection === "overview" ? "#2563eb" : "transparent",
            color: activeSection === "overview" ? "#ffffff" : "#475569",
            boxShadow: activeSection === "overview" ? "0 2px 6px rgba(37, 99, 235, 0.35)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
            whiteSpace: "nowrap"
          }}
        >
          <span>⚡ Daily Focus</span>
        </button>

        <button
          onClick={() => setActiveSection("pipeline")}
          style={{
            flex: 1,
            padding: "0.5rem 0.3rem",
            border: "none",
            borderRadius: "0.6rem",
            fontSize: "0.71875rem",
            fontWeight: 800,
            cursor: "pointer",
            background: activeSection === "pipeline" ? "#2563eb" : "transparent",
            color: activeSection === "pipeline" ? "#ffffff" : "#475569",
            boxShadow: activeSection === "pipeline" ? "0 2px 6px rgba(37, 99, 235, 0.35)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
            whiteSpace: "nowrap"
          }}
        >
          <span>📊 Pipeline (3x3)</span>
        </button>

        <button
          onClick={() => setActiveSection("analytics")}
          style={{
            flex: 1,
            padding: "0.5rem 0.3rem",
            border: "none",
            borderRadius: "0.6rem",
            fontSize: "0.71875rem",
            fontWeight: 800,
            cursor: "pointer",
            background: activeSection === "analytics" ? "#2563eb" : "transparent",
            color: activeSection === "analytics" ? "#ffffff" : "#475569",
            boxShadow: activeSection === "analytics" ? "0 2px 6px rgba(37, 99, 235, 0.35)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.3rem",
            whiteSpace: "nowrap"
          }}
        >
          <span>📈 Targets</span>
        </button>

        <button
          onClick={() => setActiveSection("all")}
          style={{
            flex: 0.7,
            padding: "0.5rem 0.3rem",
            border: "none",
            borderRadius: "0.6rem",
            fontSize: "0.71875rem",
            fontWeight: 800,
            cursor: "pointer",
            background: activeSection === "all" ? "#2563eb" : "transparent",
            color: activeSection === "all" ? "#ffffff" : "#475569",
            boxShadow: activeSection === "all" ? "0 2px 6px rgba(37, 99, 235, 0.35)" : "none",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.2rem",
            whiteSpace: "nowrap"
          }}
          title="View all sections in single feed"
        >
          <span>☰ All</span>
        </button>
      </div>

      {/* Render Dynamic Section Based on Segment Tab */}
      {activeSection === "overview" && renderOverviewSection()}
      {activeSection === "pipeline" && renderPipelineSection()}
      {activeSection === "analytics" && renderAnalyticsSection()}
      {activeSection === "all" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {renderOverviewSection()}
          {renderPipelineSection()}
          {renderAnalyticsSection()}
        </div>
      )}
    </div>
  );
}
