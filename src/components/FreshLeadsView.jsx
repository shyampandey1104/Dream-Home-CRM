import React, { useState } from "react";
import { 
  MapPin, User, Clock, Phone, MessageSquare, FileSpreadsheet, UserPlus, 
  Edit3, Trash2, FileDown, FileUp, Search, X, ChevronRight, Info, ShieldCheck
} from "lucide-react";
import { exportLeadsToExcel } from "../utils/excelExport";
import AddLeadModal from "./AddLeadModal";
import ImportLeadsModal from "./ImportLeadsModal";
import { deleteLeadApi } from "../services/apiService";

const AVATAR_LIST = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", // Male executive
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", // Female professional
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", // Male professional
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", // Female professional
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", // Male
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80", // Female
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", // Male businessman
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", // Female
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"  // Male
];

export default function FreshLeadsView({ 
  leads, 
  onCallLead, 
  onSendReport, 
  onLeadCreated, 
  onLeadUpdated, 
  onLeadDeleted, 
  onLeadsImported, 
  showToast 
}) {
  const [activeTabNav, setActiveTabNav] = useState("priority"); // 'priority' | 'property' | 'location' | 'all'
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [bhkFilter, setBhkFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isWhatsAppMode, setIsWhatsAppMode] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState(null);
  const [alertConfig, setAlertConfig] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Show fresh leads (status NEW or uncalled)
  const allFreshLeads = React.useMemo(() => {
    return leads.filter(l => l.status === "NEW" || !l.status || l.callCount === 0 || !l.callCount);
  }, [leads]);

  const filtered = allFreshLeads.filter(lead => {
    if (priorityFilter !== "ALL" && lead.priority !== priorityFilter) return false;
    if (bhkFilter !== "ALL" && lead.bhkType !== bhkFilter) return false;
    if (locationFilter !== "ALL" && !((lead.location || "").toLowerCase().includes(locationFilter.toLowerCase()))) return false;
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

  const handleSaveLead = (savedLead) => {
    if (editingLead) {
      if (onLeadUpdated) onLeadUpdated(savedLead);
      if (showToast) showToast(`✅ Lead '${savedLead.name}' updated successfully!`);
    } else {
      if (onLeadCreated) onLeadCreated(savedLead);
      if (showToast) showToast(`🎉 Fresh Lead '${savedLead.name}' created successfully!`);
    }
    setIsAddLeadOpen(false);
    setEditingLead(null);
    setSelectedLeadForDrawer(null);
  };

  const handleImportLeads = (newLeads) => {
    if (onLeadsImported) {
      onLeadsImported(newLeads);
    } else if (onLeadCreated) {
      newLeads.forEach(l => onLeadCreated(l));
    }
    if (showToast) showToast(`📥 Imported ${newLeads.length} leads into CRM Database!`);
  };

  const confirmDelete = (lead) => {
    setLeadToDelete(lead);
    setAlertConfig({
      title: "Delete Lead?",
      message: `Are you sure you want to delete lead '${lead.name}' (${lead.id}) from the database?`,
      type: "warning",
      showConfirm: true
    });
  };

  const executeDelete = async () => {
    if (!leadToDelete) return;
    const targetId = leadToDelete.id;
    const targetName = leadToDelete.name;
    setAlertConfig(null);
    setLeadToDelete(null);
    setSelectedLeadForDrawer(null);
    
    await deleteLeadApi(targetId);
    if (onLeadDeleted) {
      onLeadDeleted(targetId);
    }
    if (showToast) showToast(`🗑️ Lead '${targetName}' deleted successfully!`);
  };

  const getAvatarUrl = (lead, index) => {
    if (lead.avatar) return lead.avatar;
    const hash = Math.abs((lead.id || lead.name || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), index));
    return AVATAR_LIST[hash % AVATAR_LIST.length];
  };

  return (
    <div className="view-container" style={{ padding: "0.65rem 0.85rem 5rem 0.85rem", background: "#f8fafc", minHeight: "100%" }}>
      {/* Add / Edit Lead Modal */}
      {(isAddLeadOpen || editingLead) && (
        <AddLeadModal
          isOpen={isAddLeadOpen || !!editingLead}
          initialData={editingLead}
          isWhatsAppMode={isWhatsAppMode}
          onClose={() => {
            setIsAddLeadOpen(false);
            setEditingLead(null);
            setIsWhatsAppMode(false);
          }}
          existingLeads={leads}
          onLeadCreated={handleSaveLead}
        />
      )}

      {/* Import Leads from Excel Modal */}
      <ImportLeadsModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        existingLeads={leads}
        onLeadsImported={handleImportLeads}
      />

      {/* Confirmation & Alert Dialog */}
      {alertConfig && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.8)",
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗑️</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
              {alertConfig.title}
            </h3>
            <p style={{ fontSize: "0.84375rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.4 }}>
              {alertConfig.message}
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => { setAlertConfig(null); setLeadToDelete(null); }}
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

      {/* 1. SUB-HEADER TAB NAVIGATION (MATCHING SHOWCASE COLLAGE IMAGE 2) */}
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
          { id: "all", label: "All Leads" }
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
              All ({allFreshLeads.length})
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
              🔥 HOT ({allFreshLeads.filter(l => l.priority === "HOT").length})
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
              ⚡ WARM ({allFreshLeads.filter(l => l.priority === "WARM").length})
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
              ❄️ COLD ({allFreshLeads.filter(l => l.priority === "COLD").length})
            </button>
          </>
        )}

        {activeTabNav === "property" && (
          <>
            {["ALL", "2 BHK", "3 BHK", "4 BHK", "Penthouse / Villa"].map((bhk) => (
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
            {["ALL", "Bandra", "Andheri", "Worli", "Thane", "Navi Mumbai"].map((loc) => (
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
            Showing {filtered.length} total uncontacted fresh leads
          </span>
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
        {/* Search input */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}>
          <Search size={15} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search lead, BHK, location..."
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
            title="Create Fresh Lead"
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
            onClick={() => exportLeadsToExcel(filtered, "Fresh_Leads_Report")}
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

      {/* 4. LEADS LIST - PIXEL-PERFECT iOS ROWS MATCHING SHOWCASE COLLAGE (IMAGE 2) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map((lead, idx) => {
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
                border: "1px solid #f1f5f9",
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
              {/* Left Side: Priority Badge + Circular Photo Avatar + Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                {/* Priority Badge */}
                <div style={{ width: "46px", flexShrink: 0, textAlign: "center" }}>
                  {isHot ? (
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
                      background: "#f1f5f9",
                      color: "#64748b",
                      padding: "2.5px 7px",
                      borderRadius: "9999px",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      display: "inline-block",
                      border: "1px solid #e2e8f0"
                    }}>
                      {lead.timeAgo ? (lead.timeAgo.includes("hour") ? "10:15 AM" : "NEW") : "NEW"}
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
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                  }}>
                    {(lead.name || "CL").slice(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Lead Info */}
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                  <div style={{
                    fontSize: "0.9375rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {lead.name || lead.lead_name || "Client"}
                  </div>
                  <div style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 600,
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>🏠</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lead.bhkType ? `${lead.bhkType} Property` : "3 BHK Property"}
                    </span>
                  </div>
                  <div style={{
                    fontSize: "0.6875rem",
                    color: "#94a3b8",
                    fontWeight: 500,
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span>📍</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {lead.source?.toLowerCase().includes("rera") ? "MahaRERA Registered" : (lead.location ? `${lead.location} • MahaRERA Registered` : "MahaRERA Registered")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: 1-Tap WhatsApp + Dark Circular Call Button (Matching Image 2) */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                {/* 1-Tap WhatsApp Report Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendReport(lead);
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
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#1e293b",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 3px 10px rgba(30, 41, 59, 0.3)",
                    transition: "transform 0.1s ease, background 0.15s ease"
                  }}
                  title="Call Lead Now"
                  onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.92)"}
                  onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <Phone size={17} fill="#ffffff" color="#ffffff" />
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
              No Leads Matching Filter
            </h4>
            <p style={{ fontSize: "0.78125rem", color: "#64748b", maxWidth: "260px", margin: "0 auto 1rem" }}>
              Try selecting 'All Leads' or add a fresh lead to start calling.
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
              <span style={{ background: "#f8fafc", color: "#475569", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #e2e8f0" }}>
                Source: {selectedLeadForDrawer.source}
              </span>
            </div>

            {/* Notes Section */}
            {selectedLeadForDrawer.notes && (
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1rem", fontSize: "0.8125rem", color: "#334155" }}>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>📝 Notes:</div>
                {selectedLeadForDrawer.notes}
              </div>
            )}

            {/* Full Action Buttons inside Drawer */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "0.75rem" }}>
              <button
                onClick={() => {
                  const target = selectedLeadForDrawer;
                  setSelectedLeadForDrawer(null);
                  onCallLead(target);
                }}
                style={{
                  background: "#1e293b",
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
                  gap: "6px"
                }}
              >
                <Phone size={16} fill="#ffffff" /> Call Now
              </button>

              <button
                onClick={() => {
                  const target = selectedLeadForDrawer;
                  setSelectedLeadForDrawer(null);
                  onSendReport(target);
                }}
                style={{
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
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
                  gap: "6px"
                }}
              >
                <MessageSquare size={16} /> WhatsApp
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  const target = selectedLeadForDrawer;
                  setSelectedLeadForDrawer(null);
                  setEditingLead(target);
                }}
                style={{
                  flex: 1,
                  background: "#f1f5f9",
                  color: "#1e293b",
                  border: "none",
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.78125rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px"
                }}
              >
                <Edit3 size={14} /> Edit Details
              </button>

              <button
                onClick={() => {
                  const target = selectedLeadForDrawer;
                  confirmDelete(target);
                }}
                style={{
                  flex: 1,
                  background: "#fef2f2",
                  color: "#dc2626",
                  border: "none",
                  padding: "0.55rem",
                  borderRadius: "10px",
                  fontSize: "0.78125rem",
                  fontWeight: 700,
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
