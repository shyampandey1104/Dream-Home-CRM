# Frappe Backend Integration API Methods for Real Estate CRM

import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def save_real_estate_lead(lead_id, name, phone, email, priority, status, service, location, source, notes=None):
    """
    Saves or updates a Real Estate Lead in Frappe DB.
    """
    doc = None
    if frappe.db.exists("Real Estate Lead", lead_id):
        doc = frappe.get_doc("Real Estate Lead", lead_id)
    else:
        doc = frappe.new_doc("Real Estate Lead")
        doc.name = lead_id

    doc.lead_name = name
    doc.phone = phone
    doc.email = email
    doc.priority = priority
    doc.status = status
    doc.service = service
    doc.location = location
    doc.source = source
    doc.notes = notes

    doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {"status": "success", "lead_id": doc.name}


@frappe.whitelist(allow_guest=True)
def log_call(lead_id, duration, outcome, notes=None, followup_date=None):
    """
    Logs an outbound or inbound call outcome into Frappe Call Log.
    """
    log_doc = frappe.new_doc("Call Log")
    log_doc.lead = lead_id
    log_doc.duration = duration
    log_doc.outcome = outcome
    log_doc.notes = notes
    log_doc.followup_date = followup_date

    log_doc.save(ignore_permissions=True)
    
    # Update Lead Call Count & Status
    if frappe.db.exists("Real Estate Lead", lead_id):
        lead = frappe.get_doc("Real Estate Lead", lead_id)
        lead.call_count = (lead.call_count or 0) + 1
        if outcome == "Deal Closed (Won)":
            lead.status = "CLOSED"
        elif followup_date:
            lead.status = "FOLLOWUP_TODAY"
        lead.save(ignore_permissions=True)

    frappe.db.commit()
    return {"status": "success", "call_log": log_doc.name}


@frappe.whitelist(allow_guest=True)
def handle_social_webhook():
    """
    Webhook Receiver for Facebook, Instagram, and Google Ads Lead Forms
    """
    data = frappe.request.get_json() or {}
    lead_name = data.get("full_name") or data.get("name") or "Social Lead"
    phone = data.get("phone_number") or data.get("phone") or "+91 98000 00000"
    source = data.get("source") or "Instagram Ads"
    service = data.get("service") or "Home Buying"
    location = data.get("location") or "Mumbai"

    lead_id = f"LEAD-{frappe.generate_hash(length=4).upper()}"
    return save_real_estate_lead(
        lead_id=lead_id,
        name=lead_name,
        phone=phone,
        email=data.get("email"),
        priority="HOT",
        status="NEW",
        service=service,
        location=location,
        source=source,
        notes=data.get("notes") or f"Webhook received from {source}"
    )
