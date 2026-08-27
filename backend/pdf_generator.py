# pdf_generator.py — Authoritative Lewis Insight Report PDF Service
import io
import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone

import pypdf
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas

logger = logging.getLogger("lewis.pdf_generator")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSET_PDF_PATHS = [
    os.path.join(BASE_DIR, "assets", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "public", "Lewis-Insight-Report.pdf"),
]


def get_template_pdf_path() -> Optional[str]:
    """Find the authentic original Lewis Insight Report PDF."""
    for path in ASSET_PDF_PATHS:
        if os.path.exists(path) and os.path.getsize(path) > 100000:
            return path
    return None


def create_personalization_overlay(user_name: str, date_str: str, page_width: float, page_height: float) -> bytes:
    """
    Creates a dynamic vector overlay for Page 1 of the authentic Lewis Insight Report.
    """
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(page_width, page_height))
    
    # Cover page overlay coordinates (matches the official layout)
    # Background color fill box over the template name to cleanly replace with recipient name
    can.saveState()
    can.setFillColor(colors.HexColor("#0D2E24"))  # Match dark emerald cover background
    can.rect(page_width - 240, page_height - 290, 200, 50, fill=True, stroke=False)
    
    # Draw Name & Date
    can.setFont("Helvetica-Bold", 13)
    can.setFillColor(colors.white)
    can.drawRightString(page_width - 40, page_height - 262, user_name)
    
    can.setFont("Helvetica", 9)
    can.setFillColor(colors.HexColor("#94A3B8"))
    can.drawRightString(page_width - 40, page_height - 278, date_str)
    
    can.restoreState()
    can.save()
    
    packet.seek(0)
    return packet.getvalue()


def build_insight_report_pdf(
    report_data: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None
) -> bytes:
    """
    Returns the exact authentic original Lewis Insight Report PDF directly
    matching frontend/Lewis-Insight-Report.pdf.
    """
    template_path = get_template_pdf_path()
    if not template_path:
        logger.error("Original Lewis-Insight-Report.pdf not found in assets or frontend!")
        raise FileNotFoundError("Authentic Lewis-Insight-Report.pdf template could not be located.")

    logger.info("Serving exact authentic Lewis Insight Report PDF from %s (%d bytes)", template_path, os.path.getsize(template_path))
    with open(template_path, "rb") as f:
        return f.read()
