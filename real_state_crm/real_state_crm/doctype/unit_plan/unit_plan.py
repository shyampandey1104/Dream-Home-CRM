# Copyright (c) 2026, Dream Homes and contributors
# For license information, please see license.txt

from frappe.model.document import Document
from frappe.model.naming import make_autoname

class UnitPlan(Document):
    def autoname(self):
        if not self.name or ".####" in str(self.name):
            self.name = make_autoname("UP-.####")

