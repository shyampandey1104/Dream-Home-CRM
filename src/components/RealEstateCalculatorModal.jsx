import React, { useState } from "react";
import { X, Calculator, Percent, Building2, Home, Share2, Copy, CheckCircle2, HelpCircle } from "lucide-react";

export default function RealEstateCalculatorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("emi"); // 'emi' | 'stamp' | 'area' | 'yield'
  const [copiedText, setCopiedText] = useState(false);

  // 1. Home Loan EMI Calculator States
  const [propertyPrice, setPropertyPrice] = useState(10000000); // ₹ 1 Cr
  const [downPaymentPct, setDownPaymentPct] = useState(20); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState(20); // 20 years

  // 2. Stamp Duty & Registration States
  const [stampPropertyCost, setStampPropertyCost] = useState(12500000); // ₹ 1.25 Cr
  const [gender, setGender] = useState("male"); // 'male' (5%) | 'female' (4%) | 'joint' (4.5%)
  const [isUrban, setIsUrban] = useState(true); // +1% Metro Cess in Mumbai/PMC

  // 3. Carpet Area vs Super Built-up Converter States
  const [carpetSqft, setCarpetSqft] = useState(750); // 750 sq.ft.
  const [loadingPct, setLoadingPct] = useState(35); // 35% loading

  // 4. Rental Yield & ROI States
  const [buyPrice, setBuyPrice] = useState(9000000); // ₹ 90 Lakhs
  const [monthlyRent, setMonthlyRent] = useState(35000); // ₹ 35,000 / month
  const [annualMaintenance, setAnnualMaintenance] = useState(48000); // ₹ 48,000 / yr

  if (!isOpen) return null;

  // --- EMI CALCULATIONS ---
  const loanAmount = Math.max(0, propertyPrice * (1 - downPaymentPct / 100));
  const downPaymentAmount = propertyPrice * (downPaymentPct / 100);
  const monthlyInterestRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let emi = 0;
  if (monthlyInterestRate > 0 && totalMonths > 0) {
    emi = Math.round(
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    );
  }
  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // --- STAMP DUTY CALCULATIONS ---
  let stampDutyPct = 5;
  if (gender === "female") stampDutyPct = 4;
  if (gender === "joint") stampDutyPct = 4.5;
  if (isUrban) stampDutyPct += 1; // +1% Metro Cess in Mumbai

  const stampDutyAmount = Math.round(stampPropertyCost * (stampDutyPct / 100));
  const registrationFee = Math.min(30000, Math.round(stampPropertyCost * 0.01)); // Cap at ₹30,000 in Maharashtra
  const totalAcquisitionCost = stampPropertyCost + stampDutyAmount + registrationFee;

  // --- AREA CONVERSION CALCULATIONS ---
  const builtUpSqft = Math.round(carpetSqft * (1 + loadingPct / 100));
  const carpetSqMtr = (carpetSqft * 0.092903).toFixed(2);
  const builtUpSqMtr = (builtUpSqft * 0.092903).toFixed(2);

  // --- RENTAL YIELD CALCULATIONS ---
  const annualRent = monthlyRent * 12;
  const grossYield = buyPrice > 0 ? ((annualRent / buyPrice) * 100).toFixed(2) : 0;
  const netAnnualIncome = Math.max(0, annualRent - annualMaintenance);
  const netYield = buyPrice > 0 ? ((netAnnualIncome / buyPrice) * 100).toFixed(2) : 0;

  const formatINR = (val) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  const handleShareResult = () => {
    let summaryText = "";
    if (activeTab === "emi") {
      summaryText = `🏠 *Real Estate EMI Calculation summary*\n• Property Price: ${formatINR(propertyPrice)}\n• Loan Amount: ${formatINR(loanAmount)}\n• Monthly EMI: ${formatINR(emi)}\n• Total Interest: ${formatINR(totalInterest)}\n• Tenure: ${tenureYears} Years @ ${interestRate}% p.a.`;
    } else if (activeTab === "stamp") {
      summaryText = `🏛️ *Stamp Duty & Registration (Mumbai/MH)*\n• Property Cost: ${formatINR(stampPropertyCost)}\n• Stamp Duty (${stampDutyPct}%): ${formatINR(stampDutyAmount)}\n• Registration Fee: ${formatINR(registrationFee)}\n• Total Cost: ${formatINR(totalAcquisitionCost)}`;
    } else if (activeTab === "area") {
      summaryText = `📐 *Carpet Area & Built-up Conversion*\n• Carpet Area: ${carpetSqft} sq.ft (${carpetSqMtr} sq.m)\n• Loading Factor: ${loadingPct}%\n• Super Built-up Area: ${builtUpSqft} sq.ft (${builtUpSqMtr} sq.m)`;
    } else {
      summaryText = `📈 *Rental Yield & ROI Calculation*\n• Property Price: ${formatINR(buyPrice)}\n• Monthly Rent: ${formatINR(monthlyRent)}\n• Gross Yield: ${grossYield}%\n• Net Yield: ${netYield}% p.a.`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
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
          background: "#ffffff",
          borderRadius: "1.5rem",
          width: "92%",
          maxWidth: "390px",
          maxHeight: "calc(100% - 1rem)",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          animation: "scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Luxury Header */}
        <div style={{
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#ffffff",
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(217,119,6,0.3)" }}>
              <Calculator size={17} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                Real Estate Calculator
              </h3>
              <p style={{ fontSize: "0.6875rem", color: "#94a3b8", margin: 0 }}>
                EMI, Stamp Duty, Area Loading & Rental ROI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#cbd5e1",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-Tabs Pill Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", padding: "0.6rem 0.75rem", gap: "0.35rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            { id: "emi", label: "Home Loan EMI", icon: <Home size={14} color="#2563eb" /> },
            { id: "stamp", label: "Stamp Duty", icon: <Building2 size={14} color="#d97706" /> },
            { id: "area", label: "Carpet Area", icon: <Percent size={14} color="#16a34a" /> },
            { id: "yield", label: "Rental ROI", icon: <Calculator size={14} color="#9333ea" /> }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.45rem 0.7rem",
                border: activeTab === tab.id ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                borderRadius: "9999px",
                background: activeTab === tab.id ? "#eff6ff" : "#ffffff",
                color: activeTab === tab.id ? "#2563eb" : "#64748b",
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: "0.75rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: activeTab === tab.id ? "0 2px 6px rgba(37,99,235,0.12)" : "none"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Body */}
        <div style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* TAB 1: HOME LOAN EMI CALCULATOR */}
          {activeTab === "emi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* EMI Result Summary Card */}
              <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "1rem", padding: "1rem", color: "#ffffff", textAlign: "center", boxShadow: "0 8px 20px rgba(15,23,42,0.25)" }}>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Estimated Monthly EMI
                </div>
                <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "#38bdf8", margin: "0.25rem 0" }}>
                  {formatINR(emi)} <span style={{ fontSize: "0.75rem", color: "#cbd5e1", fontWeight: 500 }}>/ mo</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.75rem" }}>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block" }}>Loan Amount</span>
                    <strong style={{ color: "#ffffff" }}>{formatINR(loanAmount)}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block" }}>Total Interest</span>
                    <strong style={{ color: "#f43f5e" }}>{formatINR(totalInterest)}</strong>
                  </div>
                </div>
              </div>

              {/* Slider Inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78125rem", fontWeight: 700, color: "#334155" }}>
                    <span>Property Price</span>
                    <span style={{ color: "#2563eb" }}>{formatINR(propertyPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000000}
                    max={50000000}
                    step={500000}
                    value={propertyPrice}
                    onChange={e => setPropertyPrice(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2563eb", marginTop: "0.3rem" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78125rem", fontWeight: 700, color: "#334155" }}>
                    <span>Down Payment ({downPaymentPct}%)</span>
                    <span style={{ color: "#16a34a" }}>{formatINR(downPaymentAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={downPaymentPct}
                    onChange={e => setDownPaymentPct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#16a34a", marginTop: "0.3rem" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                      Interest Rate (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="modern-search-input"
                      value={interestRate}
                      onChange={e => setInterestRate(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                      Loan Tenure (Years)
                    </label>
                    <input
                      type="number"
                      className="modern-search-input"
                      value={tenureYears}
                      onChange={e => setTenureYears(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAMP DUTY & REGISTRATION */}
          {activeTab === "stamp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Summary Box */}
              <div style={{ background: "linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)", border: "1px solid #f59e0b", borderRadius: "1rem", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 700, textTransform: "uppercase" }}>
                  Total Acquisition Govt Fees (Mumbai / MH)
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#92400e", margin: "0.25rem 0" }}>
                  {formatINR(stampDutyAmount + registrationFee)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 600 }}>
                  Total Property Purchase Cost: <strong>{formatINR(totalAcquisitionCost)}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Agreement Property Value (₹)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    className="modern-search-input"
                    value={stampPropertyCost}
                    onChange={e => setStampPropertyCost(Number(e.target.value))}
                    style={{ fontWeight: 800, color: "#0f172a" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.35rem" }}>
                    Buyer Gender Category
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                    {[
                      { id: "male", label: "Male (6%)" },
                      { id: "female", label: "Female (5%)" },
                      { id: "joint", label: "Joint (5.5%)" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGender(opt.id)}
                        style={{
                          padding: "0.45rem 0.25rem",
                          fontSize: "0.72rem",
                          fontWeight: gender === opt.id ? 800 : 600,
                          borderRadius: "0.5rem",
                          border: gender === opt.id ? "1.5px solid #d97706" : "1px solid #e2e8f0",
                          background: gender === opt.id ? "#fffbe6" : "#ffffff",
                          color: gender === opt.id ? "#b45309" : "#64748b",
                          cursor: "pointer"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.75rem", fontSize: "0.75rem", color: "#475569", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Stamp Duty ({stampDutyPct}%):</span>
                    <strong style={{ color: "#0f172a" }}>{formatINR(stampDutyAmount)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Registration Fee (Cap ₹30,000):</span>
                    <strong style={{ color: "#0f172a" }}>{formatINR(registrationFee)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARPET AREA VS SUPER BUILT-UP CONVERTER */}
          {activeTab === "area" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0", borderRadius: "1rem", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>
                  Super Built-up Area ({loadingPct}% Loading)
                </div>
                <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "#15803d", margin: "0.25rem 0" }}>
                  {builtUpSqft} <span style={{ fontSize: "0.85rem" }}>sq.ft</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 600 }}>
                  Equivalent: <strong>{builtUpSqMtr} sq.m</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78125rem", fontWeight: 700, color: "#334155" }}>
                    <span>RERA Carpet Area</span>
                    <span style={{ color: "#16a34a" }}>{carpetSqft} sq.ft ({carpetSqMtr} sq.m)</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={4000}
                    step={25}
                    value={carpetSqft}
                    onChange={e => setCarpetSqft(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#16a34a", marginTop: "0.3rem" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78125rem", fontWeight: 700, color: "#334155" }}>
                    <span>Builder Loading Factor ({loadingPct}%)</span>
                    <span style={{ color: "#2563eb" }}>+ {builtUpSqft - carpetSqft} sq.ft</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    step={1}
                    value={loadingPct}
                    onChange={e => setLoadingPct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2563eb", marginTop: "0.3rem" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RENTAL YIELD & ROI */}
          {activeTab === "yield" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", border: "1px solid #e9d5ff", borderRadius: "1rem", padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: "#7e22ce", fontWeight: 700, textTransform: "uppercase" }}>
                  Estimated Rental Yield (ROI)
                </div>
                <div style={{ fontSize: "1.65rem", fontWeight: 900, color: "#6b21a8", margin: "0.25rem 0" }}>
                  {netYield}% <span style={{ fontSize: "0.75rem", color: "#7e22ce" }}>p.a. Net</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#7e22ce", fontWeight: 600 }}>
                  Gross Yield: <strong>{grossYield}%</strong> • Annual Income: <strong>{formatINR(netAnnualIncome)}</strong>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                    Total Property Investment Value (₹)
                  </label>
                  <input
                    type="number"
                    step="500000"
                    className="modern-search-input"
                    value={buyPrice}
                    onChange={e => setBuyPrice(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                      Expected Monthly Rent (₹)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      className="modern-search-input"
                      value={monthlyRent}
                      onChange={e => setMonthlyRent(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.25rem" }}>
                      Annual Maintenance (₹)
                    </label>
                    <input
                      type="number"
                      step="2000"
                      className="modern-search-input"
                      value={annualMaintenance}
                      onChange={e => setAnnualMaintenance(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Copy / Share Button */}
          <button
            type="button"
            onClick={handleShareResult}
            style={{
              background: copiedText ? "#16a34a" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              boxShadow: "0 4px 14px rgba(15,23,42,0.25)",
              marginTop: "0.25rem"
            }}
          >
            {copiedText ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
            {copiedText ? "Calculation Summary Copied to Clipboard!" : "Copy & Share Calculation Summary"}
          </button>
        </div>
      </div>
    </div>
  );
}
