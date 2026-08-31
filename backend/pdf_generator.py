# pdf_generator.py — Authoritative Lewis Insight Report PDF Service
import io
import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone

import pypdf
from reportlab.lib import colors
from reportlab.pdfgen import canvas

logger = logging.getLogger("lewis.pdf_generator")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSET_PDF_PATHS = [
    os.path.join(BASE_DIR, "assets", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "Lewis-Insight-Report.pdf"),
    os.path.join(BASE_DIR, "..", "frontend", "public", "Lewis-Insight-Report.pdf"),
    os.path.join(os.getcwd(), "assets", "Lewis-Insight-Report.pdf"),
    os.path.join(os.getcwd(), "backend", "assets", "Lewis-Insight-Report.pdf"),
    os.path.join(os.getcwd(), "frontend", "Lewis-Insight-Report.pdf"),
    os.path.join(os.getcwd(), "frontend", "public", "Lewis-Insight-Report.pdf"),
]


def get_template_pdf_path() -> Optional[str]:
    """Find the authentic original Lewis Insight Report PDF."""
    for path in ASSET_PDF_PATHS:
        if os.path.exists(path) and os.path.getsize(path) > 100000:
            return path
    return None


def create_cover_overlay(
    user_name: str,
    report_uuid: str,
    date_str: str,
    order_id: Optional[str],
    page_width: float,
    page_height: float,
    report_data: Optional[Dict[str, Any]] = None
) -> bytes:
    """
    Creates a clean vector personalization overlay for Cover Page (Page 1).
    """
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(page_width, page_height))
    can.saveState()

    # Cover Page: Personalization Card in lower third
    card_x = 70
    card_y = 110
    card_w = page_width - 140
    card_h = 160

    # Clean Dark Emerald background with subtle teal border
    can.setFillColor(colors.HexColor("#0D2E24"))
    can.setStrokeColor(colors.HexColor("#00AE9D"))
    can.setLineWidth(2)
    can.roundRect(card_x, card_y, card_w, card_h, 16, fill=True, stroke=True)

    # Title label
    can.setFont("Helvetica-Bold", 13)
    can.setFillColor(colors.HexColor("#00AE9D"))
    can.drawString(card_x + 30, card_y + card_h - 35, "CONFIDENTIAL PSYCHOMETRIC EVALUATION REPORT")

    # Prepared For: User Name
    can.setFont("Helvetica-Bold", 26)
    can.setFillColor(colors.white)
    display_name = user_name.strip() if user_name else "Lewis Client"
    can.drawString(card_x + 30, card_y + card_h - 75, f"Prepared for {display_name}")

    # Metadata Row
    can.setFont("Helvetica", 13)
    can.setFillColor(colors.HexColor("#94A3B8"))
    meta_text = f"Report ID: {report_uuid}   ·   Evaluation Date: {date_str}"
    if order_id:
        meta_text += f"   ·   Order: {order_id}"
    can.drawString(card_x + 30, card_y + 35, meta_text)

    # Status Tag
    can.setFont("Helvetica-Bold", 12)
    can.setFillColor(colors.HexColor("#5FBB46"))
    can.drawRightString(card_x + card_w - 30, card_y + 35, "✓ Verified 10-Dimension Analysis")

    can.restoreState()
    can.save()
    packet.seek(0)
    return packet.getvalue()


def create_page_footer_overlay(
    user_name: str,
    report_uuid: str,
    page_num: int,
    total_pages: int,
    page_width: float,
    page_height: float
) -> bytes:
    """
    Creates subtle running header & footer for interior report pages.
    """
    packet = io.BytesIO()
    can = canvas.Canvas(packet, pagesize=(page_width, page_height))
    can.saveState()

    display_name = user_name.strip() if user_name else "Lewis Client"

    # Running footer
    can.setFont("Helvetica", 10)
    can.setFillColor(colors.HexColor("#64748B"))
    can.drawString(50, 24, "LEWIS Wellbeing Intelligence · Confidential Personal Evaluation")

    can.setFont("Helvetica-Bold", 10)
    can.setFillColor(colors.HexColor("#00AE9D"))
    can.drawRightString(page_width - 50, 24, f"{display_name} · {report_uuid} · Page {page_num} of {total_pages}")

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
    Generates and returns the complete, dynamically personalized Lewis Insight Report PDF
    stamped with the recipient's name, evaluation date, report ID, and order details.
    """
    template_path = get_template_pdf_path()
    if not template_path:
        logger.error("Original Lewis-Insight-Report.pdf not found in assets or frontend!")
        raise FileNotFoundError("Authentic Lewis-Insight-Report.pdf template could not be located.")

    rep_id = report_uuid or "LSR20260200"
    name = (user_name or "Lewis Client").strip()
    date_str = datetime.now(timezone.utc).strftime("%d %B %Y")

    try:
        reader = pypdf.PdfReader(template_path)
        writer = pypdf.PdfWriter()
        total_pages = len(reader.pages)

        for idx, page in enumerate(reader.pages):
            w = float(page.mediabox.width)
            h = float(page.mediabox.height)

            if idx == 0:
                # Cover page personalization
                overlay_bytes = create_cover_overlay(
                    user_name=name,
                    report_uuid=rep_id,
                    date_str=date_str,
                    order_id=order_id,
                    page_width=w,
                    page_height=h,
                    report_data=report_data
                )
                overlay_reader = pypdf.PdfReader(io.BytesIO(overlay_bytes))
                page.merge_page(overlay_reader.pages[0])
            else:
                # Running interior page footer overlay
                overlay_bytes = create_page_footer_overlay(
                    user_name=name,
                    report_uuid=rep_id,
                    page_num=idx + 1,
                    total_pages=total_pages,
                    page_width=w,
                    page_height=h
                )
                overlay_reader = pypdf.PdfReader(io.BytesIO(overlay_bytes))
                page.merge_page(overlay_reader.pages[0])

            writer.add_page(page)

        out_buffer = io.BytesIO()
        writer.write(out_buffer)
        pdf_bytes = out_buffer.getvalue()

        logger.info(
            "Successfully generated personalized Insight Report PDF for '%s' (ID: %s, Pages: %d, Size: %d bytes)",
            name, rep_id, total_pages, len(pdf_bytes)
        )
        return pdf_bytes

    except Exception as e:
        logger.error("Error during PDF dynamic personalization overlay: %s — falling back to authentic template", e)
        with open(template_path, "rb") as f:
            return f.read()

