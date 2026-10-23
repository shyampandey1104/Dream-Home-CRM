import React, { useState, useEffect } from "react";
import { 
  X, Globe, Key, Link2, Sparkles, CheckCircle2, Save, Send, Building, 
  Image, Award, PhoneCall, Mail, PhoneIncoming, Copy, Radio, MessageSquare, 
  Camera, Users, ExternalLink, ShieldCheck, Check
} from "lucide-react";
import { 
  fetchIntegrationSettings, saveIntegrationSettings, testInboundWebhookLead, 
  fetchOrgProfile, saveOrgProfile, sendWhatsAppTemplateApi, triggerExotelClickToCall 
} from "../services/apiService";
import CustomAlertDialog from "./CustomAlertDialog";

export default function IntegrationsModal({ isOpen, onClose, onTestLeadCreated, onOrgProfileUpdated, initialTab = "whatsapp" }) {
  const [activeTab, setActiveTab] = useState(initialTab || "whatsapp");
  const [alertConfig, setAlertConfig] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Agent Alert Phone
  const agentAlertPhone = "+91 98677 78229";
  const ngrokBase = "https://allodially-goodish-lydia.ngrok-free.dev";
  const currentOrigin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ngrokBase;

  // WhatsApp Business Integration
  const [waPhoneNumber, setWaPhoneNumber] = useState("+91 98677 78229");
  const [waVerifyToken, setWaVerifyToken] = useState("dreamhome_secret");
  const waWebhookUrl = `${ngrokBase}/api/method/real_state_crm.api.whatsapp_inbound_webhook`;

  // Meta Facebook & Instagram
  const [instaPageId, setInstaPageId] = useState("dreamhomes_official");
  const [instaToken, setInstaToken] = useState("EAAB123456789_INSTA_TOKEN");
  const [fbFormId, setFbFormId] = useState("FB_LEADGEN_FORM_99201");
  const metaWebhookUrl = `${ngrokBase}/api/method/real_state_crm.api.facebook_instagram_lead_webhook`;

  // Virtual Cloud Number & Exotel States
  const [virtualNumber, setVirtualNumber] = useState("+91 022 6985 4120");
  const [forwardingPhone, setForwardingPhone] = useState("+91 98677 78229");
  const callWebhookUrl = `${ngrokBase}/api/method/real_state_crm.api.inbound_call_webhook`;
  const exotelInboundUrl = `${ngrokBase}/api/method/real_state_crm.api.exotel_inbound_webhook`;

  // Exotel Cloud Telephony States
  const [exotelSid, setExotelSid] = useState("dreamhomes42");
  const [exotelApiKey, setExotelApiKey] = useState("");
  const [exotelApiToken, setExotelApiToken] = useState("");
  const [exotelCallerId, setExotelCallerId] = useState("08047190000");
  const [agentPhone, setAgentPhone] = useState("9867778229");
  const [isTestingExotel, setIsTestingExotel] = useState(false);

  // Website Webhook
  const [websiteUrl, setWebsiteUrl] = useState("https://dreamhomes42.com");
  const websiteWebhookUrl = `${ngrokBase}/api/method/real_state_crm.api.website_lead_webhook`;
  const [ytChannelUrl, setYtChannelUrl] = useState("https://youtube.com/@dreamhomesmumbai");

  // Dynamic Organization Profile State
  const [companyName, setCompanyName] = useState("Dream Homes Real Estate");
  const [companyTagline, setCompanyTagline] = useState("Mumbai's Premier Luxury Real Estate Partner");
  const [logoUrl, setLogoUrl] = useState("/dreamhomes_gold_logo.jpg");
  const [mahareraNo, setMahareraNo] = useState("A51800045492");
  const [contactEmail, setContactEmail] = useState("sales@dreamhomes42.com");
  const [contactPhone, setContactPhone] = useState("+91 98677 78229");

  const [isSaving, setIsSaving] = useState(false);
  const [testingChannel, setTestingChannel] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAlertConfig(null);
      if (initialTab) setActiveTab(initialTab);
      fetchIntegrationSettings().then(data => {
        if (data) {
          if (data.website_url) setWebsiteUrl(data.website_url);
          if (data.instagram_page_id) setInstaPageId(data.instagram_page_id);
          if (data.instagram_token) setInstaToken(data.instagram_token);
          if (data.facebook_form_id) setFbFormId(data.facebook_form_id);
          if (data.youtube_channel_url) setYtChannelUrl(data.youtube_channel_url);
          if (data.exotel_account_sid) setExotelSid(data.exotel_account_sid);
          if (data.exotel_api_key) setExotelApiKey(data.exotel_api_key);
          if (data.exotel_api_token) setExotelApiToken(data.exotel_api_token);
          if (data.exotel_caller_id) setExotelCallerId(data.exotel_caller_id);
          if (data.agent_phone) setAgentPhone(data.agent_phone);
        }
      });

      fetchOrgProfile().then(org => {
        if (org) {
          if (org.company_name) setCompanyName(org.company_name);
          if (org.company_tagline) setCompanyTagline(org.company_tagline);
          if (org.logo_url) setLogoUrl(org.logo_url);
          if (org.maharera_no) setMahareraNo(org.maharera_no);
          if (org.contact_email) setContactEmail(org.contact_email);
          if (org.contact_phone) setContactPhone(org.contact_phone);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestExotelCall = async () => {
    setIsTestingExotel(true);
    const res = await triggerExotelClickToCall("TEST_LEAD", "9820591823", agentPhone);
    setIsTestingExotel(false);
    setAlertConfig({
      title: res.status === "success" ? "📞 Exotel Test Call Dispatched!" : "Exotel Call Status",
      message: res.message || "Exotel Click-to-Call triggered successfully.",
      type: res.status === "success" ? "success" : "info",
      actionBtn: res.direct_dial_url ? {
        label: "📱 Direct Dial (Phone App)",
        onClick: () => window.open(res.direct_dial_url, "_self")
      } : null
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      website_url: websiteUrl,
      website_webhook: websiteWebhookUrl,
      instagram_page_id: instaPageId,
      instagram_token: instaToken,
      facebook_form_id: fbFormId,
      youtube_channel_url: ytChannelUrl,
      whatsapp_number: waPhoneNumber,
      exotel_account_sid: exotelSid,
      exotel_api_key: exotelApiKey,
      exotel_api_token: exotelApiToken,
      exotel_caller_id: exotelCallerId,
      agent_phone: agentPhone
    };

    const orgPayload = {
      company_name: companyName,
      company_tagline: companyTagline,
      logo_url: logoUrl,
      maharera_no: mahareraNo,
      contact_email: contactEmail,
      contact_phone: contactPhone
    };

    await saveIntegrationSettings(payload);
    await saveOrgProfile(orgPayload);

    if (onOrgProfileUpdated) {
      onOrgProfileUpdated(orgPayload);
    }

    setIsSaving(false);
    setAlertConfig({
      title: "Settings Saved! 💾",
      message: "Exotel Telephony credentials & Organization Profile updated in CRM Backend!",
      type: "success"
    });
  };

  const handleTestTrigger = async (channelKey, channelLabel) => {
    setTestingChannel(channelKey);
    const result = await testInboundWebhookLead(channelKey);
    setTestingChannel(null);

    if (result && (result.status === "success" || result.lead)) {
      const leadData = result.lead || {
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        name: `${channelLabel} Client`,
        phone: "+91 98205 91823",
        bhkType: "2 BHK Luxury",
        location: "Mumbai",
        source: channelLabel,
        priority: "HOT",
        status: "NEW"
      };

      if (onTestLeadCreated) {
        onTestLeadCreated(leadData);
      }

      setAlertConfig({
        title: `⚡ ${channelLabel} Inbound Lead Captured!`,
        message: `Lead from ${channelLabel} '${leadData.name}' (${leadData.phone}) captured in Fresh Leads!\n\nAlert forwarding link prepared for Agent (${agentAlertPhone}). Check ringing card on screen!`,
        type: "success"
      });
    }
  };

  const handleSendTestTemplateToAgent = () => {
    const text = encodeURIComponent(
      `🚨 *DREAM HOMES LEAD ALERT* 🚨\n\n` +
      `👤 *Client Name:* Siddharth Malhotra\n` +
      `📞 *Mobile:* +91 98205 91823\n` +
      `🏢 *Interested In:* 2 BHK Sun-Deck (Srishti Oasis, Bhandup West)\n` +
      `💰 *Budget:* ₹ 1.59 Cr\n` +
      `🎯 *Lead Source:* WhatsApp Business Webhook\n` +
      `📝 *Client Inquiry:* "Hi Shyam, please send me the brochure & payment plan for 2 BHK."\n\n` +
      `👉 *Open CRM:* ${ngrokBase}/crm\n` +
      `⚡ Tap to call client now!`
    );
    window.open(`https://api.whatsapp.com/send?phone=919867778229&text=${text}`, "_blank");
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        borderRadius: "inherit",
        overflow: "hidden",
        padding: 0
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          background: "#ffffff",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          width: "100%",
          maxWidth: "100%",
          maxHeight: "92%",
          overflowY: "auto",
          boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          animation: "slideUpMobile 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Luxury Top Header Banner with Pull Indicator */}
        <div style={{
          padding: "0.75rem 1.15rem 0.85rem 1.15rem",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div style={{ width: "36px", height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "9999px", margin: "0 auto 0.5rem auto" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "0.925rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "0.45rem", color: "#ffffff" }}>
                <Sparkles size={15} color="#fbbf24" /> Multi-Channel Integrations
              </h3>
              <p style={{ fontSize: "0.6875rem", color: "#94a3b8", margin: "0.15rem 0 0 0" }}>
                WhatsApp, Instagram, Facebook & Webhooks
              </p>
            </div>

            <button
              onClick={onClose}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "none",
                color: "#cbd5e1",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Integration Pill Sub-Tabs */}
        <div style={{ 
          display: "flex", 
          borderBottom: "1px solid #e2e8f0", 
          background: "#f8fafc", 
          padding: "0.6rem 0.75rem", 
          gap: "0.4rem", 
          overflowX: "auto", 
          scrollbarWidth: "none" 
        }}>
          {[
            { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare size={13} color="#16a34a" /> },
            { id: "instagram", label: "Instagram", icon: <Camera size={13} color="#db2777" /> },
            { id: "facebook", label: "Facebook", icon: <Users size={13} color="#2563eb" /> },
            { id: "virtual_number", label: "Exotel & Calls", icon: <PhoneCall size={13} color="#2563eb" /> },
            { id: "website", label: "Website", icon: <Globe size={13} color="#0284c7" /> },
            { id: "org", label: "Branding", icon: <Building size={13} color="#4f46e5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.7rem",
                border: activeTab === tab.id ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                borderRadius: "9999px",
                background: activeTab === tab.id ? "#eff6ff" : "#ffffff",
                color: activeTab === tab.id ? "#2563eb" : "#64748b",
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: "0.725rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: activeTab === tab.id ? "0 2px 6px rgba(37,99,235,0.12)" : "none"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaveSettings} style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* TAB 1: WHATSAPP BUSINESS & DIRECT TEMPLATES */}
          {activeTab === "whatsapp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0", padding: "0.85rem", borderRadius: "0.85rem", fontSize: "0.75rem", color: "#166534" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.8125rem", color: "#15803d", marginBottom: "0.3rem" }}>
                  <MessageSquare size={16} color="#16a34a" /> 
                  <span>WhatsApp Lead Ingestion & Agent Alerts Active</span>
                </div>
                <span>WhatsApp par aane wali har inquiry/message automatically <strong>Fresh Leads</strong> mein capture hogi, <strong>Screen par live ring karegi</strong>, aur directly aapke phone (<strong>{agentAlertPhone}</strong>) par alert message bhejegi!</span>
              </div>

              {/* WhatsApp Numbers Configuration - Mobile Optimized Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    🟢 WhatsApp Business SIM / Number
                  </label>
                  <input
                    type="text"
                    className="modern-search-input"
                    value={waPhoneNumber}
                    onChange={e => setWaPhoneNumber(e.target.value)}
                    placeholder="+91 98677 78229"
                    style={{ fontWeight: 800, color: "#15803d", fontSize: "0.8125rem", width: "100%" }}
                  />
                  <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>
                    Client jis number par message bhejega
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    📱 Agent Alert Mobile Number
                  </label>
                  <input
                    type="text"
                    className="modern-search-input"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+91 98677 78229"
                    style={{ fontWeight: 800, color: "#2563eb", fontSize: "0.8125rem", width: "100%" }}
                  />
                  <span style={{ fontSize: "0.6875rem", color: "#64748b" }}>
                    Aapka number jahan lead aane par instant alert aayega
                  </span>
                </div>
              </div>

              {/* Local WhatsApp QR Link (100% Local / Zero Cloud) */}
              <div style={{
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                border: "1.5px solid #86efac",
                borderRadius: "0.85rem",
                padding: "0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🟢</span>
                  <div>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#166534" }}>
                      WhatsApp Direct Link (100% Local Mac Sync)
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "#15803d" }}>
                      Phone WhatsApp se QR Code scan karke connect karein
                    </div>
                  </div>
                </div>

                <a
                  href="http://localhost:5005/qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    color: "#ffffff",
                    textAlign: "center",
                    textDecoration: "none",
                    padding: "0.65rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.8125rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
                  }}
                >
                  📱 Click Here to Open QR Code (Link WhatsApp Phone)
                </a>
              </div>

              {/* Live Webhook URL */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    ⚡ Inbound Webhook URL (Meta Cloud API / Twilio / GreenAPI)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(waWebhookUrl, "wa_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "wa_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "wa_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  value={waWebhookUrl}
                  style={{ fontSize: "0.6875rem", background: "#f8fafc", color: "#2563eb", fontWeight: 700, fontFamily: "monospace" }}
                />
              </div>

              {/* Verify Token */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    🔑 Webhook Verify Token
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(waVerifyToken, "wa_token")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "wa_token" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "wa_token" ? "Copied!" : "Copy Token"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  value={waVerifyToken}
                  onChange={e => setWaVerifyToken(e.target.value)}
                  style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}
                />
              </div>

              {/* Test Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                <button
                  type="button"
                  disabled={testingChannel === "whatsapp"}
                  onClick={() => handleTestTrigger("whatsapp", "WhatsApp Business")}
                  style={{
                    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                    border: "none",
                    color: "#ffffff",
                    borderRadius: "0.625rem",
                    padding: "0.65rem",
                    fontSize: "0.8125rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
                  }}
                >
                  <MessageSquare size={16} /> 
                  {testingChannel === "whatsapp" ? "Capturing Inbound Lead..." : "⚡ Simulate Inbound WhatsApp Lead"}
                </button>

                <button
                  type="button"
                  onClick={handleSendTestTemplateToAgent}
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    color: "#166534",
                    borderRadius: "0.625rem",
                    padding: "0.6rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem"
                  }}
                >
                  <Send size={14} color="#16a34a" /> 📲 Send Lead Template to My Phone ({agentAlertPhone})
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INSTAGRAM LEAD ADS */}
          {activeTab === "instagram" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)", border: "1px solid #fbcfe8", padding: "0.85rem", borderRadius: "0.85rem", fontSize: "0.75rem", color: "#9d174d" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.8125rem", color: "#be185d", marginBottom: "0.3rem" }}>
                  <Camera size={16} color="#db2777" /> 
                  <span>Instagram Graph API & Lead Ads Integration</span>
                </div>
                <span>Connect your Instagram Business handle (<strong>@{instaPageId}</strong>) to sync Instant Lead Ads & Direct Messages straight into Fresh Leads and send immediate WhatsApp alerts to agent!</span>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                  Instagram Business Handle / Page ID
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. dreamhomes_official"
                  value={instaPageId}
                  onChange={e => setInstaPageId(e.target.value)}
                  style={{ fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                  Meta Access Token
                </label>
                <input
                  type="password"
                  className="modern-search-input"
                  placeholder="EAAB..."
                  value={instaToken}
                  onChange={e => setInstaToken(e.target.value)}
                />
              </div>

              {/* Webhook Endpoint */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    ⚡ Instagram Webhook URL
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(metaWebhookUrl, "insta_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "insta_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "insta_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  value={metaWebhookUrl}
                  style={{ fontSize: "0.6875rem", background: "#f8fafc", color: "#db2777", fontWeight: 700, fontFamily: "monospace" }}
                />
              </div>

              <button
                type="button"
                disabled={testingChannel === "instagram"}
                onClick={() => handleTestTrigger("instagram", "Instagram Ads")}
                style={{
                  background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "0.625rem",
                  padding: "0.65rem",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 4px 12px rgba(219,39,119,0.3)"
                }}
              >
                <Camera size={16} /> 
                {testingChannel === "instagram" ? "Capturing Lead..." : "⚡ Simulate Inbound Instagram Lead"}
              </button>
            </div>
          )}

          {/* TAB 3: FACEBOOK LEAD ADS */}
          {activeTab === "facebook" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: "0.85rem", fontSize: "0.75rem", color: "#1e40af" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.8125rem", color: "#1d4ed8", marginBottom: "0.3rem" }}>
                  <Users size={16} color="#2563eb" /> 
                  <span>Meta Facebook Lead Ads Instant Forms</span>
                </div>
                <span>Sync instant lead ads from Facebook Ads Manager in real time. All leads are stored in MariaDB and alert is pushed immediately to your phone (<strong>{agentAlertPhone}</strong>).</span>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                  Facebook Lead Form ID
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="FB_LEADGEN_FORM_99201"
                  value={fbFormId}
                  onChange={e => setFbFormId(e.target.value)}
                  style={{ fontWeight: 700 }}
                />
              </div>

              {/* Webhook Endpoint */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    ⚡ Facebook Webhook URL
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(metaWebhookUrl, "fb_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "fb_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "fb_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  value={metaWebhookUrl}
                  style={{ fontSize: "0.6875rem", background: "#f8fafc", color: "#2563eb", fontWeight: 700, fontFamily: "monospace" }}
                />
              </div>

              <button
                type="button"
                disabled={testingChannel === "facebook"}
                onClick={() => handleTestTrigger("facebook", "Facebook Lead Ads")}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "0.625rem",
                  padding: "0.65rem",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                }}
              >
                <Users size={16} /> 
                {testingChannel === "facebook" ? "Capturing Lead..." : "⚡ Simulate Inbound Facebook Lead"}
              </button>
            </div>
          )}

          {/* TAB 4: VIRTUAL NUMBER & EXOTEL CLOUD TELEPHONY */}
          {activeTab === "virtual_number" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Exotel Cloud Click-to-Call Section */}
              <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe", padding: "0.85rem", borderRadius: "0.85rem", fontSize: "0.75rem", color: "#1e40af" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.8125rem", color: "#1d4ed8", marginBottom: "0.3rem" }}>
                  <PhoneCall size={16} color="#2563eb" /> 
                  <span>Exotel Cloud Click-to-Call (Real Mobile PSTN)</span>
                </div>
                <span>Dialer screen par <strong>'Exotel'</strong> button dabane par Exotel Cloud pehle agent ke phone (<strong>{agentPhone || agentAlertPhone}</strong>) ko call karega, aur uthane par turant customer se connect karega (with call recording).</span>
              </div>

              {/* Exotel Configuration Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Exotel Account SID
                  </label>
                  <input
                    type="text"
                    className="modern-search-input"
                    placeholder="dreamhomes42"
                    value={exotelSid}
                    onChange={e => setExotelSid(e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Exotel Caller ID / Exophone
                  </label>
                  <input
                    type="text"
                    className="modern-search-input"
                    placeholder="08047190000"
                    value={exotelCallerId}
                    onChange={e => setExotelCallerId(e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Exotel API Key
                  </label>
                  <input
                    type="password"
                    className="modern-search-input"
                    placeholder="Enter Exotel API Key"
                    value={exotelApiKey}
                    onChange={e => setExotelApiKey(e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Exotel API Token
                  </label>
                  <input
                    type="password"
                    className="modern-search-input"
                    placeholder="Enter Exotel API Token"
                    value={exotelApiToken}
                    onChange={e => setExotelApiToken(e.target.value)}
                    style={{ fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                  Agent Mobile Number (Rings First)
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="9867778229"
                  value={agentPhone}
                  onChange={e => setAgentPhone(e.target.value)}
                  style={{ fontWeight: 700, color: "#2563eb" }}
                />
              </div>

              {/* Test Exotel Click-to-Call */}
              <button
                type="button"
                disabled={isTestingExotel}
                onClick={handleTestExotelCall}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "0.625rem",
                  padding: "0.65rem",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                }}
              >
                <PhoneCall size={16} /> 
                {isTestingExotel ? "Connecting to Exotel..." : `⚡ Test Exotel Click-to-Call to Agent (${agentPhone || "9867778229"})`}
              </button>

              <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "0.25rem 0" }} />

              {/* Inbound Call Webhook */}
              <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0", padding: "0.85rem", borderRadius: "0.85rem", fontSize: "0.75rem", color: "#166534" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 800, fontSize: "0.8125rem", color: "#15803d", marginBottom: "0.3rem" }}>
                  <Radio size={16} className="animate-pulse" color="#16a34a" /> 
                  <span>Direct SIM & Cloud Inbound Call Sync Active</span>
                </div>
                <span>Phone par aane wali direct SIM call (Android/iPhone) ya Exotel Passthru call automatically <strong>CRM Screen par ring karegi</strong> aur <strong>Fresh Leads mein capture hogi!</strong></span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    ⚡ Exotel Inbound Passthru Webhook URL
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(exotelInboundUrl, "exotel_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "exotel_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "exotel_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  style={{ fontSize: "0.6875rem", background: "#f8fafc", color: "#2563eb", fontWeight: 700, fontFamily: "monospace" }}
                  value={exotelInboundUrl}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    ⚡ Direct Inbound Call Webhook (Android MacroDroid / iPhone)
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(callWebhookUrl, "call_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "call_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "call_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  style={{ fontSize: "0.6875rem", background: "#f8fafc", color: "#15803d", fontWeight: 700, fontFamily: "monospace" }}
                  value={callWebhookUrl}
                />
              </div>

              {/* Device Specific Setup Instructions */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.85rem", padding: "0.75rem", fontSize: "0.75rem" }}>
                <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>📱 Setup on Android (1-Minute Setup):</span>
                </div>
                <ol style={{ margin: "0 0 0.5rem 1.1rem", padding: 0, color: "#475569", lineHeight: 1.4 }}>
                  <li>Install <strong>MacroDroid</strong> (Free) from Play Store.</li>
                  <li><strong>Trigger:</strong> Call Incoming (Any / Unknown).</li>
                  <li><strong>Action:</strong> HTTP Request &rarr; <code>POST</code> to Webhook URL above.</li>
                  <li>Body: <code>&#123; "caller_number": "{call_number}" &#125;</code></li>
                </ol>

                <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>🍏 Setup on iPhone (iOS Cloud Forward / Shortcuts):</span>
                </div>
                <ol style={{ margin: "0 0 0 1.1rem", padding: 0, color: "#475569", lineHeight: 1.4 }}>
                  <li>Use Exotel / Cloud IVR Virtual Number.</li>
                  <li>Forward client calls to your iPhone SIM (<strong>{agentAlertPhone}</strong>).</li>
                  <li>Set Exotel Passthru Inbound Webhook URL in Exotel dashboard.</li>
                </ol>
              </div>

              {/* Instant Live Test Caller Trigger */}
              <button
                type="button"
                disabled={testingChannel === "call"}
                onClick={() => handleTestTrigger("call", "Direct Phone Call")}
                style={{
                  background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  border: "none",
                  color: "#ffffff",
                  borderRadius: "0.625rem",
                  padding: "0.65rem",
                  fontSize: "0.8125rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
                }}
              >
                <PhoneIncoming size={16} /> ⚡ Test Incoming Call Screen Ringing ({agentAlertPhone})
              </button>
            </div>
          )}

          {/* TAB 5: WEBSITE WEBHOOK */}
          {activeTab === "website" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.75rem", borderRadius: "0.75rem", fontSize: "0.75rem", color: "#1e40af" }}>
                🌐 <strong>Website Contact Form API Webhook:</strong> Incoming leads submitted on your website form will automatically post to this REST endpoint and assign to your active telecallers!
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                  Website Base Domain URL
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="https://dreamhomes42.com"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>
                    CRM REST Webhook Endpoint
                  </label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(websiteWebhookUrl, "web_url")}
                    style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.6875rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                  >
                    {copiedKey === "web_url" ? <Check size={12} color="#16a34a" /> : <Copy size={11} />} 
                    {copiedKey === "web_url" ? "Copied!" : "Copy URL"}
                  </button>
                </div>
                <input
                  type="text"
                  className="modern-search-input"
                  readOnly
                  value={websiteWebhookUrl}
                  style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#2563eb", background: "#f8fafc" }}
                />
              </div>

              <button
                type="button"
                disabled={testingChannel === "website"}
                onClick={() => handleTestTrigger("website", "Website Form")}
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#2563eb",
                  borderRadius: "0.625rem",
                  padding: "0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem"
                }}
              >
                {testingChannel === "website" ? "⚡ Simulating Test Lead..." : "⚡ Simulate Inbound Website Lead"}
              </button>
            </div>
          )}

          {/* TAB 6: BRANDING */}
          {activeTab === "org" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0", padding: "0.75rem", borderRadius: "0.75rem", fontSize: "0.75rem", color: "#166534" }}>
                🏢 <strong>Dynamic Company Profile & Logo Settings:</strong> Changes saved here directly update your CRM header logo, company name, and official MahaRERA credentials in MariaDB!
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. Dream Homes Real Estate"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  style={{ fontWeight: 800, color: "#0f172a" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                  Company Tagline / Subtitle
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. Mumbai's Premier Luxury Real Estate Partner"
                  value={companyTagline}
                  onChange={e => setCompanyTagline(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                  Company Logo Image URL
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="/dreamhomes_gold_logo.jpg"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                  MahaRERA Registration Number
                </label>
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="e.g. A51800045492"
                  value={mahareraNo}
                  onChange={e => setMahareraNo(e.target.value)}
                  style={{ fontWeight: 800, color: "#2563eb" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                    Official Contact Phone
                  </label>
                  <input
                    type="text"
                    className="modern-search-input"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.25rem", display: "block" }}>
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    className="modern-search-input"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem",
              fontSize: "0.84375rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              marginTop: "0.5rem"
            }}
          >
            <Save size={16} /> {isSaving ? "Saving Credentials..." : "Save Integration Credentials to MariaDB"}
          </button>
        </form>

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
    </div>
  );
}
