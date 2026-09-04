import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_leads(status=None, priority=None):
    """
    Fetches all Real Estate Leads from Frappe MariaDB.
    """
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority

    leads = frappe.get_all(
        "Real Estate Lead",
        fields=["name", "lead_name", "phone", "email", "priority", "status", "service", "bhk_type", "location", "source", "notes", "call_count", "creation"],
        filters=filters,
        order_by="creation desc"
    )
    return {"status": "success", "data": leads}


@frappe.whitelist(allow_guest=True)
def save_lead(lead_id=None, name=None, phone=None, email=None, priority="HOT", status="NEW", service="Home Buying", bhk_type="2 BHK", location="Mumbai", source="Manual", notes=None):
    """
    Creates or updates a Real Estate Lead in Frappe DB.
    """
    if lead_id and frappe.db.exists("Real Estate Lead", lead_id):
        doc = frappe.get_doc("Real Estate Lead", lead_id)
    else:
        doc = frappe.new_doc("Real Estate Lead")
        if lead_id:
            doc.name = lead_id

    doc.lead_name = name
    doc.phone = phone
    doc.email = email
    doc.priority = priority
    doc.status = status
    doc.service = service
    doc.bhk_type = bhk_type
    doc.location = location
    doc.source = source
    doc.notes = notes

    doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {"status": "success", "lead_id": doc.name}


@frappe.whitelist(allow_guest=True)
def log_call(lead_id, duration, outcome, bhk_type=None, notes=None, followup_date=None):
    """
    Logs an outbound telecaller call outcome into Frappe Call Log.
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
        if bhk_type:
            lead.bhk_type = bhk_type
        if outcome == "Deal Closed (Won)":
            lead.status = "CLOSED"
        elif followup_date:
            lead.status = "FOLLOWUP_TODAY"
        else:
            lead.status = "FOLLOWUP"
        lead.save(ignore_permissions=True)

    frappe.db.commit()
    return {"status": "success", "call_log": log_doc.name}


@frappe.whitelist(allow_guest=True)
def save_attendance(user_email, status, latitude=None, longitude=None, address=None):
    """
    Saves GPS-verified telecaller Work Attendance in Frappe DB.
    """
    att = frappe.new_doc("Work Attendance")
    att.user_email = user_email
    att.status = status
    att.latitude = latitude
    att.longitude = longitude
    att.address = address
    att.timestamp = frappe.utils.now()

    att.save(ignore_permissions=True)
    frappe.db.commit()
    return {"status": "success", "attendance_id": att.name}
