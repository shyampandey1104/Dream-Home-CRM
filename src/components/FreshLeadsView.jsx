import React, { useState } from "react";
import { MapPin, User, Clock, Phone, Send, MessageSquare, Building, FileSpreadsheet, UserPlus } from "lucide-react";
import FilterBar from "./FilterBar";
import { exportLeadsToExcel } from "../utils/excelExport";
import AddLeadModal from "./AddLeadModal";

export default function FreshLeadsView({ leads, onCallLead, onSendReport, onLeadCreated }) {
  const [dateFilter, setDateFilter] = useState("Today");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [bhkFilter, setBhkFilter] = useState("All BHK Types");
  const [orderFilter, setOrderFilter] = useState("Freshest First");
  const [search, setSearch] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [customLeads, setCustomLeads] = useState([]);

  const allFreshLeads = [...customLeads, ...leads.filter(l => l.status === "NEW" || l.callCount === 0)];

  const filtered = allFreshLeads.filter(lead => {
    if (sourceFilter !== "All Sources" && lead.source !== sourceFilter) return false;
    if (serviceFilter !== "All Services" && lead.service !== serviceFilter) return false;
    if (bhkFilter !== "All BHK Types" && lead.bhkType !== bhkFilter) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchName = (lead.name || lead.lead_name || "").toLowerCase().includes(q);
      const matchId = (lead.id || "").toLowerCase().includes(q);
      const matchLoc = (lead.location || "").toLowerCase().includes(q);
      const matchBhk = lead.bhkType ? lead.bhkType.toLowerCase().includes(q) : false;
      if (!matchName && !matchId && !matchLoc && !matchBhk) return false;
    }
    return true;
  });

  const handleNewLeadCreated = (newLead) => {
    setCustomLeads(prev => [newLead, ...prev]);
    if (onLeadCreated) {
      onLeadCreated(newLead);
    }
  };

  return (
    <div className="view-container">
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onLeadCreated={handleNewLeadCreated}
      />

      <div className="view-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        <div>
          <h1 className="view-title">
            <span style={{ color: "#2563eb" }}>✨</span> Fresh Leads
          </h1>
          <p className="view-subtitle">{filtered.length} leads that have never been contacted</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              transition: "all 0.2s ease"
            }}
          >
            <UserPlus size={16} /> + Create Lead
          </button>

          <button
            onClick={() => exportLeadsToExcel(filtered, "Fresh_Leads_Report")}
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
            title="Export currently filtered fresh leads to Excel / CSV"
          >
            <FileSpreadsheet size={16} /> Export Excel ({filtered.length})
          </button>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <FilterBar
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        sourceFilter={sourceFilter} setSourceFilter={setSourceFilter}
        serviceFilter={serviceFilter} setServiceFilter={setServiceFilter}
        bhkFilter={bhkFilter} setBhkFilter={setBhkFilter}
        orderFilter={orderFilter} setOrderFilter={setOrderFilter}
        search={search} setSearch={setSearch}
      />

      {/* Cards List */}
      <div className="lead-cards-list">
        {filtered.map((lead) => (
          <div className="lead-card" key={lead.id}>
            <div className="lead-card-left">
              <div className="lead-header-row">
                <span className="tag-badge new">NEW</span>
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
            </div>

            <div className="lead-card-right">
              <button 
                className="send-report-btn" 
                style={{ borderColor: "#22c55e", color: "#15803d", background: "#f0fdf4" }} 
                onClick={() => onSendReport(lead)}
                title="Send WhatsApp Property Report / Brochure"
              >
                <MessageSquare size={15} color="#22c55e" />
                <span>WhatsApp</span>
              </button>

              <button className="call-now-btn" onClick={() => onCallLead(lead)}>
                <Phone size={18} />
                <span>Call</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            No fresh leads match the selected BHK / Property filters.
          </div>
        )}
      </div>
    </div>
  );
}
