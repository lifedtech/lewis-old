# mailer.py — Automated Email Delivery Engine via Brevo SMTP
import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("lewis.mailer")

MAIL_HOST = os.getenv("MAIL_HOST", "smtp-relay.brevo.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "a3b03f001@smtp-brevo.com")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
MAIL_FROM_ADDRESS = os.getenv("MAIL_FROM_ADDRESS", "lewissupport@lifedhealth.com")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "LEWIS Well-Being").replace('"', '')
MAIL_EHLO_DOMAIN = os.getenv("MAIL_EHLO_DOMAIN", "lifedhealth.com")


def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    bcc: Optional[List[str]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None
) -> bool:
    """
    Send an email via Brevo SMTP using TLS with optional attachments.
    """
    if not to_email or "@" not in to_email:
        logger.warning("Invalid destination email: %s", to_email)
        return False

    if not MAIL_USERNAME or not MAIL_PASSWORD:
        logger.warning("SMTP credentials not configured. Email to %s skipped.", to_email)
        return False

    try:
        if attachments:
            msg = MIMEMultipart("mixed")
            body_part = MIMEMultipart("alternative")
            if text_content:
                body_part.attach(MIMEText(text_content, "plain", "utf-8"))
            body_part.attach(MIMEText(html_content, "html", "utf-8"))
            msg.attach(body_part)

            for att in attachments:
                fname = att.get("filename", "attachment.pdf")
                content = att.get("content", b"")
                subtype = att.get("subtype", "pdf")
                part = MIMEApplication(content, _subtype=subtype)
                part.add_header("Content-Disposition", "attachment", filename=fname)
                msg.attach(part)
        else:
            msg = MIMEMultipart("alternative")
            if text_content:
                msg.attach(MIMEText(text_content, "plain", "utf-8"))
            msg.attach(MIMEText(html_content, "html", "utf-8"))

        msg["Subject"] = subject
        msg["From"] = f"{MAIL_FROM_NAME} <{MAIL_FROM_ADDRESS}>"
        msg["To"] = to_email

        recipients = [to_email]
        if bcc:
            recipients.extend(bcc)

        # Try the configured port first, then fall back. 465 used to be tried
        # first with a 25s timeout, but cloud egress (Railway included) commonly
        # filters/blackholes 465 instead of refusing it outright — a filtered
        # port doesn't fail fast, it hangs until the timeout. That silently
        # cost every single email an extra ~25s before falling through to 587
        # (the port that actually works), which is the "mail is delayed" bug.
        connected = False
        last_err = None

        ports_to_try = [MAIL_PORT, 587, 465, 2525]
        # Deduplicate while preserving order
        unique_ports = list(dict.fromkeys(ports_to_try))

        for port in unique_ports:
            try:
                if port == 465:
                    server = smtplib.SMTP_SSL(MAIL_HOST, port, timeout=10)
                    server.ehlo(MAIL_EHLO_DOMAIN)
                else:
                    server = smtplib.SMTP(MAIL_HOST, port, timeout=10)
                    server.ehlo(MAIL_EHLO_DOMAIN)
                    server.starttls()
                    server.ehlo(MAIL_EHLO_DOMAIN)

                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.sendmail(MAIL_FROM_ADDRESS, recipients, msg.as_string())
                server.quit()
                connected = True
                logger.info("Successfully dispatched email to %s via port %d (Subject: %s, Attachments: %d)", to_email, port, subject, len(attachments or []))
                break
            except Exception as e:
                last_err = e
                logger.warning("SMTP attempt on port %d failed: %s; trying next port...", port, e)

        if not connected:
            logger.error("Failed to send email to %s after all port attempts: %s", to_email, last_err)
            return False

        return True
    except Exception as exc:
        logger.error("Failed to send email to %s: %s", to_email, exc)
        return False


def send_payment_confirmation_email(
    user_email: str,
    user_name: Optional[str] = None,
    order_id: Optional[str] = None,
    payment_id: Optional[str] = None,
    amount_formatted: Optional[str] = "₹749",
    currency: Optional[str] = "INR",
    report_uuid: Optional[str] = None
) -> bool:
    """
    Send a customer confirmation email after payment.
    Informs user that their report is preparing and will arrive in 5–10 mins.
    """
    name = (user_name or "there").strip()
    order_ref = order_id or "ORD-REF"
    txn_ref = payment_id or "TXN-VERIFIED"
    price_str = amount_formatted or "₹749"
    date_str = datetime.now(timezone.utc).strftime("%d %B %Y, %H:%M UTC")

    subject = f"Your LEWIS Personal Wellbeing Report is Preparing · Order {order_ref}"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation</title>
      <style>
        body {{
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4faf8;
          margin: 0;
          padding: 24px 12px;
          color: #334155;
        }}
        .email-card {{
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 174, 157, 0.08);
          border: 1px solid rgba(0, 174, 157, 0.16);
        }}
        .header {{
          background: linear-gradient(135deg, #00ae9d 0%, #017a6f 100%);
          padding: 32px 32px 26px;
          text-align: center;
          color: #ffffff;
        }}
        .header h1 {{
          margin: 10px 0 4px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }}
        .header p {{
          margin: 0;
          font-size: 13.5px;
          opacity: 0.92;
        }}
        .content {{
          padding: 32px 30px;
        }}
        .greeting {{
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 14px;
        }}
        .notice-box {{
          background: #f0fdf9;
          border-left: 4px solid #00ae9d;
          border-radius: 12px;
          padding: 16px 20px;
          margin: 20px 0;
        }}
        .notice-box h3 {{
          margin: 0 0 6px 0;
          color: #007064;
          font-size: 14.5px;
          font-weight: 800;
        }}
        .notice-box p {{
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #134e48;
        }}
        .details-table {{
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0 12px;
          font-size: 13.5px;
        }}
        .details-table tr {{
          border-bottom: 1px solid #f1f5f9;
        }}
        .details-table td {{
          padding: 12px 4px;
        }}
        .details-table td.label {{
          color: #64748b;
          font-weight: 600;
        }}
        .details-table td.val {{
          text-align: right;
          color: #1e293b;
          font-weight: 700;
        }}
        .footer {{
          background: #f8fafc;
          padding: 24px 30px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }}
      </style>
    </head>
    <body>
      <div class="email-card">
        <div class="header">
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 8px;">
            <tr>
              <td style="vertical-align: middle; padding-right: 10px;">
                <svg width="32" height="32" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#86efac" />
                  <circle cx="41" cy="41" r="11" fill="#ffffff" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#86efac" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#ffffff" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Lewis</span>
              </td>
            </tr>
          </table>
          <h1>Payment Confirmed</h1>
          <p>Thank you for choosing Lewis Wellbeing Intelligence</p>
        </div>

        <div class="content">
          <div class="greeting">Hello {name},</div>
          <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            We have received your payment for the <strong>Personal Insight Report</strong>.
          </p>

          <div class="notice-box">
            <h3>Preparing Your Report</h3>
            <p>
              Your full personalized report is being prepared. 
              <strong>You will receive your complete report directly at this email address within 5 to 10 minutes.</strong>
            </p>
            <p style="margin-top: 8px; font-size: 12px; color: #0f766e;">
              Please check your Spam or Promotions folder if you do not see it in your primary inbox within 10 minutes.
            </p>
          </div>

          <!-- Order Summary Details -->
          <table class="details-table">
            <tr>
              <td class="label">Item</td>
              <td class="val">Personal Insight Report (PDF)</td>
            </tr>
            <tr>
              <td class="label">Amount Paid</td>
              <td class="val" style="color: #00ae9d; font-size: 15px;">{price_str}</td>
            </tr>
            <tr>
              <td class="label">Order ID</td>
              <td class="val" style="font-family: monospace; font-size: 12.5px;">{order_ref}</td>
            </tr>
            <tr>
              <td class="label">Payment Transaction ID</td>
              <td class="val" style="font-family: monospace; font-size: 12.5px;">{txn_ref}</td>
            </tr>
            <tr>
              <td class="label">Date</td>
              <td class="val">{date_str}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b; line-height: 1.5;">
            If you have any questions or need assistance, write to us at 
            <a href="mailto:lewissupport@lifedhealth.com" style="color: #00ae9d; font-weight: 700; text-decoration: none;">lewissupport@lifedhealth.com</a> quoting your Order ID.
          </div>

          <!-- Lewis Brand Signature -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; width: 100%;">
            <tr>
              <td style="vertical-align: middle; width: 34px; padding-right: 12px;">
                <svg width="30" height="30" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#5FBB46" />
                  <circle cx="41" cy="41" r="11" fill="#00AE9D" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#00AE9D" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 800; color: #16302B; letter-spacing: -0.02em;">Lewis</span>
                <div style="font-size: 11.5px; color: #64748b; margin-top: 1px;">Wellbeing Intelligence</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px;">© 2026 LEWIS Well-Being · A Lifed Health Intelligence System</p>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            Lewis is a non-clinical wellbeing reflection and does not provide medical diagnosis or psychiatric treatment.
          </p>
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
Hello {name},

Thank you for purchasing the LEWIS Personal Insight Report.

Payment received: {price_str}
Order ID: {order_ref}
Payment Transaction ID: {txn_ref}

Your report is currently being prepared. You will receive your complete report directly at this email address within 5 to 10 minutes.

Note: Please check your Spam or Promotions folder if you do not see it in your primary inbox within 10 minutes.

Support: lewissupport@lifedhealth.com

Lewis Wellbeing Intelligence
A Lifed Health Intelligence System
    """

    sent = send_email(to_email=user_email, subject=subject, html_content=html_content, text_content=text_content)
    if sent and order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "confirmation", True)
        except Exception:
            pass
    return sent


def send_support_notification_email(
    user_name: str,
    user_email: str,
    query_text: str,
    screen_name: Optional[str] = "General",
    query_id: Optional[str] = None
) -> bool:
    """
    Forward incoming support query to the LEWIS support team and send an immediate reassurance email to the user.
    """
    ticket_id = query_id or f"TICK-{datetime.now(timezone.utc).strftime('%H%M%S')}"
    name_clean = (user_name or "there").strip()

    # 1. Forward to Internal Support Team
    team_subject = f"[Support Ticket #{ticket_id}] From {name_clean} ({user_email}) · Screen: {screen_name}"
    team_html = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #00ae9d; margin: 0 0 12px 0; font-size: 18px;">New LEWIS Support Request · #{ticket_id}</h2>
        <table style="width: 100%; font-size: 13.5px; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 120px;"><strong>Client Name:</strong></td><td style="padding: 6px 0; color: #0f172a;">{name_clean}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Client Email:</strong></td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:{user_email}" style="color: #00ae9d;">{user_email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Origin Screen:</strong></td><td style="padding: 6px 0; color: #0f172a;">{screen_name}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Ticket ID:</strong></td><td style="padding: 6px 0; font-family: monospace; font-weight: 700; color: #00ae9d;">{ticket_id}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Received:</strong></td><td style="padding: 6px 0; color: #64748b;">{datetime.now(timezone.utc).strftime("%d %B %Y, %H:%M UTC")}</td></tr>
        </table>
        <h4 style="margin: 12px 0 6px; color: #334155; font-size: 14px;">User's Message / Problem:</h4>
        <div style="background: #f4faf8; border-left: 4px solid #00ae9d; border-radius: 8px; padding: 14px 16px; margin: 0 0 16px 0; color: #334155; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">
{query_text}
        </div>
      </div>
    </div>
    """
    send_email(to_email=MAIL_FROM_ADDRESS, subject=team_subject, html_content=team_html)

    # 2. Reassurance Confirmation Email to User
    user_subject = f"We have received your support request · Ticket #{ticket_id}"
    user_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Request Received</title>
      <style>
        body {{
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4faf8;
          margin: 0;
          padding: 24px 12px;
          color: #334155;
        }}
        .email-card {{
          max-width: 580px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 174, 157, 0.08);
          border: 1px solid rgba(0, 174, 157, 0.16);
        }}
        .header {{
          background: linear-gradient(135deg, #00ae9d 0%, #017a6f 100%);
          padding: 28px 28px 24px;
          text-align: center;
          color: #ffffff;
        }}
        .header h1 {{
          margin: 8px 0 2px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }}
        .content {{
          padding: 28px 26px;
        }}
        .greeting {{
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }}
        .query-box {{
          background: #f8fafc;
          border-left: 3.5px solid #00ae9d;
          border-radius: 8px;
          padding: 12px 16px;
          margin: 16px 0;
          font-size: 13.5px;
          color: #475569;
          font-style: italic;
          line-height: 1.5;
        }}
        .status-box {{
          background: #eafbf7;
          border: 1.5px solid #00ae9d;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 18px 0;
          font-size: 13.5px;
          color: #016257;
          line-height: 1.5;
        }}
        .footer {{
          background: #f8fafc;
          padding: 20px 26px;
          text-align: center;
          font-size: 11.5px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }}
      </style>
    </head>
    <body>
      <div class="email-card">
        <div class="header">
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 6px;">
            <tr>
              <td style="vertical-align: middle; padding-right: 8px;">
                <svg width="28" height="28" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#86efac" />
                  <circle cx="41" cy="41" r="11" fill="#ffffff" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#86efac" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#ffffff" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 800; color: #ffffff;">Lewis</span>
              </td>
            </tr>
          </table>
          <h1>Support Request Received</h1>
          <p style="margin: 0; font-size: 12.5px; opacity: 0.9;">Ticket #{ticket_id}</p>
        </div>

        <div class="content">
          <div class="greeting">Hello {name_clean},</div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 12px;">
            We have received your support query. Our support executive is actively reviewing your request and will look after this to resolve the problem you have faced as quickly as possible.
          </p>

          <div class="status-box">
            <strong>What happens next:</strong> Our executive will investigate your inquiry and reply directly to this email address (<strong>{user_email}</strong>).
          </div>

          <div style="font-size: 13px; font-weight: 700; color: #334155; margin-top: 14px;">Your submitted query:</div>
          <div class="query-box">
            "{query_text}"
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 16px 0 0;">
            If you have any further details or screenshots to share, you can simply reply directly to this email.
          </p>

          <!-- Lewis Brand Signature -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 22px; padding-top: 16px; border-top: 1px solid #e2e8f0; width: 100%;">
            <tr>
              <td style="vertical-align: middle; width: 30px; padding-right: 10px;">
                <svg width="26" height="26" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#5FBB46" />
                  <circle cx="41" cy="41" r="11" fill="#00AE9D" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#00AE9D" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 800; color: #16302B;">Lewis Concierge & Support Team</span>
                <div style="font-size: 11px; color: #64748b; margin-top: 1px;"><a href="mailto:lewissupport@lifedhealth.com" style="color: #00ae9d; text-decoration: none;">lewissupport@lifedhealth.com</a></div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p style="margin: 0;">© 2026 LEWIS Well-Being · A Lifed Health Intelligence System</p>
        </div>
      </div>
    </body>
    </html>
    """

    user_text = f"""
Hello {name_clean},

We have received your support query (Ticket #{ticket_id}).

Our support executive is reviewing your request and will look after this to resolve the problem you have faced as quickly as possible.

Your submitted query:
"{query_text}"

If you have additional details or screenshots, simply reply to this email.

Best regards,
LEWIS Support Team
lewissupport@lifedhealth.com
    """

    return send_email(
        to_email=user_email,
        subject=user_subject,
        html_content=user_html,
        text_content=user_text
    )


def send_report_delivery_email(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None,
    report_data: Optional[Dict[str, Any]] = None
) -> bool:
    """
    Send the completed Personal Wellbeing Insight Report to user email with attached PDF.
    """
    name = (user_name or "there").strip()
    rep_id = report_uuid or "LSR20260200"
    order_ref = order_id or "LS20260100"
    date_str = datetime.now(timezone.utc).strftime("%d %B %Y")
    
    # Resolve public production domain (filter out localhost)
    raw_frontends = [u.strip() for u in os.getenv("FRONTEND_URL", "").split(",") if u.strip()]
    prod_frontends = [u for u in raw_frontends if "localhost" not in u and "127.0.0.1" not in u]
    frontend_base = prod_frontends[0] if prod_frontends else "https://lewiswellbeing.com"
    report_link = f"{frontend_base}/#mirror"

    # 1. Load exact authentic 25-page PDF Attachment
    pdf_bytes = None
    try:
        from pdf_generator import build_insight_report_pdf
        pdf_bytes = build_insight_report_pdf(
            report_data=report_data,
            report_uuid=rep_id,
            user_name=name,
            order_id=order_ref
        )
    except Exception as pdf_err:
        logger.error("Failed to generate PDF for attachment (%s): %s", rep_id, pdf_err)

    pdf_filename = f"LEWIS-Insight-Report-{rep_id}.pdf"
    attachments = []
    if pdf_bytes:
        attachments.append({
            "filename": pdf_filename,
            "content": pdf_bytes,
            "maintype": "application",
            "subtype": "pdf"
        })

    subject = f"Your LEWIS Personal Wellbeing Insight Report · Report ID {rep_id}"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Personal Wellbeing Insight Report</title>
      <style>
        body {{
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
          background-color: #f4faf8;
          margin: 0;
          padding: 24px 12px;
          color: #334155;
        }}
        .email-card {{
          max-width: 620px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 174, 157, 0.08);
          border: 1px solid rgba(0, 174, 157, 0.16);
        }}
        .header {{
          background: linear-gradient(135deg, #00ae9d 0%, #017a6f 100%);
          padding: 32px 32px 26px;
          text-align: center;
          color: #ffffff;
        }}
        .header h1 {{
          margin: 10px 0 4px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }}
        .header p {{
          margin: 0;
          font-size: 13.5px;
          opacity: 0.92;
        }}
        .content {{
          padding: 32px 30px;
        }}
        .greeting {{
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 14px;
        }}
        .pdf-attached-box {{
          background: #eafbf7;
          border: 1.5px solid #00ae9d;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 16px 0;
        }}
        .summary-card {{
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px 20px;
          margin: 20px 0;
        }}
        .btn {{
          display: inline-block;
          background: linear-gradient(135deg, #00ae9d 0%, #017a6f 100%);
          color: #ffffff !important;
          text-decoration: none;
          padding: 13px 26px;
          font-weight: 700;
          font-size: 14.5px;
          border-radius: 999px;
          box-shadow: 0 4px 16px rgba(0, 174, 157, 0.3);
          margin: 14px 0;
          text-align: center;
        }}
        .footer {{
          background: #f8fafc;
          padding: 24px 30px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
        }}
      </style>
    </head>
    <body>
      <div class="email-card">
        <div class="header">
          <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 8px;">
            <tr>
              <td style="vertical-align: middle; padding-right: 10px;">
                <svg width="32" height="32" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#86efac" />
                  <circle cx="41" cy="41" r="11" fill="#ffffff" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#86efac" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#ffffff" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Lewis</span>
              </td>
            </tr>
          </table>
          <h1>Your Personalised Insight Report</h1>
          <p>Wellbeing Intelligence Reflection</p>
        </div>

        <div class="content">
          <div class="greeting">Hello {name},</div>
          <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            Your complete <strong>Personal Insight Report</strong> is compiled and attached directly to this email.
          </p>

          <!-- PDF Attachment Notice -->
          <div class="pdf-attached-box">
            <div style="font-size: 13.5px; color: #016257; line-height: 1.5;">
              <strong>PDF Report Attached:</strong> Your full 25-page Insight Report document (<code>{pdf_filename}</code>) is attached directly to this email. You can download and save it to your device anytime.
            </div>
          </div>

          <div class="summary-card">
            <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 15px;">Report Details</h3>
            <table style="width: 100%; font-size: 13.5px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Report ID:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; font-family: monospace; color: #1e293b;">{rep_id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Order Reference:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; font-family: monospace; color: #1e293b;">{order_ref}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Date:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1e293b;">{date_str}</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 16px;">
              <a href="{report_link}" class="btn">View Online Summary</a>
            </div>
          </div>

          <p style="font-size: 13.5px; line-height: 1.6; color: #64748b;">
            Your report provides a multi-dimensional reflection across your physical, emotional, and cognitive wellbeing patterns, giving you actionable recommendations tailored to your unique profile.
          </p>

          <!-- Lewis Brand Logo Signature -->
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0; width: 100%;">
            <tr>
              <td style="vertical-align: middle; width: 34px; padding-right: 12px;">
                <svg width="30" height="30" viewBox="0 0 82 82" style="display: block;">
                  <path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="71" cy="11" r="7" fill="#5FBB46" />
                  <circle cx="41" cy="41" r="11" fill="#00AE9D" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#00AE9D" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 17px; font-weight: 800; color: #16302B; letter-spacing: -0.02em;">Lewis</span>
                <div style="font-size: 11.5px; color: #64748b; margin-top: 1px;">Wellbeing Intelligence</div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px;">© 2026 LEWIS Well-Being · A Lifed Health Intelligence System</p>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            Lewis is a non-clinical wellbeing reflection and does not provide medical diagnosis or psychiatric treatment.
          </p>
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
Hello {name},

Your LEWIS Personal Wellbeing Insight Report is attached to this email (PDF).

Report ID: {rep_id}
Order Reference: {order_ref}
Date: {date_str}

Please find your complete 25-page Insight Report attached directly as a PDF document.

Lewis Wellbeing Intelligence
A Lifed Health Intelligence System
    """

    sent = send_email(
        to_email=user_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content,
        attachments=attachments
    )
    if sent and order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "report", True)
        except Exception:
            pass
    return sent


def deferred_report_delivery(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None
) -> bool:
    """
    Worker-side handler for a queued "report_delivery" job: fetch the report
    (it may not have existed yet at enqueue time) and send it.
    """
    rep_json = None
    if report_uuid:
        try:
            from auth import get_report_by_uuid
            rec = get_report_by_uuid(report_uuid)
            if rec and rec.get("report_json"):
                rep_json = rec["report_json"]
        except Exception as e:
            logger.warning("Could not fetch report data for email: %s", e)

    return send_report_delivery_email(
        user_email=user_email,
        user_name=user_name,
        report_uuid=report_uuid,
        order_id=order_id,
        report_data=rep_json
    )


def schedule_report_delivery_email(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None,
    delay_seconds: Optional[int] = None
):
    """
    Queues the completed insight report for delivery 5 minutes (default 300s,
    REPORT_EMAIL_DELAY_SECONDS) after payment confirmation, via the Redis mail
    queue — so a process restart during that window doesn't silently lose it
    the way a bare time.sleep()-in-a-thread used to.
    """
    if delay_seconds is None:
        delay_seconds = int(os.getenv("REPORT_EMAIL_DELAY_SECONDS", "0"))

    from mail_queue import enqueue
    enqueue(
        "report_delivery",
        {"user_email": user_email, "user_name": user_name, "report_uuid": report_uuid, "order_id": order_id},
        delay_seconds=delay_seconds
    )
