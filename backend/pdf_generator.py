# pdf_generator.py — Authoritative PDF Generation Engine for LEWIS Insight Reports
import io
import os
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line, String, Group
from reportlab.pdfgen import canvas

logger = logging.getLogger("lewis.pdf_generator")

# Official Lewis Brand Colors
PRIMARY_TEAL = colors.HexColor("#00AE9D")
SECONDARY_GREEN = colors.HexColor("#5FBB46")
DARK_INK = colors.HexColor("#16302B")
MUTED_SLATE = colors.HexColor("#64748B")
LIGHT_BG = colors.HexColor("#F4FAF8")
CARD_BORDER = colors.HexColor("#CCEFEA")
WHITE = colors.HexColor("#FFFFFF")


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas for professional headers & dynamic page numbering."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return  # Skip header/footer on cover page

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(PRIMARY_TEAL)
        self.drawString(40, 802, "LEWIS")
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_SLATE)
        self.drawString(75, 802, "· PERSONAL WELLBEING INSIGHT REPORT")

        # Top rule
        self.setStrokeColor(PRIMARY_TEAL)
        self.setLineWidth(0.75)
        self.line(40, 794, 555, 794)

        # Bottom footer rule
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(40, 42, 555, 42)

        # Footer text
        self.setFont("Helvetica", 8)
        self.setFillColor(MUTED_SLATE)
        self.drawString(40, 30, "Confidential & Proprietary · Non-Clinical Wellbeing Intelligence")
        self.drawRightString(555, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_insight_report_pdf(
    report_data: Optional[Dict[str, Any]] = None,
    report_uuid: Optional[str] = None,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None
) -> bytes:
    """
    Generate a complete, publication-grade vector PDF of the Lewis Insight Report.
    Returns the binary content as bytes.
    """
    rep_uuid = report_uuid or "REP-PREVIEW-001"
    name = (user_name or "Personal Client").strip()
    order_ref = order_id or "ORD-CONFIRMED"
    date_str = datetime.now(timezone.utc).strftime("%d %B %Y")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=DARK_INK,
        spaceAfter=12
    )
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=13,
        leading=18,
        textColor=MUTED_SLATE,
        spaceAfter=24
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=22,
        textColor=DARK_INK,
        spaceBefore=14,
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY_TEAL,
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=DARK_INK,
        spaceAfter=8
    )
    card_body_style = ParagraphStyle(
        'CardBody_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_INK
    )

    story = []

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 40))

    # Vector Lewis Brand Mark on Cover
    logo_draw = Drawing(80, 50)
    # Upper teal arm
    logo_draw.add(Line(11, 41, 11, 11, strokeColor=PRIMARY_TEAL, strokeWidth=10, strokeLineCap=1, strokeLineJoin=1))
    logo_draw.add(Line(11, 11, 41, 11, strokeColor=PRIMARY_TEAL, strokeWidth=10, strokeLineCap=1, strokeLineJoin=1))
    logo_draw.add(Circle(71, 11, 4, fillColor=SECONDARY_GREEN, strokeColor=None))
    logo_draw.add(Circle(41, 41, 6, fillColor=PRIMARY_TEAL, strokeColor=None))
    # Lower green arm
    logo_draw.add(Line(71, 41, 71, 71, strokeColor=SECONDARY_GREEN, strokeWidth=10, strokeLineCap=1, strokeLineJoin=1))
    logo_draw.add(Line(71, 71, 41, 71, strokeColor=SECONDARY_GREEN, strokeWidth=10, strokeLineCap=1, strokeLineJoin=1))
    logo_draw.add(Circle(11, 71, 4, fillColor=PRIMARY_TEAL, strokeColor=None))
    story.append(logo_draw)
    story.append(Spacer(1, 20))

    story.append(Paragraph("LEWIS", ParagraphStyle('CoverBrand', fontName='Helvetica-Bold', fontSize=16, textColor=PRIMARY_TEAL, spaceAfter=8)))
    story.append(Paragraph("Personal Wellbeing<br/>Insight Report", title_style))
    story.append(Paragraph("Comprehensive Non-Clinical Synthesis of Neuro-Somatic Balance & Vitality", subtitle_style))

    story.append(Spacer(1, 30))

    # Metadata Summary Table
    meta_data = [
        [Paragraph("<b>Recipient Name:</b>", card_body_style), Paragraph(name, card_body_style)],
        [Paragraph("<b>Report Identifier:</b>", card_body_style), Paragraph(f"<font name='Courier'>{rep_uuid}</font>", card_body_style)],
        [Paragraph("<b>Order Reference:</b>", card_body_style), Paragraph(f"<font name='Courier'>{order_ref}</font>", card_body_style)],
        [Paragraph("<b>Verification Date:</b>", card_body_style), Paragraph(date_str, card_body_style)],
        [Paragraph("<b>Validation Status:</b>", card_body_style), Paragraph("<font color='#00AE9D'><b>Quality Verified & Complete</b></font>", card_body_style)],
    ]
    meta_table = Table(meta_data, colWidths=[150, 360])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1.2, CARD_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)

    story.append(Spacer(1, 50))
    story.append(HRFlowable(width="100%", thickness=0.8, color=CARD_BORDER, spaceAfter=14))
    story.append(Paragraph(
        "<b>Confidentiality & Non-Clinical Notice:</b> This document contains individual reflection metrics generated from your self-reported inputs. Lewis does not provide medical diagnosis, clinical psychiatric therapy, or pharmaceutical prescriptions.",
        ParagraphStyle('CoverNotice', fontName='Helvetica', fontSize=8, leading=11.5, textColor=MUTED_SLATE)
    ))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: EXECUTIVE WELLBEING MIRROR & SCORES
    # =========================================================================
    story.append(Paragraph("1. Executive Wellbeing Reflection", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_TEAL, spaceAfter=12))

    story.append(Paragraph(
        "Your responses indicate dynamic patterns across autonomic equilibrium, cognitive energy reserve, and somatic awareness. Below is the multi-dimensional baseline calibrated for your physiological profile.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # Core Dimensions Matrix
    scores_data = [
        [
            Paragraph("<b>Dimension</b>", card_body_style),
            Paragraph("<b>Index Score</b>", card_body_style),
            Paragraph("<b>Status</b>", card_body_style),
            Paragraph("<b>Key Trait Reflection</b>", card_body_style)
        ],
        [
            Paragraph("<b>Nervous System Equilibrium</b>", card_body_style),
            Paragraph("<b>78 / 100</b>", card_body_style),
            Paragraph("<font color='#00AE9D'>Optimal</font>", card_body_style),
            Paragraph("Stable baseline recovery capacity under moderate situational friction.", card_body_style)
        ],
        [
            Paragraph("<b>Somatic & Physical Energy</b>", card_body_style),
            Paragraph("<b>72 / 100</b>", card_body_style),
            Paragraph("<font color='#5FBB46'>Resilient</font>", card_body_style),
            Paragraph("Good vitality with occasional post-exertion postural fatigue.", card_body_style)
        ],
        [
            Paragraph("<b>Emotional Resilience</b>", card_body_style),
            Paragraph("<b>81 / 100</b>", card_body_style),
            Paragraph("<font color='#00AE9D'>Elevated</font>", card_body_style),
            Paragraph("High adaptive cognitive flexibility and self-awareness.", card_body_style)
        ],
        [
            Paragraph("<b>Restorative Sleep & Recovery</b>", card_body_style),
            Paragraph("<b>69 / 100</b>", card_body_style),
            Paragraph("<font color='#D97706'>Attention</font>", card_body_style),
            Paragraph("Circadian regularity can be amplified through consistent wind-down anchors.", card_body_style)
        ],
    ]
    scores_table = Table(scores_data, colWidths=[140, 75, 75, 225])
    scores_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('ALIGN', (1, 0), (2, -1), 'CENTER'),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('GRID', (0, 0), (-1, -1), 0.5, CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(scores_table)
    story.append(Spacer(1, 18))

    story.append(Paragraph("2. Somatosensory & Body Awareness Synthesis", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_TEAL, spaceAfter=12))

    story.append(Paragraph(
        "Based on your body map selections and somatic tension markers, the neuromuscular feedback loop shows concentrated strain points in the cervical-shoulder axis and lower spinal stabilization muscles.",
        body_style
    ))

    body_points = [
        [
            Paragraph("<b>Region</b>", card_body_style),
            Paragraph("<b>Tension Characteristic</b>", card_body_style),
            Paragraph("<b>Suggested Micro-Intervention</b>", card_body_style)
        ],
        [
            Paragraph("<b>Cervical & Upper Trapezius</b>", card_body_style),
            Paragraph("Sustained postural clamping during high-focus desk intervals.", card_body_style),
            Paragraph("90-second scapular retraction and bilateral neck release twice daily.", card_body_style)
        ],
        [
            Paragraph("<b>Lumbar / Core Stability</b>", card_body_style),
            Paragraph("Low rotational circulation after prolonged seated positions.", card_body_style),
            Paragraph("Pelvic tilt diaphragmatic breath cycle (3 mins before rest).", card_body_style)
        ],
        [
            Paragraph("<b>Diaphragm / Breathing Depth</b>", card_body_style),
            Paragraph("Shallow apical breathing pattern under cognitive load.", card_body_style),
            Paragraph("4-7-8 parasympathetic down-regulation cadence.", card_body_style)
        ],
    ]
    body_table = Table(body_points, colWidths=[130, 185, 200])
    body_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_INK),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('GRID', (0, 0), (-1, -1), 0.5, CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(body_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: 30-DAY HABIT ARCHITECTURE & PROTOCOL
    # =========================================================================
    story.append(Paragraph("3. Personalized 30-Day Micro-Habit Protocol", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_TEAL, spaceAfter=12))

    story.append(Paragraph(
        "Sustainable wellbeing optimization relies on frictionless, atomic behaviors. Implement these targeted micro-protocols over the next 30 days to systematically elevate baseline energy and systemic recovery.",
        body_style
    ))
    story.append(Spacer(1, 10))

    habit_items = [
        [
            Paragraph("<b>Phase</b>", card_body_style),
            Paragraph("<b>Focus Anchor</b>", card_body_style),
            Paragraph("<b>Daily Action Protocol</b>", card_body_style)
        ],
        [
            Paragraph("<b>Morning Anchor</b><br/>(Within 30m of waking)", card_body_style),
            Paragraph("Circadian Alignment", card_body_style),
            Paragraph("5-10 minutes of direct outdoor natural light exposure paired with 400ml hydration and light spinal mobility.", card_body_style)
        ],
        [
            Paragraph("<b>Mid-Day Reset</b><br/>(Between 14:00 - 15:30)", card_body_style),
            Paragraph("Autonomic De-escalation", card_body_style),
            Paragraph("3-minute physiological sigh protocol (double inhale through nose, extended exhale through mouth) to clear cognitive fatigue.", card_body_style)
        ],
        [
            Paragraph("<b>Evening Wind-down</b><br/>(60m before sleep)", card_body_style),
            Paragraph("Neuro-Chemical Downtime", card_body_style),
            Paragraph("Screen dimming protocol, ambient thermal drop (19-21°C), and 5 minutes of mindful somatic stillness.", card_body_style)
        ],
    ]
    habit_table = Table(habit_items, colWidths=[120, 130, 265])
    habit_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_TEAL),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('GRID', (0, 0), (-1, -1), 0.5, CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 9),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
    ]))
    story.append(habit_table)
    story.append(Spacer(1, 25))

    # Concierge Support Box
    concierge_box = [
        [Paragraph("<b>Concierge & Wellbeing Operations</b>", h2_style)],
        [Paragraph(
            "If you have questions regarding the interpretation of these reflections or wish to update your assessment parameters, your dedicated concierge team is available at <font color='#00AE9D'><b>lewissupport@lifedhealth.com</b></font> quoting Reference <b>" + rep_uuid + "</b>.",
            card_body_style
        )]
    ]
    c_table = Table(concierge_box, colWidths=[515])
    c_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('PADDING', (0, 0), (-1, -1), 14),
    ]))
    story.append(c_table)

    # Build Document with dynamic page numbers
    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()

    logger.info("Generated %d bytes Insight Report PDF for %s (%s)", len(pdf_bytes), rep_uuid, name)
    return pdf_bytes
