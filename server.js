import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, "leads_db.json");

// Initial seed leads if DB does not exist
const INITIAL_LEADS = [
  {
    id: "LEAD-0037",
    name: "Test Lead Mobile",
    phone: "+919876543210",
    email: "",
    priority: "HOT",
    status: "NEW",
    service: "Home Buying",
    bhkType: "2 BHK",
    location: "Mumbai",
    source: "Direct Walk-in",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Recently Added",
    callCount: 0,
    notes: ""
  },
  {
    id: "LEAD-0036",
    name: "Papa",
    phone: "+919833359249",
    email: "",
    priority: "HOT",
    status: "NEW",
    service: "Home Buying",
    bhkType: "2 BHK",
    location: "Mumbai",
    source: "Direct Walk-in",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Recently Added",
    callCount: 0,
    notes: ""
  },
  {
    id: "LEAD-0035",
    name: "Rohan Varma (Website Form)",
    phone: "+91 98210 99887",
    email: "",
    priority: "HOT",
    status: "FOLLOWUP_TODAY",
    service: "Home Buying",
    bhkType: "2 BHK",
    location: "Mumbai",
    source: "Website Webhook (dreamhomes42.com)",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Recently Added",
    callCount: 3,
    notes: "Inbound Website Form Submission from dreamhomes42.com/contact"
  },
  {
    id: "LEAD-0034",
    name: "Aarav Sharma (YouTube)",
    phone: "+91 98211 77889",
    email: "",
    priority: "HOT",
    status: "NEW",
    service: "Home Buying",
    bhkType: "2 BHK",
    location: "Mumbai",
    source: "YouTube Channel",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Recently Added",
    callCount: 0,
    notes: "Inquiry for Kalpataru Vian 3D Tour"
  },
  {
    id: "LEAD-0033",
    name: "Manish Malhotra (FB Ad)",
    phone: "+91 98209 44332",
    email: "",
    priority: "HOT",
    status: "NEW",
    service: "Home Buying",
    bhkType: "2 BHK",
    location: "Mumbai",
    source: "Facebook Ads",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Recently Added",
    callCount: 0,
    notes: "Inbound lead via Facebook Instant Lead Ad"
  }
];

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Read DB error", e);
  }
  return INITIAL_LEADS;
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Write DB error", e);
  }
}

// Health check
app.get("/", (req, res) => {
  res.send({ status: "online", message: "Dream Homes CRM Cloud Backend is Live 24/7!" });
});

// REST API Endpoints matching Frappe structure
app.all("/api/method/real_estate_crm.real_estate_crm.api.get_leads", (req, res) => {
  const leads = readDb();
  res.json({ message: { status: "success", data: leads } });
});

app.all("/api/method/real_estate_crm.real_estate_crm.api.save_lead", (req, res) => {
  const body = req.body || {};
  const name = body.name || body.lead_name;
  const phone = body.phone;

  if (!name || !phone) {
    return res.status(400).json({ status: "error", message: "Name and Phone required" });
  }

  const leads = readDb();
  let leadId = body.lead_id;

  if (!leadId || leadId.startsWith("LEAD-17")) {
    const nextNum = leads.length + 38;
    leadId = `LEAD-00${nextNum}`;
  }

  const newLead = {
    id: leadId,
    name: name,
    phone: phone,
    email: body.email || "",
    priority: body.priority || "HOT",
    status: body.status || "NEW",
    service: body.service || "Home Buying",
    bhkType: body.bhk_type || body.bhkType || "2 BHK",
    location: body.location || "Mumbai",
    source: body.source || "Direct Walk-in",
    assignedTo: "shyampandey1104@gmail.com",
    assignedArea: "Andheri",
    timeAgo: "Just Now",
    callCount: 0,
    notes: body.notes || ""
  };

  const existingIndex = leads.findIndex(l => l.id === leadId || (l.phone === phone && l.name === name));
  if (existingIndex >= 0) {
    leads[existingIndex] = { ...leads[existingIndex], ...newLead };
  } else {
    leads.unshift(newLead);
  }

  writeDb(leads);
  res.json({ message: { status: "success", lead_id: leadId } });
});

app.all("/api/method/real_estate_crm.real_estate_crm.api.log_call", (req, res) => {
  const body = req.body || {};
  const leadId = body.lead_id || body.leadId;
  const outcome = body.outcome || body.status || "Connected";
  const duration = body.duration || "00:00";
  const notes = body.notes || "";
  const bhkType = body.bhk_type || body.bhkType;
  const callbackTime = body.callback_time || body.followupDate;

  const leads = readDb();
  const existingIndex = leads.findIndex(l => l.id === leadId);
  if (existingIndex >= 0) {
    const lead = leads[existingIndex];
    let newStatus = lead.status;
    if (outcome === "Deal Closed (Won)") {
      newStatus = "CLOSED";
    } else if (callbackTime) {
      newStatus = "FOLLOWUP_TODAY";
    } else {
      newStatus = "FOLLOWUP";
    }
    leads[existingIndex] = {
      ...lead,
      callCount: (lead.callCount || 0) + 1,
      status: newStatus,
      bhkType: bhkType || lead.bhkType,
      notes: notes || lead.notes,
      callbackTime: callbackTime || lead.callbackTime,
      history: [
        {
          date: "Just now",
          outcome: outcome,
          duration: duration,
          note: notes || `Outcome: ${outcome}`
        },
        ...(Array.isArray(lead.history) ? lead.history : [])
      ]
    };
    writeDb(leads);
  }
  res.json({ message: { status: "success", message: "Call logged successfully" } });
});

app.all("/api/method/real_estate_crm.real_estate_crm.api.login_user", (req, res) => {
  const { email, role } = req.body || {};
  res.json({
    message: {
      status: "success",
      user: {
        email: email || "shyampandey1104@gmail.com",
        full_name: "Shyamkumar Pandey",
        role: role || "Telecaller"
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Dream Homes Permanent Cloud Backend running on port ${PORT}`);
});
