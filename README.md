# 🏢 Dream Homes Real Estate CRM (Frappe Custom App + React 19 PWA)

A production-ready, full-stack **Real Estate CRM** built as an official **Frappe v15 Custom App** with a modern **React 19 Progressive Web App (PWA)** mobile-first frontend.

![Frappe App](https://img.shields.io/badge/Frappe-v15.x-blue.svg)
![React](https://img.shields.io/badge/React-19.x-61dafb.svg)
![MariaDB](https://img.shields.io/badge/Database-MariaDB-f29111.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Key Features

- **📊 100% Dynamic MariaDB Metrics**: 9 live performance metric cards (Qualified Leads, Visits Booked, Meetings, Video Calls, 3-Min Calls, Claimed Leads) computed directly from database records with zero static offsets.
- **📞 Real-Time Inbound Calling Webhook**: Integrated with Cloud Telephony (Exotel, Twilio, MCUBE, Tata Telephony, IVR) with Web Audio synthesizer ringtones, vibration alerts, and caller profile popups.
- **🔄 Strict Duplicate Lead Prevention**: Automatic phone normalization (10-digit) and deduplication across manual entry (`+ Lead`) and Excel/CSV bulk import.
- **📋 Full Disposition Lifecycle**: Seamless transitions from Fresh Leads ➡️ Follow-ups ➡️ Site Visits ➡️ Closed Deals persisted in MariaDB.
- **💼 Comprehensive Real Estate Tools**: Digital Business Card with WhatsApp sharing, Comparative Market Analysis (CMA), EMI & Stamp Duty Calculator, Project Surveys, and Document Vault.
- **📱 PWA & Mobile-First**: Installable as a standalone mobile application with offline-resilient caching and service workers.

---

## 📂 Repository Structure

```
Dream-Home-CRM/
├── pyproject.toml                     # Frappe app metadata & dependencies
├── README.md                          # Production documentation
├── license.txt                        # MIT License
├── .editorconfig
├── .eslintrc
├── real_state_crm/                    # 🐍 Official Frappe Custom App
│   ├── __init__.py
│   ├── api.py                         # 45+ Whitelisted MariaDB REST APIs
│   ├── hooks.py                       # App hooks, DocType routing, website routes
│   ├── modules.txt
│   ├── seed_data.py                   # Initial demo real estate listings & data
│   ├── real_state_crm/
│   │   └── doctype/                   # 20+ Custom Frappe DocTypes (JSON + Python)
│   │       ├── real_estate_lead/
│   │       ├── site_visit/
│   │       ├── site_visit_schedule/
│   │       ├── meeting_schedule/
│   │       ├── video_call_schedule/
│   │       ├── lead_notification/
│   │       ├── call_log/
│   │       ├── claimed_lead/
│   │       ├── digital_business_card/
│   │       ├── focus_project/
│   │       ├── property_inventory/
│   │       ├── property_listing/
│   │       ├── work_attendance/
│   │       └── ...
│   ├── public/
│   │   └── frontend/                  # Production-compiled React PWA Bundle
│   └── www/
│       ├── crm.html                   # Frappe portal entry page (/crm)
│       └── crm.py
└── frontend/                          # ⚛️ React 19 Frontend Source Code
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/
    └── src/
        ├── App.jsx
        ├── components/
        └── services/
```

---

## 🚀 Quick Installation on Frappe Bench

### 1. Fetch the App from GitHub
```bash
cd /path/to/frappe-bench
bench get-app https://github.com/shyampandey1104/Dream-Home-CRM.git
```

### 2. Install App to Your Site
```bash
bench --site your_site_name.com install-app real_state_crm
```

### 3. Run Database Migrations & Clear Cache
```bash
bench --site your_site_name.com migrate
bench --site your_site_name.com clear-cache
```

### 4. Access the CRM
Open your browser and navigate to:
```
http://your_site_name.com/crm
```
Or view backend DocTypes in Frappe Desk at `http://your_site_name.com/app/real-estate-lead`.

---

## 🛠️ Frontend Development

If you wish to modify or build the React frontend:

```bash
cd apps/real_state_crm/frontend
npm install
npm run dev        # Starts Vite dev server at http://localhost:5173
npm run build      # Builds production bundle to dist/
```

To sync the new build with Frappe:
```bash
cp -r dist/* ../real_state_crm/public/frontend/
cp dist/index.html ../real_state_crm/www/crm.html
bench --site your_site_name.com clear-cache
```

---

## 🌐 Inbound Call Telephony Webhook

Configure your Cloud Telephony provider (Exotel / Twilio / Tata / IVR) to POST incoming calls to:

```http
POST https://your_site_name.com/api/method/real_state_crm.api.inbound_call_webhook
Content-Type: application/json

{
  "caller_number": "+91 98205 91823",
  "caller_name": "Rohan Verma",
  "source": "Direct IVR Call",
  "location": "Bandra West, Mumbai",
  "bhk": "3 BHK",
  "notes": "Direct caller interested in 3BHK sea view flat"
}
```

---

## 📜 License

This project is licensed under the [MIT License](license.txt).
