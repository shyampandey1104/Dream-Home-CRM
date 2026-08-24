import React, { useState } from "react";
import { MapPin, User, Clock, Phone, Star, Sparkles, AlertCircle, FileSpreadsheet } from "lucide-react";
import FilterBar from "./FilterBar";
import { exportLeadsToExcel } from "../utils/excelExport";

export default function FollowUpsView({ leads, onCallLead }) {
  const [activeCategory, setActiveCategory] = useState("Upcoming");
  const [dateFilter, setDateFilter] = useState("Today");
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [bhkFilter, setBhkFilter] = useState("All BHK Types");
  const [orderFilter, setOrderFilter] = useState("Callback Time");
  const [search, setSearch] = useState("");

  const followupLeads = leads.filter(l => l.status !== "NEW" || l.callCount > 0);

  const interactionTabs = [
    "Upcoming",
    "Missed",
    "Overall",
    "Noty Notes",
    "Pending Follow-ups",
    "Weak Follow-ups",
    "Prime Site Visits",
    "Favorite Leads"
  ];

  const filtered = followupLeads.filter(lead => {
    if (activeCategory === "Upcoming" && lead.status !== "FOLLOWUP_TODAY") return false;
    if (activeCategory === "Missed" && lead.status !== "OVERDUE") return false;
    if (activeCategory === "Favorite Leads" && !lead.isFavorite) return false;
    if (priorityFilter && lead.priority !== priorityFilter) return false;
    if (serviceFilter !== "All Services" && lead.service !== serviceFilter) return false;
    if (bhkFilter !== "All BHK Types" && lead.bhkType !== bhkFilter) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchId = lead.id.toLowerCase().includes(q);
      const matchLoc = lead.location.toLowerCase().includes(q);
      const matchBhk = lead.bhkType ? lead.bhkType.toLowerCase().includes(q) : false;
      if (!matchName && !matchId && !matchLoc && !matchBhk) return false;
    }
    return true;
  });

  return (
    <div className="view-container">
      <div className="view-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <div>
          <h1 className="view-title">
            <span style={{ color: "#f97316" }}>🔄</span> Interactions & Follow-ups
          </h1>
          <p className="view-subtitle">{filtered.length} callbacks and interactions ({activeCategory})</p>
        </div>

        <button
          onClick={() => exportLeadsToExcel(filtered, `Followups_${activeCategory.replace(/\s+/g, '_')}_Report`)}
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            color: "#ffffff",
            border: "none",
            padding: "0.55rem 0.95rem",
            borderRadius: "0.6rem",
            fontSize: "0.8125rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
            transition: "all 0.2s ease"
          }}
          title="Export currently filtered follow-up leads to Excel / CSV"
        >
          <FileSpreadsheet size={16} /> Export Excel ({filtered.length})
        </button>
      </div>

      {/* 8 Interaction Category Sub Tabs Scroll */}
      <div className="sub-tabs-scroll" style={{ marginBottom: "0.875rem" }}>
        {interactionTabs.map(tab => (
          <button
            key={tab}
            className={`sub-tab-chip ${activeCategory === tab ? "active" : ""}`}
            onClick={() => setActiveCategory(tab)}
          >
            {tab === "Upcoming" && "🕒 "}
            {tab === "Missed" && "❌ "}
            {tab === "Overall" && "📊 "}
            {tab === "Noty Notes" && "📝 "}
            {tab === "Pending Follow-ups" && "⏳ "}
            {tab === "Weak Follow-ups" && "⚠️ "}
            {tab === "Prime Site Visits" && "🌟 "}
            {tab === "Favorite Leads" && "⭐ "}
            {tab}
          </button>
        ))}
      </div>

      {/* Modern Filter Toolbar */}
      <FilterBar
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        serviceFilter={serviceFilter} setServiceFilter={setServiceFilter}
        bhkFilter={bhkFilter} setBhkFilter={setBhkFilter}
        orderFilter={orderFilter} setOrderFilter={setOrderFilter}
        search={search} setSearch={setSearch}
        showPriorityPills={true}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
      />

      {/* Cards List */}
      <div className="lead-cards-list">
        {filtered.map((lead) => (
          <div className="lead-card" key={lead.id}>
            <div className="lead-card-left">
              <div className="lead-header-row">
                <span className={`tag-badge ${lead.priority.toLowerCase()}`}>{lead.priority}</span>
                <span className="tag-badge service" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                  🏢 {lead.bhkType || "2 BHK"}
                </span>
                <span className="tag-badge service">{lead.service}</span>
              </div>
              <div className="lead-customer-name">{lead.name}</div>
              <div className="lead-details-row">
                <span className="detail-item">
                  <MapPin size={14} /> {lead.location}
                </span>
                <span className="detail-item">
                  <User size={14} /> {lead.source}
                </span>
                <span className="detail-item">
                  <Clock size={14} /> {lead.timeAgo}
                </span>
              </div>
              {lead.notes && (
                <div style={{ fontSize: "0.75rem", color: "#475569", background: "#f8fafc", padding: "0.35rem 0.5rem", borderRadius: "0.375rem", marginTop: "0.4rem" }}>
                  📝 Note: {lead.notes}
                </div>
              )}
            </div>

            <div className="lead-card-right">
              <div className="call-count-badge">
                <span className="call-count-number">{lead.callCount}</span>
                <span className="call-count-label">Calls</span>
              </div>
              <button
                className="call-btn-green"
                onClick={() => onCallLead(lead)}
              >
                <Phone size={16} />
                <span>Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
