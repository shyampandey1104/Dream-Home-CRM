import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MobileHeader from "./components/MobileHeader";
import MobileBottomNav from "./components/MobileBottomNav";
import PerformanceView from "./components/PerformanceView";
import TodaysActionsView from "./components/TodaysActionsView";
import FreshLeadsView from "./components/FreshLeadsView";
import FollowUpsView from "./components/FollowUpsView";
import PropertiesView from "./components/PropertiesView";
import ActivitiesView from "./components/ActivitiesView";
import SidebarDrawer from "./components/SidebarDrawer";
import ColdCallingModal from "./components/ColdCallingModal";
import WorkAttendanceModal from "./components/WorkAttendanceModal";
import BusinessCardModal from "./components/BusinessCardModal";
import TCFModal from "./components/TCFModal";
import MCFModal from "./components/MCFModal";
import ClaimLeadsModal from "./components/ClaimLeadsModal";
import DialerModal from "./components/DialerModal";
import InboundCallModal from "./components/InboundCallModal";
import WhatsAppReportModal from "./components/WhatsAppReportModal";
import NotificationsModal from "./components/NotificationsModal";
import UserProfileModal from "./components/UserProfileModal";
import GptAssistantModal from "./components/GptAssistantModal";
import MeetingLocationModal from "./components/MeetingLocationModal";
import StoriesHighlightsModal from "./components/StoriesHighlightsModal";
import RealEstateCalculatorModal from "./components/RealEstateCalculatorModal";
import InstallAppModal from "./components/InstallAppModal";
import LoginScreen from "./components/LoginScreen";
import AdminPortal from "./components/AdminPortal";
import IntegrationsModal from "./components/IntegrationsModal";
import { Signal, Wifi, Battery } from "lucide-react";

import {
  getStoredLeads,
  saveStoredLeads,
  getStoredMetrics,
  saveStoredMetrics,
  syncWithFrappeBackend,
  fetchCrmLeads,
  fetchCrmMetrics,
  fetchCrmNotifications,
  fetchOrgProfile,
  claimLeadsApi
} from "./services/apiService";
import { SOCIAL_LEAD_TEMPLATES, INITIAL_LEADS } from "./services/mockData";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("crm_is_authenticated") === "true";
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("crm_user_profile");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          parsed.phone = parsed.mobile_no || parsed.phone || "+91 84240 12185";
          if (!parsed.email) parsed.email = "shyampandey1104@gmail.com";
          return parsed;
        }
      } catch (e) {}
    }
    return {
      name: "Shyam Pandey",
      email: "shyampandey1104@gmail.com",
      phone: "+91 84240 12185",
      role: "Senior Sales Consultant",
      initials: "SP",
      areas: ["Andheri", "Bandra", "Goregaon"]
    };
  });

  const [orgProfile, setOrgProfile] = useState(null);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("crm_view_mode") || "telecaller";
  });

  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem("crm_active_tab") || "dashboard";
  });

  const handleSetTab = (tab) => {
    setCurrentTab(tab);
    localStorage.setItem("crm_active_tab", tab);
  };

  const [leads, setLeads] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [isMobileView, setIsMobileView] = useState(false);
  const [isRealMobile, setIsRealMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });

  useEffect(() => {
    const handleResize = () => {
      setIsRealMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Modals & Drawers state
  const [showSidebar, setShowSidebar] = useState(false);
  const [showColdDialer, setShowColdDialer] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showBusinessCardModal, setShowBusinessCardModal] = useState(false);
  const [showTCFModal, setShowTCFModal] = useState(false);
  const [showMCFModal, setShowMCFModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showGptModal, setShowGptModal] = useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showStoriesModal, setShowStoriesModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const [activeCallLead, setActiveCallLead] = useState(null);
  const [incomingCallLead, setIncomingCallLead] = useState(null);
  const [reportLead, setReportLead] = useState(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Direct Call Alert: Shyam (+91 98200 44556) 📞",
      message: "Client Rajesh Kumar (+91 98201 11223) called directly on Shyam's line regarding Kalpataru Vian 3BHK.",
      source: "Direct Employee Call",
      employeeName: "Shyam",
      employeePhone: "+91 98200 44556",
      type: "call",
      timeAgo: "2 mins ago",
      read: false,
      lead: INITIAL_LEADS[2]
    },
    {
      id: 2,
      title: "Direct Call Alert: Priya Sharma (+91 98920 11223) 📞",
      message: "Client Aarav Sharma (+91 98205 91823) called directly on Priya's assigned line regarding Bandra 3BHK Penthouse.",
      source: "Direct Employee Call",
      employeeName: "Priya Sharma",
      employeePhone: "+91 98920 11223",
      type: "call",
      timeAgo: "10 mins ago",
      read: false,
      lead: INITIAL_LEADS[0]
    },
    {
      id: 3,
      title: "Direct Call Alert: Rajesh Kumar (+91 98920 33445) 📞",
      message: "Client Deepak Reddy (+91 98921 00987) called directly on Rajesh's line for Thane Site Visit.",
      source: "Direct Employee Call",
      employeeName: "Rajesh Kumar",
      employeePhone: "+91 98920 33445",
      type: "call",
      timeAgo: "25 mins ago",
      read: false,
      lead: INITIAL_LEADS[1]
    }
  ]);

  useEffect(() => {
    const userEmail = userProfile?.email || "shyampandey1104@gmail.com";

    const syncLiveData = () => {
      // Don't poll and trigger re-renders if user is currently on a call or filling disposition form
      if (activeCallLead) return;
      fetchCrmLeads(userEmail).then((data) => {
        if (data && data.length > 0) setLeads(data);
      });
    };

    syncLiveData();
    const pollInterval = setInterval(syncLiveData, 15000);

    fetchCrmMetrics().then((data) => {
      if (data) setMetrics(data);
      else setMetrics(getStoredMetrics());
    });

    fetchCrmNotifications().then((notifs) => {
      if (notifs && notifs.length > 0) {
        setNotifications(notifs);
      }
    });

    fetchOrgProfile().then((data) => {
      if (data) setOrgProfile(data);
    });

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => clearInterval(pollInterval);
  }, [userProfile?.email, activeCallLead]);

  const handleLoginSuccess = (profile) => {
    const defaultProfile = {
      name: profile?.name || "Shyam Pandey",
      email: profile?.email || "shyampandey1104@gmail.com",
      phone: profile?.mobile_no || profile?.phone || "+91 84240 12185",
      role: profile?.role || "Senior Sales Consultant",
      initials: profile?.initials || "SP",
      areas: profile?.areas || ["Andheri", "Bandra", "Goregaon"]
    };
    setUserProfile(defaultProfile);
    setIsAuthenticated(true);
    const mode = (defaultProfile.role && (defaultProfile.role.includes("Manager") || defaultProfile.role.includes("Admin"))) ? "admin" : "telecaller";
    setViewMode(mode);

    localStorage.setItem("crm_is_authenticated", "true");
    localStorage.setItem("crm_user_profile", JSON.stringify(defaultProfile));
    localStorage.setItem("crm_view_mode", mode);
    showToast(`Logged in as ${defaultProfile.name} (${defaultProfile.role})`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setViewMode("telecaller");
    setShowProfileModal(false);

    localStorage.removeItem("crm_is_authenticated");
    localStorage.removeItem("crm_user_profile");
    localStorage.removeItem("crm_view_mode");
    localStorage.removeItem("crm_active_tab");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Detect Return from Native iPhone/Android SIM Phone Calls
  useEffect(() => {
    const handleNativeCallReturn = () => {
      if (document.visibilityState === "visible") {
        const savedNativeLeadJson = sessionStorage.getItem("crm_pending_native_call_lead");
        if (savedNativeLeadJson) {
          try {
            const savedLead = JSON.parse(savedNativeLeadJson);
            sessionStorage.removeItem("crm_pending_native_call_lead");
            setActiveCallLead((prev) => {
              if (prev && prev.id === savedLead.id) return prev;
              return savedLead;
            });
          } catch (e) {}
        }
      }
    };

    document.addEventListener("visibilitychange", handleNativeCallReturn);

    return () => {
      document.removeEventListener("visibilitychange", handleNativeCallReturn);
    };
  }, []);

  const handleCallLead = (lead) => {
    if (!lead) return;
    const phoneNum = lead.phone ? lead.phone.replace(/[^0-9+]/g, "") : "+919820591823";
    
    // Only trigger tel: scheme on real touch/mobile devices so desktop browser does not lose window focus or open FaceTime
    const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
      sessionStorage.setItem("crm_pending_native_call_lead", JSON.stringify(lead));
      window.location.href = `tel:${phoneNum}`;
    }
    
    setActiveCallLead(lead);
  };

  const handleSaveCall = async ({ leadId, duration, outcome, bhkType, notes, followupDate, recordedAudioUrl }) => {
    const updatedLeads = leads.map(l => {
      if (l.id === leadId) {
        const newCallCount = l.callCount + 1;
        let newStatus = l.status;
        if (outcome === "Deal Closed (Won)") {
          newStatus = "CLOSED";
        } else if (followupDate) {
          newStatus = "FOLLOWUP_TODAY";
        } else {
          newStatus = "FOLLOWUP";
        }

        const newHistory = [
          {
            date: "Just now",
            outcome: outcome,
            duration: duration,
            recordedAudioUrl: recordedAudioUrl,
            note: notes || `Outcome: ${outcome}`
          },
          ...(Array.isArray(l.history) ? l.history : [])
        ];

        return {
          ...l,
          callCount: newCallCount,
          status: newStatus,
          bhkType: bhkType || l.bhkType,
          notes: notes || l.notes,
          callbackTime: followupDate || l.callbackTime,
          recordedAudioUrl: recordedAudioUrl,
          history: newHistory
        };
      }
      return l;
    });

    setLeads(updatedLeads);
    saveStoredLeads(updatedLeads);

    const newMetrics = {
      ...metrics,
      mtdCallsMade: metrics.mtdCallsMade + 1,
      followupsDone: followupDate ? metrics.followupsDone + 1 : metrics.followupsDone
    };
    setMetrics(newMetrics);
    saveStoredMetrics(newMetrics);

    await syncWithFrappeBackend("log_call", {
      lead_id: leadId,
      duration,
      outcome,
      bhk_type: bhkType,
      notes,
      followup_date: followupDate,
      recordedAudioUrl
    });

    showToast(`🎙️ Call logged & live recording saved successfully for ${leadId}!`);
    setActiveCallLead(null);
  };

  const simulateSocialInboundLead = () => {
    const template = SOCIAL_LEAD_TEMPLATES[Math.floor(Math.random() * SOCIAL_LEAD_TEMPLATES.length)];
    const newLeadId = `LEAD-00${Math.floor(10 + Math.random() * 89)}`;

    const newLeadObj = {
      id: newLeadId,
      name: template.name,
      phone: template.phone,
      email: `${template.name.toLowerCase().replace(" ", ".")}@gmail.com`,
      priority: template.priority,
      status: "NEW",
      service: template.service,
      bhkType: template.bhkType,
      location: template.location,
      source: template.source,
      timeAgo: "Just now",
      createdAt: new Date().toISOString(),
      callCount: 0,
      callbackTime: null,
      notes: template.notes,
      history: []
    };

    setIncomingCallLead(newLeadObj);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Inbound Call from ${newLeadObj.name}`, {
        body: `${newLeadObj.source} | ${newLeadObj.service} (${newLeadObj.bhkType})`,
        icon: "/favicon.ico"
      });
    }

    const newNotification = {
      id: Date.now(),
      title: `Inbound Call: ${newLeadObj.name}`,
      message: `${newLeadObj.source} - ${newLeadObj.service} (${newLeadObj.location})`,
      source: newLeadObj.source,
      timeAgo: "Just now",
      read: false,
      lead: newLeadObj
    };
    setNotifications(prev => [newNotification, ...prev]);

    syncWithFrappeBackend("create_lead", newLeadObj);
  };

  const handleAcceptIncomingCall = (lead) => {
    const updated = [lead, ...leads.filter(l => l.id !== lead.id)];
    setLeads(updated);
    saveStoredLeads(updated);
    setIncomingCallLead(null);
    setActiveCallLead(lead);
  };

  const handleClaimLeads = () => {
    setShowClaimModal(true);
  };

  const handleConfirmClaim = async (selectedLeadObjs, ptsUsed) => {
    const currentPoints = metrics?.rewardPoints ?? 2400;
    const currentUsed = metrics?.usedPoints ?? 0;
    const currentUnclaimed = metrics?.unclaimedCount ?? 5;

    const leadCount = Array.isArray(selectedLeadObjs) ? selectedLeadObjs.length : selectedLeadObjs;
    const newBalance = Math.max(0, currentPoints - ptsUsed);
    const newUsed = currentUsed + ptsUsed;
    const newUnclaimed = Math.max(0, currentUnclaimed - leadCount);

    const updatedMetrics = {
      ...metrics,
      rewardPoints: newBalance,
      usedPoints: newUsed,
      unclaimedCount: newUnclaimed
    };

    setMetrics(updatedMetrics);
    saveStoredMetrics(updatedMetrics);

    const poolData = Array.isArray(selectedLeadObjs) ? selectedLeadObjs : [
      { name: "Kiran Bhat", bhk: "2 BHK", location: "Andheri West" },
      { name: "Siddharth Malhotra", bhk: "3 BHK", location: "Lokhandwala" },
      { name: "Ananya Panday", bhk: "2 BHK", location: "Bandra Sea View" },
      { name: "Vikramaditya Roy", bhk: "4 BHK", location: "Worli Sea Face" },
      { name: "Radhika Merchant", bhk: "3 BHK Luxury", location: "Thane West" }
    ];

    const newlyClaimedLeads = poolData.slice(0, leadCount).map((item, idx) => ({
      id: `CLAIMED-00${idx + 1}`,
      name: item.name,
      lead_name: item.name,
      phone: item.phone || `+91 98200 ${12345 + idx * 111}`,
      email: `${item.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      service: item.service || "Home Buying",
      bhkType: item.bhk || item.bhkType || "2 BHK",
      bhk_type: item.bhk || item.bhkType || "2 BHK",
      location: item.location || "Mumbai",
      priority: "HOT",
      status: "NEW",
      timeAgo: "Just Claimed",
      callCount: 0,
      assigned_to: userProfile?.id || "shyampandey1104@gmail.com",
      notes: "Claimed using Reward Points via CRM Pool"
    }));

    const updatedLeadsList = [...newlyClaimedLeads, ...leads];
    setLeads(updatedLeadsList);
    saveStoredLeads(updatedLeadsList);

    try {
      await claimLeadsApi(newlyClaimedLeads.map(l => l.id), ptsUsed);
    } catch (e) {
      console.log("[Frappe Claim API Notice] Offline fallback active.");
    }

    showToast(`🎉 ${leadCount} Fresh Leads claimed successfully! (${ptsUsed} Points deducted. Balance: ${newBalance} Pts)`);
  };

  const handleTestLeadCreated = (newLead) => {
    if (!newLead) return;
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveStoredLeads(updated);
    showToast(`🎉 Inbound Lead '${newLead.name}' ingested via ${newLead.source}!`);
  };

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <PerformanceView
            metrics={metrics}
            leads={leads}
            onCallLead={handleCallLead}
            onStartCalling={() => setCurrentTab("fresh")}
            onClaimLeads={handleClaimLeads}
            onOpenColdDialer={() => setShowColdDialer(true)}
          />
        );
      case "actions":
        return (
          <TodaysActionsView
            leads={leads}
            onSelectAction={(tab) => setCurrentTab(tab)}
            onOpenColdDialer={() => setShowColdDialer(true)}
          />
        );
      case "fresh":
        return (
          <FreshLeadsView
            leads={leads}
            onCallLead={handleCallLead}
            onSendReport={(lead) => setReportLead(lead)}
            onLeadCreated={(newLead) => setLeads(prev => [newLead, ...prev])}
          />
        );
      case "followup":
        return (
          <FollowUpsView
            leads={leads}
            onCallLead={handleCallLead}
          />
        );
      case "properties":
        return (
          <PropertiesView
            onShareProperty={(prop) => {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${prop.title} in ${prop.location}. Price: ${prop.priceRange}`)}`, '_blank');
            }}
          />
        );
      case "activities":
        return (
          <ActivitiesView />
        );
      default:
        return (
          <PerformanceView
            metrics={metrics}
            onStartCalling={() => setCurrentTab("fresh")}
            onClaimLeads={handleClaimLeads}
            onOpenColdDialer={() => setShowColdDialer(true)}
          />
        );
    }
  };

  const renderModals = () => (
    <>
      {/* Active Call Dialer Modal */}
      {activeCallLead && (
        <DialerModal
          lead={activeCallLead}
          onClose={() => setActiveCallLead(null)}
          onSaveCall={handleSaveCall}
        />
      )}

      {/* Inbound Call Simulated Modal */}
      {incomingCallLead && (
        <InboundCallModal
          lead={incomingCallLead}
          onAccept={handleAcceptIncomingCall}
          onReject={() => setIncomingCallLead(null)}
        />
      )}

      {/* WhatsApp Report Generator Modal */}
      {reportLead && (
        <WhatsAppReportModal
          lead={reportLead}
          onClose={() => setReportLead(null)}
        />
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onCallLead={(lead) => {
            setShowNotificationsModal(false);
            if (lead) handleCallLead(lead);
          }}
          onWhatsAppLead={(lead) => {
            setShowNotificationsModal(false);
            if (lead) setReportLead(lead);
          }}
          onClearAll={() => setNotifications([])}
          onMarkRead={(id) => {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
          }}
        />
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          userProfile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout}
        />
      )}

      {/* Cold Calling & Meeting Modal */}
      {showColdDialer && (
        <ColdCallingModal
          isOpen={showColdDialer}
          onClose={() => setShowColdDialer(false)}
          onLogCall={handleCallLead}
        />
      )}

      {/* Work Attendance Modal */}
      {showAttendanceModal && (
        <WorkAttendanceModal
          isOpen={showAttendanceModal}
          onClose={() => setShowAttendanceModal(false)}
          currentUser={userProfile}
        />
      )}

      {/* Live Google Map Meeting Location Modal */}
      {showLocationModal && (
        <MeetingLocationModal
          isOpen={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          clientName="Client"
          initialLocation="Andheri West Sales Office"
        />
      )}

      {/* Stories & Highlights Showcase Modal */}
      {showStoriesModal && (
        <StoriesHighlightsModal
          isOpen={showStoriesModal}
          onClose={() => setShowStoriesModal(false)}
        />
      )}

      {/* Real Estate Financial Calculator Modal */}
      {showCalculatorModal && (
        <RealEstateCalculatorModal
          isOpen={showCalculatorModal}
          onClose={() => setShowCalculatorModal(false)}
        />
      )}

      {/* Install App on Phone Modal */}
      {showInstallModal && (
        <InstallAppModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
        />
      )}

      {/* Digital Business Card Modal */}
      {showBusinessCardModal && (
        <BusinessCardModal
          isOpen={showBusinessCardModal}
          onClose={() => setShowBusinessCardModal(false)}
          currentUser={userProfile}
        />
      )}

      {/* TCF Form Modal */}
      {showTCFModal && (
        <TCFModal
          isOpen={showTCFModal}
          onClose={() => setShowTCFModal(false)}
        />
      )}

      {/* MCF Form Modal */}
      {showMCFModal && (
        <MCFModal
          isOpen={showMCFModal}
          onClose={() => setShowMCFModal(false)}
        />
      )}

      {/* Claim Fresh Leads Modal */}
      {showClaimModal && (
        <ClaimLeadsModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onConfirmClaim={handleConfirmClaim}
        />
      )}

      {/* ChatGPT AI Assistant Modal */}
      {showGptModal && (
        <GptAssistantModal
          isOpen={showGptModal}
          onClose={() => setShowGptModal(false)}
          currentUser={userProfile}
        />
      )}

      {/* Lead Webhook & Social Integrations Modal */}
      {showIntegrationsModal && (
        <IntegrationsModal
          isOpen={showIntegrationsModal}
          onClose={() => setShowIntegrationsModal(false)}
          onTestLeadCreated={handleTestLeadCreated}
          onOrgProfileUpdated={(newProf) => setOrgProfile(prev => ({ ...prev, ...newProf }))}
        />
      )}
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className={isRealMobile ? "native-mobile-app-shell" : "app-container"} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  if (viewMode === "admin") {
    return (
      <div className={isRealMobile ? "native-mobile-app-shell" : "app-container"}>
        <Header
          currentTab={currentTab}
          setTab={handleSetTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSimulateInbound={simulateSocialInboundLead}
          unreadCount={unreadCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          userProfile={userProfile}
          onOpenProfile={() => setShowProfileModal(true)}
          orgProfile={orgProfile}
        />
        <main className="main-content-container" style={{ padding: isRealMobile ? "0.5rem" : "1.5rem" }}>
          <AdminPortal userProfile={userProfile} onSwitchToTelecaller={() => setViewMode("telecaller")} />
        </main>
        {renderModals()}
      </div>
    );
  }

  const handleDirectCall = () => {
    const targetLead = leads.find(l => l.status === "FOLLOWUP_TODAY" || l.status === "OVERDUE" || l.status === "NEW") || leads[0];
    if (targetLead) {
      handleCallLead(targetLead);
    } else {
      setShowColdDialer(true);
    }
  };

  if (isRealMobile) {
    return (
      <div className="native-mobile-app-shell">
        <MobileHeader
          unreadCount={unreadCount}
          onDirectCall={handleDirectCall}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          userProfile={userProfile}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenSidebar={() => setShowSidebar(true)}
          onOpenIntegrations={() => setShowIntegrationsModal(true)}
          onOpenInstallApp={() => setShowInstallModal(true)}
          orgProfile={orgProfile}
        />

        <div className="phone-screen-content">
          {renderContent()}
        </div>

        <MobileBottomNav currentTab={currentTab} setTab={handleSetTab} />

        {/* Slide-out Sidebar Drawer */}
        <SidebarDrawer
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          currentUser={userProfile}
          onNavigate={(tab) => {
            if (tab === "tcf-list" || tab === "mcf-list" || tab === "announcements") {
              handleSetTab("activities");
            } else {
              handleSetTab("properties");
            }
          }}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenAttendance={() => setShowAttendanceModal(true)}
          onOpenBusinessCard={() => setShowBusinessCardModal(true)}
          onOpenTCF={() => setShowTCFModal(true)}
          onOpenMCF={() => setShowMCFModal(true)}
          onOpenGpt={() => setShowGptModal(true)}
          onOpenLocation={() => setShowLocationModal(true)}
          onOpenStories={() => setShowStoriesModal(true)}
          onOpenCalculator={() => setShowCalculatorModal(true)}
          onOpenInstallApp={() => setShowInstallModal(true)}
        />

        {renderModals()}

        {toastMsg && (
          <div className="toast-notification">
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        currentTab={currentTab}
        setTab={handleSetTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSimulateInbound={simulateSocialInboundLead}
        unreadCount={unreadCount}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        userProfile={userProfile}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenIntegrations={() => setShowIntegrationsModal(true)}
        orgProfile={orgProfile}
      />

      <main className="main-content-container" style={{ flex: 1, padding: "1.5rem 2rem", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {renderContent()}
      </main>

      {renderModals()}

      {/* Toast Banner */}
      {toastMsg && (
        <div className="toast-notification">
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
