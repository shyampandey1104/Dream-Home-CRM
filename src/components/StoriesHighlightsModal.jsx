import React, { useState } from "react";
import { 
  X, ExternalLink, Globe, Phone, Award, Users, Building2, 
  ChevronRight, Star, Heart, CheckCircle2, Share2, Play, Eye, ArrowRight,
  Mail, MapPin
} from "lucide-react";
import CustomAlertDialog from "./CustomAlertDialog";

export default function StoriesHighlightsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'listings', 'about'
  const [alertConfig, setAlertConfig] = useState(null);

  const websiteUrl = "https://dreamhomes42.com/";
  const contactPhone = "+91 9372721239";
  const officeAddress = "Dream homes property, shop no.F38, runwal city centre,dattar colony, Kanjurmarg east 400042";

  // Exact 8 Mumbai Micro-Market Listings from Website Screenshot
  const listingsData = [
    {
      id: 1,
      location: "Ghatkopar",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹99 Lacs To ₹3.79 Crore",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 2,
      location: "Vikhroli",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹59 Lacs To ₹1.89 Crore",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 3,
      location: "Kanjurmarg",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹89 Lacs To ₹2.99 Crore",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 4,
      location: "Bhandup",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹55 Lakhs To ₹1.98 Crore",
      img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 5,
      location: "Mulund",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹75 Lacs To ₹1.68 Crore",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 6,
      location: "Powai",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹1.25 Crore To ₹9.99 Crore",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 7,
      location: "Chembur",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹99 Lacs To ₹2.99 Crore",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    },
    {
      id: 8,
      location: "Thane",
      color: "#00b4d8",
      bhk: "Buy 1 BHK, 2 BHK & 3 BHK Apartments",
      price: "Starting from ₹35 Lacs To ₹1.99 Crore",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      link: "https://dreamhomes42.com/"
    }
  ];

  // Exact 3 Milestones / Timeline Items from Website Screenshot
  const milestones = [
    {
      id: 1,
      title: "Serving Hundreds of Happy Clients",
      desc: "Our dedication to customer satisfaction helped us become a trusted name in the real estate market.",
      year: "2023",
      subYear: "Building Trust Through Results",
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Premium Project Expansion",
      desc: "We introduced a wider portfolio of luxury and affordable residential projects in prime locations.",
      year: "2024",
      subYear: "Partnering with Top Developers",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "5 Years of Excellence",
      desc: "Celebrating five successful years of helping clients find their dream homes and investment opportunities.",
      year: "2025",
      subYear: "A Trusted Real Estate Partner",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
    }
  ];

  if (!isOpen) return null;

  const handleOpenLink = (url) => {
    window.open(url || websiteUrl, "_blank");
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.75rem",
        overflowY: "auto"
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: "390px",
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: "1.25rem",
          background: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: 0,
          border: "1px solid #cbd5e1",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Top Floating App Bar */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0284c7 0%, #00b4d8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "900",
              fontSize: "0.75rem"
            }}>
              DH
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: "800", color: "#0f172a", lineHeight: 1.1 }}>Dream Homes</div>
              <div style={{ fontSize: "0.6875rem", color: "#0284c7", fontWeight: "600" }}>dreamhomes42.com</div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{
              background: "#f1f5f9",
              border: "none",
              color: "#475569",
              cursor: "pointer",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body (Exact Match to Screenshots) */}
        <div style={{ padding: "1rem", overflowY: "auto", flex: "1 1 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* SECTION 1: HERO - Premium Builder in Mumbai (Exact Screenshot 2) */}
          <div style={{
            background: "#fafafa",
            borderRadius: "1rem",
            padding: "1rem",
            border: "1px solid #f1f5f9",
            textAlign: "center",
            position: "relative"
          }}>
            <h2 style={{
              fontSize: "1.35rem",
              fontWeight: "900",
              color: "#0f172a",
              margin: "0 0 0.5rem 0",
              letterSpacing: "-0.02em"
            }}>
              Premium Builder in<br />Mumbai
            </h2>

            <p style={{
              fontSize: "0.75rem",
              color: "#64748b",
              lineHeight: "1.5",
              margin: "0 0 1rem 0"
            }}>
              Dream Homes is a trusted real estate company dedicated to helping clients buy, sell, and rent properties across Mumbai. We offer verified property listings, expert market guidance, and personalized support to ensure a smooth and hassle-free real estate experience. Whether you're looking for a cozy 1BHK, a spacious family home, or a smart investment opportunity, Dream Homes is here to help you find the perfect property.
            </p>

            {/* Exact 2 Blue Stat Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                background: "#38bdf8",
                color: "#ffffff",
                borderRadius: "0.875rem",
                padding: "0.85rem 0.5rem",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(56, 189, 248, 0.3)"
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "900", lineHeight: 1.1 }}>500+</div>
                <div style={{ fontSize: "0.71875rem", fontWeight: "700", marginTop: "0.2rem" }}>Properties Listed</div>
              </div>

              <div style={{
                background: "#60a5fa",
                color: "#ffffff",
                borderRadius: "0.875rem",
                padding: "0.85rem 0.5rem",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(96, 165, 250, 0.3)"
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "900", lineHeight: 1.1 }}>200+</div>
                <div style={{ fontSize: "0.71875rem", fontWeight: "700", marginTop: "0.2rem" }}>Happy Customer</div>
              </div>
            </div>

            {/* Exact 3 Milestones with Year Timeline Line */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", textAlign: "left" }}>
              {milestones.map((m) => (
                <div key={m.id} style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  padding: "0.65rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
                }}>
                  <img 
                    src={m.img} 
                    alt={m.title} 
                    style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "0.5rem", marginBottom: "0.45rem" }} 
                  />
                  <div style={{ fontSize: "0.84375rem", fontWeight: "800", color: "#0f172a" }}>{m.title}</div>
                  <div style={{ fontSize: "0.6875rem", color: "#64748b", margin: "0.2rem 0 0.35rem 0", lineHeight: 1.4 }}>{m.desc}</div>
                  
                  {/* Green Timeline Dot & Year */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.35rem", paddingTop: "0.35rem", borderTop: "1px dashed #e2e8f0" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#84cc16", display: "inline-block" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#0f172a" }}>{m.year}</span>
                    <span style={{ fontSize: "0.65625rem", color: "#64748b" }}>• {m.subYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: LISTINGS (Exact Screenshots 1 & 3) */}
          <div>
            <div style={{ textAlign: "center", marginBottom: "0.85rem" }}>
              <h2 style={{ fontSize: "1.45rem", fontWeight: "900", color: "#0f172a", margin: "0 0 0.35rem 0" }}>
                Listings
              </h2>
              <p style={{ fontSize: "0.71875rem", color: "#64748b", margin: 0, lineHeight: 1.45 }}>
                Discover your ideal home from our latest property listings, featuring premium apartments and residences across Mumbai to match every budget.
              </p>
            </div>

            {/* Exact 8 Listing Cards in 2-Column Mobile Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {listingsData.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "0.875rem",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <img 
                      src={item.img} 
                      alt={item.location} 
                      style={{ width: "100%", height: "95px", objectFit: "cover" }} 
                    />
                    <div style={{ padding: "0.55rem" }}>
                      <h4 style={{ fontSize: "0.9375rem", fontWeight: "900", color: item.color, margin: 0 }}>
                        {item.location}
                      </h4>
                      <div style={{ fontSize: "0.6875rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0.15rem 0", lineHeight: 1.3 }}>
                        {item.bhk}
                      </div>
                      <div style={{ fontSize: "0.65625rem", color: "#64748b", lineHeight: 1.3 }}>
                        {item.price}
                      </div>
                    </div>
                  </div>

                  {/* Exact Royal Purple "Click here ›" Button */}
                  <div style={{ padding: "0 0.55rem 0.55rem 0.55rem" }}>
                    <button
                      onClick={() => handleOpenLink(item.link)}
                      style={{
                        width: "100%",
                        background: "#535bf2",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "0.35rem",
                        padding: "0.35rem 0.5rem",
                        fontSize: "0.6875rem",
                        fontWeight: "800",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.2rem",
                        boxShadow: "0 2px 6px rgba(83, 91, 242, 0.3)"
                      }}
                    >
                      Click here <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: FOOTER (Exact Screenshot 1) */}
          <div style={{
            background: "#0b0f19",
            color: "#ffffff",
            borderRadius: "1rem",
            padding: "1.1rem 0.9rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem"
          }}>
            {/* Column 1: Dream Homes */}
            <div>
              <h5 style={{ fontSize: "0.78125rem", fontWeight: "800", color: "#ffffff", margin: "0 0 0.35rem 0", letterSpacing: "0.05em" }}>
                DREAM HOMES
              </h5>
              <div style={{ fontSize: "0.6875rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <div>• Buy, Sell & Rent Properties</div>
                <div>• Verified Property Listings</div>
                <div>• Prime Locations Across Mumbai</div>
                <div>• Expert Real Estate Guidance</div>
                <div>• Transparent & Trusted Service</div>
              </div>
            </div>

            {/* Column 2: Social Media */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", borderTop: "1px solid #1e293b", paddingTop: "0.6rem" }}>
              <div>
                <h5 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#ffffff", margin: "0 0 0.25rem 0" }}>
                  Social Media
                </h5>
                <div style={{ fontSize: "0.6875rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://instagram.com")}>Instagram</span>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://facebook.com")}>Facebook</span>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://youtube.com")}>Youtube</span>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://linkedin.com")}>Linkedin</span>
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#ffffff", margin: "0 0 0.25rem 0" }}>
                  Support
                </h5>
                <div style={{ fontSize: "0.6875rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://dreamhomes42.com/contact/")}>FAQ</span>
                  <span style={{ cursor: "pointer" }} onClick={() => handleOpenLink("https://dreamhomes42.com/contact/")}>Contact</span>
                </div>
              </div>
            </div>

            {/* Column 3: Contacts */}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "0.6rem" }}>
              <h5 style={{ fontSize: "0.75rem", fontWeight: "800", color: "#ffffff", margin: "0 0 0.25rem 0" }}>
                Contacts
              </h5>
              <div style={{ fontSize: "0.6875rem", color: "#38bdf8", fontWeight: "700" }}>
                <a href={`tel:${contactPhone}`} style={{ color: "#38bdf8", textDecoration: "none" }}>{contactPhone}</a>
              </div>
              <div style={{ fontSize: "0.65625rem", color: "#94a3b8", marginTop: "0.25rem", lineHeight: 1.35 }}>
                {officeAddress}
              </div>
            </div>

            {/* Copyright */}
            <div style={{ borderTop: "1px solid #1e293b", paddingTop: "0.5rem", textAlign: "center", fontSize: "0.625rem", color: "#64748b" }}>
              © 2023 Created with Royal Elementor Addons
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
