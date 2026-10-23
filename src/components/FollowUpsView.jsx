import React, { useState } from "react";
import { 
  MapPin, User, Clock, Phone, MessageSquare, FileSpreadsheet, UserPlus, 
  Edit3, Trash2, FileDown, FileUp, Search, X, ChevronRight, Info, ShieldCheck,
  AlertCircle, Calendar, PhoneCall
} from "lucide-react";
import { exportLeadsToExcel } from "../utils/excelExport";
import AddLeadModal from "./AddLeadModal";
import ImportLeadsModal from "./ImportLeadsModal";
import { deleteLeadApi } from "../services/apiService";
import { getLeadAvatar } from "../utils/avatarHelper";

export default function FollowUpsView({ 
  leads, 
  onCallLead, 
  onSendReport, 
  onLeadCreated, 
  onLeadUpdated, 
  onLeadDeleted, 
  onLeadsImported, 
  showToast 
}) {
  const [activeTabNav, setActiveTabNav] = useState("priority");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [bhkFilter, setBhkFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isWhatsAppMode, setIsWhatsAppMode] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Leads that have been called or marked for follow-up (excluding CLOSED and NOT_INTERESTED)
  const followUpLeads = React.useMemo(() => {
    return leads.filter(l => 
      (l.status === "FOLLOWUP_TODAY" || l.status === "FOLLOWUP" || l.status === "OVERDUE" || (l.callCount && l.callCount > 0) || l.callbackTime) &&
      l.status !== "CLOSED" &&
      l.status !== "NOT_INTERESTED"
    );
  }, [leads]);

  const filtered = followUpLeads.filter(lead => {
    if (priorityFilter !== "ALL") {
      if (priorityFilter === "OVERDUE") {
        if (lead.status !== "OVERDUE") return false;
      } else if (lead.priority !== priorityFilter) {
        return false;
      }
    }
    if (bhkFilter !== "ALL" && lead.bhkType !== bhkFilter) return false;
    if (locationFilter !== "ALL" && !((lead.location || "").toLowerCase().includes(locationFilter.toLowerCase()))) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const matchName = (lead.name || lead.lead_name || "").toLowerCase().includes(q);
      const matchId = (lead.id || "").toLowerCase().includes(q);
      const matchLoc = (lead.location || "").toLowerCase().includes(q);
      const matchBhk = lead.bhkType ? lead.bhkType.toLowerCase().includes(q) : false;
      const matchNotes = (lead.notes || "").toLowerCase().includes(q);
      if (!matchName && !matchId && !matchLoc && !matchBhk && !matchNotes) return false;
    }
    return true;
  });

  const handleSaveLead = (savedLead) => {
    if (editingLead) {
      if (onLeadUpdated) onLeadUpdated(savedLead);
      if (showToast) showToast(`✅ Follow-up lead '${savedLead.name}' updated successfully!`);
    } else {
      if (onLeadCreated) onLeadCreated(savedLead);
      if (showToast) showToast(`🎉 New Follow-up lead '${savedLead.name}' created successfully!`);
    }
    setIsAddLeadOpen(false);
    setEditingLead(null);
  };

  const executeDelete = async () => {
    if (!leadToDelete) return;
    const targetId = leadToDelete.id;
    const targetName = leadToDelete.name;
    setLeadToDelete(null);
    setSelectedLeadForDrawer(null);
    
    await deleteLeadApi(targetId);
    if (onLeadDeleted) {
      onLeadDeleted(targetId);
    }
    if (showToast) showToast(`🗑️ Follow-up lead '${targetName}' deleted successfully!`);
  };

  const getAvatarUrl = (lead, index) => {
    return getLeadAvatar(lead, index);
  };

  const overdueCount = followUpLeads.filter(l => l.status === "OVERDUE").length;
  const hotCount = followUpLeads.filter(l => l.priority === "HOT").length;
  const warmCount = followUpLeads.filter(l => l.priority === "WARM").length;
  const coldCount = followUpLeads.filter(l => l.priority === "COLD").length;

  return (
    <div className="view-container" style={{ padding: "0.65rem 0.85rem 5rem 0.85rem", background: "#f8fafc", minHeight: "100%" }}>
      {/* Add / Edit Lead Modal */}
      {(isAddLeadOpen || editingLead) && (
        <AddLeadModal
          isOpen={isAddLeadOpen || !!editingLead}
          initialData={editingLead}
          isWhatsAppMode={isWhatsAppMode}
          onClose={() => { setIsAddLeadOpen(false); setEditingLead(null); setIsWhatsAppMode(false); }}
          existingLeads={leads}
          onLeadCreated={handleSaveLead}
        />
      )}

      {/* Import Modal */}
      {isImportOpen && (
        <ImportLeadsModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={(imported) => {
            if (onLeadsImported) onLeadsImported(imported);
            setIsImportOpen(false);
          }}
          showToast={showToast}
        />
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗑️</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
              Delete Follow-up Lead?
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.4 }}>
              Are you sure you want to delete '{leadToDelete.name}' from follow-ups?
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setLeadToDelete(null)}
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
              <button
                onClick={executeDelete}
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
            </div>
          </div>
        </div>
      )}

      {/* 1. SUB-HEADER TAB NAVIGATION (MATCHING FRESH LEADS SPEC) */}
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
          { id: "priority", label: "Priority" },
          { id: "property", label: "Property" },
          { id: "location", label: "Location" },
          { id: "all", label: "All Follow-ups" }
        ].map((tab) => {
          const isActive = activeTabNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabNav(tab.id);
                if (tab.id === "all") {
                  setPriorityFilter("ALL");
                  setBhkFilter("ALL");
                  setLocationFilter("ALL");
                } else if (tab.id === "priority") {
                  setBhkFilter("ALL");
                  setLocationFilter("ALL");
                } else if (tab.id === "property") {
                  setPriorityFilter("ALL");
                  setLocationFilter("ALL");
                } else if (tab.id === "location") {
                  setPriorityFilter("ALL");
                  setBhkFilter("ALL");
                }
              }}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                padding: "0.65rem 0.25rem",
                fontSize: "0.84375rem",
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "#0f172a" : "#64748b",
                borderBottom: isActive ? "2.5px solid #0f172a" : "2.5px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
                marginBottom: "-1.5px",
                textAlign: "center"
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
        {activeTabNav === "priority" && (
          <>
            <button
              onClick={() => setPriorityFilter("ALL")}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: priorityFilter === "ALL" ? "#0f172a" : "#ffffff",
                color: priorityFilter === "ALL" ? "#ffffff" : "#475569",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              All ({followUpLeads.length})
            </button>
            <button
              onClick={() => setPriorityFilter("HOT")}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: priorityFilter === "HOT" ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "rgba(239, 68, 68, 0.12)",
                color: priorityFilter === "HOT" ? "#ffffff" : "#dc2626",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              🔥 HOT ({hotCount})
            </button>
            <button
              onClick={() => setPriorityFilter("WARM")}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: priorityFilter === "WARM" ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" : "rgba(249, 115, 22, 0.12)",
                color: priorityFilter === "WARM" ? "#ffffff" : "#ea580c",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              ⚡ WARM ({warmCount})
            </button>
            <button
              onClick={() => setPriorityFilter("COLD")}
              style={{
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "none",
                background: priorityFilter === "COLD" ? "#2563eb" : "rgba(37, 99, 235, 0.1)",
                color: priorityFilter === "COLD" ? "#ffffff" : "#2563eb",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              ❄️ COLD ({coldCount})
            </button>
            {overdueCount > 0 && (
              <button
                onClick={() => setPriorityFilter("OVERDUE")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: priorityFilter === "OVERDUE" ? "#b91c1c" : "rgba(185, 28, 28, 0.12)",
                  color: priorityFilter === "OVERDUE" ? "#ffffff" : "#b91c1c",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                ⚠️ OVERDUE ({overdueCount})
              </button>
            )}
          </>
        )}

        {activeTabNav === "property" && (
          <>
            {["ALL", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Penthouse / Villa", "Commercial"].map((bhk) => (
              <button
                key={bhk}
                onClick={() => setBhkFilter(bhk)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: bhkFilter === bhk ? "#0f172a" : "#ffffff",
                  color: bhkFilter === bhk ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {bhk === "ALL" ? "All Properties" : bhk}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "location" && (
          <>
            {["ALL", "Bandra", "Andheri", "Worli", "Thane", "Virar", "Mira Road", "Kalyan", "Navi Mumbai"].map((loc) => (
              <button
                key={loc}
                onClick={() => setLocationFilter(loc)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "none",
                  background: locationFilter === loc ? "#0f172a" : "#ffffff",
                  color: locationFilter === loc ? "#ffffff" : "#475569",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {loc === "ALL" ? "All Locations" : loc}
              </button>
            ))}
          </>
        )}

        {activeTabNav === "all" && (
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, padding: "4px 8px" }}>
            Showing {filtered.length} total scheduled follow-up leads
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
            placeholder="Search follow-up lead, BHK, locality, note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              fontSize: "0.8125rem",
              color: "#0f172a",
              width: "100%",
              background: "transparent"
            }}
          />
          {search && (
            <button 
              onClick={() => setSearch("")} 
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px" }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Compact Action Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => { setEditingLead(null); setIsWhatsAppMode(false); setIsAddLeadOpen(true); }}
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
            title="Create Follow-up Lead"
          >
            <UserPlus size={11} /> +Lead
          </button>

          <button
            onClick={() => { setEditingLead(null); setIsWhatsAppMode(true); setIsAddLeadOpen(true); }}
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "4px 7px",
              borderRadius: "8px",
              fontSize: "0.6875rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "3px"
            }}
            title="Auto-Parse WhatsApp Lead"
          >
            <MessageSquare size={11} color="#16a34a" /> WA
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
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
            title="Import Excel Leads"
          >
            <FileUp size={11} />
          </button>

          <button
            onClick={() => exportLeadsToExcel(filtered, "Followups_Today_Report")}
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
            title="Download Follow-ups Excel Report"
          >
            <FileDown size={11} />
          </button>
        </div>
      </div>

      {/* 4. LEADS LIST - PIXEL-PERFECT iOS ROWS MATCHING FRESH LEADS SPEC */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((lead, idx) => {
          const isOverdue = lead.status === "OVERDUE";
          const isHot = lead.priority === "HOT";
          const isWarm = lead.priority === "WARM";
          const avatarImg = getAvatarUrl(lead, idx);

          return (
            <div
              key={lead.id}
              onClick={() => setSelectedLeadForDrawer(lead)}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "10px 14px",
                border: isOverdue ? "1px solid #fecaca" : "1px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.12s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"}
            >
              {/* Left Side: Priority / Overdue Badge + Circular Avatar + Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                {/* Priority / Status Badge */}
                <div style={{ width: "52px", flexShrink: 0, textAlign: "center" }}>
                  {isOverdue ? (
                    <span style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
                      color: "#ffffff",
                      padding: "2.5px 6px",
                      borderRadius: "9999px",
                      fontSize: "0.58rem",
                      fontWeight: 800,
                      letterSpacing: "0.3px",
                      display: "inline-block",
                      boxShadow: "0 2px 5px rgba(220, 38, 38, 0.3)"
                    }}>
                      OVERDUE
                    </span>
                  ) : isHot ? (
                    <span style={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "#ffffff",
                      padding: "2.5px 7px",
                      borderRadius: "9999px",
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      display: "inline-block",
                      boxShadow: "0 2px 5px rgba(239, 68, 68, 0.3)"
                    }}>
                      HOT
                    </span>
                  ) : isWarm ? (
                    <span style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      color: "#ffffff",
                      padding: "2.5px 7px",
                      borderRadius: "9999px",
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      display: "inline-block",
                      boxShadow: "0 2px 5px rgba(249, 115, 22, 0.3)"
                    }}>
                      WARM
                    </span>
                  ) : (
                    <span style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "2.5px 7px",
                      borderRadius: "9999px",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      display: "inline-block",
                      border: "1px solid #bfdbfe"
                    }}>
                      {lead.status === "FOLLOWUP_TODAY" ? "TODAY" : "CALL"}
                    </span>
                  )}
                </div>

                {/* Circular Profile Avatar Image */}
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0, position: "relative" }}>
                  <img
                    src={avatarImg}
                    alt={lead.name}
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ffffff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: "none",
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                  }}>
                    {(lead.name || lead.lead_name || "CL").slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Lead Details */}
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                  <div style={{
                    fontSize: "0.9375rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>{lead.name || lead.lead_name || "Client"}</span>
                    {lead.callCount > 0 && (
                      <span style={{ fontSize: "0.625rem", color: "#64748b", fontWeight: 600 }}>
                        ({lead.callCount} calls)
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: "0.75rem",
                    color: isOverdue ? "#b91c1c" : "#2563eb",
                    fontWeight: 700,
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>⏰</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lead.callbackTime ? `Callback: ${lead.callbackTime}` : (isOverdue ? "Overdue Callback Required" : "Scheduled Follow-up Today")}
                    </span>
                  </div>

                  <div style={{
                    fontSize: "0.6875rem",
                    color: "#64748b",
                    fontWeight: 600,
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>🏠</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lead.bhkType ? `${lead.bhkType} Property` : "2 BHK Property"} • {lead.location || "Mumbai"}
                    </span>
                  </div>

                  {lead.notes && (
                    <div style={{
                      fontSize: "0.65rem",
                      color: "#94a3b8",
                      fontStyle: "italic",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      💬 "{lead.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: 1-Tap WhatsApp + Dark Circular Call Button */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {/* 1-Tap WhatsApp Report Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSendReport) {
                      onSendReport(lead);
                    } else {
                      window.open(`https://api.whatsapp.com/send?phone=${(lead.phone || '').replace(/\D/g, '')}`, '_blank');
                    }
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.1s ease"
                  }}
                  title="Send WhatsApp Report / Brochure"
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <MessageSquare size={16} color="#16a34a" />
                </button>

                {/* Dark Circular Call Button (Direct Phone In-Call UI) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCallLead(lead);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#0f172a",
                    border: "none",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.35)",
                    transition: "transform 0.1s ease"
                  }}
                  title={`Direct Call ${lead.name}`}
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Phone size={15} fill="#ffffff" color="#ffffff" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "2.5rem 1rem",
            background: "#ffffff",
            borderRadius: "1rem",
            border: "1.5px dashed #cbd5e1",
            margin: "0.5rem 0"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
              No Follow-ups Matching Filter
            </h4>
            <p style={{ fontSize: "0.78125rem", color: "#64748b", maxWidth: "260px", margin: "0 auto 1rem" }}>
              Try selecting 'All Follow-ups' or schedule a callback from Fresh Leads.
            </p>
            <button
              onClick={() => { setPriorityFilter("ALL"); setBhkFilter("ALL"); setLocationFilter("ALL"); setSearch(""); }}
              style={{
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.78125rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. QUICK SLIDE-UP LEAD DETAIL SHEET (OPENED BY CLICKING ROW) */}
      {selectedLeadForDrawer && (
        <div 
          onClick={() => setSelectedLeadForDrawer(null)}
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
              animation: "slideUp 0.2s ease"
            }}
          >
            {/* Grabber Bar */}
            <div style={{ width: "36px", height: "4px", borderRadius: "9999px", background: "#cbd5e1", margin: "0 auto 1rem auto" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>
                  {selectedLeadForDrawer.name}
                </h3>
                <div style={{ fontSize: "0.8125rem", color: "#64748b", fontWeight: 600 }}>
                  {selectedLeadForDrawer.phone} • {selectedLeadForDrawer.location}
                </div>
              </div>
              <button 
                onClick={() => setSelectedLeadForDrawer(null)}
                style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={16} color="#64748b" />
              </button>
            </div>

            {/* Requirement Badges */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                🏢 {selectedLeadForDrawer.bhkType || "2 BHK"}
              </span>
              <span style={{ background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                📍 {selectedLeadForDrawer.location}
              </span>
              <span style={{ background: "#fef3c7", color: "#b45309", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
                ⚡ {selectedLeadForDrawer.priority || "HOT"}
              </span>
              {selectedLeadForDrawer.callbackTime && (
                <span style={{ background: "#fdf2f8", color: "#be185d", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid #fbcfe8" }}>
                  ⏰ Callback: {selectedLeadForDrawer.callbackTime}
                </span>
              )}
            </div>

            {/* Notes Section */}
            {selectedLeadForDrawer.notes && (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1rem", fontSize: "0.8125rem", color: "#334155" }}>
                <div style={{ fontWeight: 700, marginBottom: "4px", color: "#0f172a" }}>Follow-up Discussion Notes:</div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4 }}>{selectedLeadForDrawer.notes}</div>
              </div>
            )}

            {/* Status Selector */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.35rem" }}>
                Update Pipeline Status:
              </label>
              <select
                value={selectedLeadForDrawer.status || "FOLLOWUP"}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  const updated = { ...selectedLeadForDrawer, status: newStatus };
                  setSelectedLeadForDrawer(updated);
                  if (onLeadUpdated) onLeadUpdated(updated);
                  if (showToast) showToast(`Updated '${updated.name}' to ${newStatus}`);
                }}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "#ffffff"
                }}
              >
                <option value="FOLLOWUP">FOLLOWUP - Callback Scheduled</option>
                <option value="FOLLOWUP_TODAY">FOLLOWUP TODAY - Urgent Action</option>
                <option value="OVERDUE">OVERDUE - Escalated</option>
                <option value="NEW">NEW - Send to Fresh Leads</option>
                <option value="CLOSED">CLOSED - Deal Won 🎉</option>
                <option value="NOT_INTERESTED">NOT_INTERESTED - Archive</option>
              </select>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <button
                onClick={() => {
                  const leadToCall = selectedLeadForDrawer;
                  setSelectedLeadForDrawer(null);
                  onCallLead(leadToCall);
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
                <Phone size={16} fill="#ffffff" /> Call Client
              </button>

              <button
                onClick={() => {
                  const leadToReport = selectedLeadForDrawer;
                  setSelectedLeadForDrawer(null);
                  if (onSendReport) {
                    onSendReport(leadToReport);
                  } else {
                    window.open(`https://api.whatsapp.com/send?phone=${(leadToReport.phone || '').replace(/\D/g, '')}`, '_blank');
                  }
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
                <MessageSquare size={16} /> WhatsApp
              </button>
            </div>

            {/* Edit / Delete Secondary Row */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  setEditingLead(selectedLeadForDrawer);
                  setSelectedLeadForDrawer(null);
                }}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#334155",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}
              >
                <Edit3 size={14} /> Edit Lead
              </button>

              <button
                onClick={() => {
                  setLeadToDelete(selectedLeadForDrawer);
                }}
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
