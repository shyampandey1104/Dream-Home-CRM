import React, { useState } from "react";
import { 
  X, Sparkles, ExternalLink, Globe, Phone, Award, Users, Building2, 
  ChevronRight, Star, Heart, CheckCircle2, Share2, Play, Eye, ArrowRight
} from "lucide-react";
import CustomAlertDialog from "./CustomAlertDialog";

export default function StoriesHighlightsModal({ isOpen, onClose }) {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null); // Fullscreen story viewer if not null
  const [activeRing, setActiveRing] = useState(0);
  const [alertConfig, setAlertConfig] = useState(null);

  const websiteUrl = "https://dreamhomes42.com/";
  const contactUrl = "https://dreamhomes42.com/contact/";

  const storyRings = [
    { id: 0, title: "5 Years Excellence", tag: "MILESTONE", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", fullText: "Celebrating 5 Years of Real Estate Excellence in Mumbai! Over 200+ Happy Homeowners Trust Dream Homes." },
    { id: 1, title: "500+ Listed", tag: "LISTINGS", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", fullText: "500+ Verified Luxury & Budget Properties Listed Across Mumbai Micro-Markets." },
    { id: 2, title: "Happy Clients", tag: "REVIEWS", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80", fullText: "Serving Hundreds of Families Find Their Dream Home with Transparent & Honest Advisory." },
    { id: 3, title: "Prime Mumbai", tag: "LOCATIONS", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", fullText: "Properties in Powai, Bandra, Andheri, Ghatkopar, Mulund & Thane." }
  ];

  const highlights = [
    {
      id: 1,
      title: "Serving Hundreds of Happy Clients",
      desc: "Our dedication to customer satisfaction helped us become a trusted name in the real estate market.",
      badge: "Trusted Partner",
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Premium Project Expansion",
      desc: "We introduced a wider portfolio of luxury and affordable residential projects in prime locations.",
      badge: "Prime Expansion",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "5 Years of Excellence",
      desc: "Celebrating five successful years of helping clients find dream homes and investment opportunities.",
      badge: "5 Year Milestone",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const dreamListings = [
    { id: 1, location: "Ghatkopar", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹99 Lacs To ₹3.79 Cr", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
    { id: 2, location: "Vikhroli", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹59 Lacs To ₹1.89 Cr", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 3, location: "Kanjurmarg", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹89 Lacs To ₹2.99 Cr", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" },
    { id: 4, location: "Bhandup", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹55 Lacs To ₹1.98 Cr", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80" },
    { id: 5, location: "Mulund", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹75 Lacs To ₹1.68 Cr", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80" },
    { id: 6, location: "Powai", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹1.25 Cr To ₹9.99 Cr", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80" },
    { id: 7, location: "Chembur", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹99 Lacs To ₹2.99 Cr", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80" },
    { id: 8, location: "Thane", config: "1, 2 & 3 BHK Apartments", price: "Starting ₹35 Lacs To ₹1.99 Cr", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" }
  ];

  if (!isOpen) return null;

  const handleOpenWebsite = (customUrl) => {
    window.open(customUrl || websiteUrl, "_blank");
  };

  const handleCallUs = () => {
    window.location.href = "tel:+919372721239";
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        borderRadius: "inherit",
        paddingTop: "2.75rem",
        paddingBottom: "1rem"
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: "380px",
          width: "92%",
          maxHeight: "calc(100% - 1rem)",
          overflowY: "auto",
          borderRadius: "1.5rem",
          background: "#f8fafc",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: 0,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          animation: "scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Fullscreen Story Viewer Modal */}
        {activeStoryIndex !== null && (
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 999999,
            background: "#0f172a",
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1.25rem",
            borderRadius: "inherit",
            animation: "fadeIn 0.2s ease"
          }}>
            {/* Story Progress Bar */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "0.75rem" }}>
              {storyRings.map((s, idx) => (
                <div key={idx} style={{
                  flex: 1,
                  height: "3px",
                  borderRadius: "9999px",
                  background: idx === activeStoryIndex ? "#38bdf8" : "rgba(255,255,255,0.3)"
                }} />
              ))}
            </div>

            {/* Top Close */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eab308", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#0f172a", fontSize: "0.75rem" }}>
                  DH
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: "800" }}>Dream Homes Story</div>
                  <div style={{ fontSize: "0.65rem", color: "#38bdf8" }}>{storyRings[activeStoryIndex].tag}</div>
                </div>
              </div>
              <button onClick={() => setActiveStoryIndex(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: "50%", padding: "0.3rem", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {/* Story Image & Text */}
            <div style={{ textCenter: "center", margin: "auto 0" }}>
              <img src={storyRings[activeStoryIndex].img} alt="Story" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "1rem", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", marginBottom: "1rem" }} />
              <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#facc15", marginBottom: "0.4rem" }}>{storyRings[activeStoryIndex].title}</h3>
              <p style={{ fontSize: "0.8125rem", color: "#e2e8f0", lineHeight: "1.5" }}>{storyRings[activeStoryIndex].fullText}</p>
            </div>

            {/* Bottom CTA */}
            <button
              onClick={() => handleOpenWebsite("https://dreamhomes42.com/")}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                fontSize: "0.85rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem"
              }}
            >
              Visit Official Website <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Luxury Top Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #facc15 0%, #ca8a04 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(234, 179, 8, 0.35)",
              color: "#0f172a",
              fontWeight: "900",
              fontSize: "0.85rem"
            }}>
              DH
            </div>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "800", margin: 0, color: "#ffffff" }}>Stories & Highlights</h3>
              <span style={{ fontSize: "0.6875rem", color: "#38bdf8", fontWeight: 600 }}>dreamhomes42.com</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#cbd5e1",
              cursor: "pointer",
              padding: "0.35rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "1rem 1.1rem" }}>
          {/* Instagram Mobile App Story Rings */}
          <div style={{ display: "flex", gap: "0.875rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1rem", scrollbarWidth: "none" }}>
            {storyRings.map((story, idx) => (
              <div 
                key={story.id}
                onClick={() => setActiveStoryIndex(idx)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  flex: "0 0 auto"
                }}
              >
                <div style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "50%",
                  padding: "2px",
                  background: "linear-gradient(135deg, #2563eb, #38bdf8, #facc15)",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                }}>
                  <img 
                    src={story.img} 
                    alt={story.title} 
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                  />
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#0f172a", marginTop: "0.35rem", textAlign: "center", maxWidth: "62px" }}>
                  {story.title}
                </span>
              </div>
            ))}
          </div>

          {/* Website Hero Showcase Banner (Matching Screenshot 1) */}
          <div style={{
            position: "relative",
            borderRadius: "1.1rem",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#ffffff",
            padding: "1.25rem",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
            marginBottom: "1.1rem"
          }}>
            <span style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#ffffff", padding: "0.25rem 0.6rem", borderRadius: "9999px", fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.05em" }}>
              OFFICIAL WEBSITE SHOWCASE
            </span>

            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#ffffff", margin: "0.6rem 0 0.3rem 0", lineHeight: "1.25" }}>
              Find Your Perfect Home <br /> <span style={{ color: "#facc15" }}>in Mumbai</span>
            </h2>

            <p style={{ fontSize: "0.75rem", color: "#cbd5e1", lineHeight: "1.45", margin: "0 0 1rem 0" }}>
              "Our mission is to help individuals, families, and investors find the perfect property while providing reliable listings and expert guidance."
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button
                onClick={() => handleOpenWebsite("https://dreamhomes42.com/contact/")}
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.65rem",
                  padding: "0.65rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.3rem",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)"
                }}
              >
                <Globe size={14} /> Contact Us
              </button>

              <button
                onClick={handleCallUs}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "0.65rem",
                  padding: "0.65rem 0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.3rem"
                }}
              >
                <Phone size={14} color="#38bdf8" /> Call Agent
              </button>
            </div>
          </div>

          {/* Metric Stats Chips (Matching Screenshot 2) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.1rem" }}>
            <div style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#ffffff",
              padding: "0.9375rem 0.75rem",
              borderRadius: "1rem",
              textAlign: "center",
              boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)"
            }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900" }}>500+</div>
              <div style={{ fontSize: "0.725rem", fontWeight: "700", opacity: 0.95 }}>Properties Listed</div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
              color: "#ffffff",
              padding: "0.9375rem 0.75rem",
              borderRadius: "1rem",
              textAlign: "center",
              boxShadow: "0 6px 16px rgba(96, 165, 250, 0.3)"
            }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "900" }}>200+</div>
              <div style={{ fontSize: "0.725rem", fontWeight: "700", opacity: 0.95 }}>Happy Customers</div>
            </div>
          </div>

          {/* Highlights Section (Matching Screenshot 2) */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Award size={16} color="#eab308" /> Premium Builder Highlights
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {highlights.map((item) => (
                <div key={item.id} style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.875rem",
                  padding: "0.75rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}>
                  <img src={item.img} alt={item.title} style={{ width: "68px", height: "68px", borderRadius: "0.625rem", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontSize: "0.84375rem", fontWeight: "800", color: "#0f172a" }}>{item.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", margin: "0.2rem 0" }}>{item.desc}</div>
                    <span style={{ fontSize: "0.625rem", background: "#fef9c3", color: "#ca8a04", fontWeight: "800", padding: "0.15rem 0.45rem", borderRadius: "9999px" }}>
                      ⭐ {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mumbai Listings Grid (Matching Screenshots 3 & 4) */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
              <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Building2 size={16} color="#2563eb" /> Mumbai Micro-Market Listings
              </h4>
              <span style={{ fontSize: "0.65rem", background: "#eff6ff", color: "#2563eb", fontWeight: "800", padding: "0.15rem 0.5rem", borderRadius: "9999px", border: "1px solid #bfdbfe" }}>
                8 Locations
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
              {dreamListings.map((list) => (
                <div key={list.id} style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.875rem",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <img src={list.img} alt={list.location} style={{ width: "100%", height: "95px", objectFit: "cover" }} />
                  <div style={{ padding: "0.65rem", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                    <div>
                      <h5 style={{ fontSize: "0.875rem", fontWeight: "900", color: "#2563eb", margin: 0 }}>{list.location}</h5>
                      <div style={{ fontSize: "0.6875rem", fontWeight: "700", color: "#0f172a", margin: "0.2rem 0" }}>{list.config}</div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{list.price}</div>
                    </div>

                    <button
                      onClick={() => handleOpenWebsite(`https://dreamhomes42.com/`)}
                      style={{
                        width: "100%",
                        marginTop: "0.55rem",
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.4rem 0.5rem",
                        fontSize: "0.725rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.2rem",
                        boxShadow: "0 2px 6px rgba(99, 102, 241, 0.3)"
                      }}
                    >
                      Click here <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Link Banner */}
          <div style={{
            marginTop: "1.25rem",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "1rem",
            padding: "0.875rem",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: "800", color: "#0f172a" }}>🏢 Dream Homes Property Official Website</div>
            <div style={{ fontSize: "0.6875rem", color: "#64748b", margin: "0.2rem 0" }}>Shop No. F38, Runwal City Centre, Kanjurmarg East, Mumbai 400042</div>
            <button
              onClick={() => handleOpenWebsite("https://dreamhomes42.com/")}
              style={{
                marginTop: "0.4rem",
                background: "#0f172a",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.45rem 0.85rem",
                fontSize: "0.75rem",
                fontWeight: "800",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Globe size={13} color="#38bdf8" /> Visit https://dreamhomes42.com/ <ExternalLink size={12} />
            </button>
          </div>
        </div>

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
