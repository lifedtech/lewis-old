# mailer.py — Automated Email Delivery Engine via the Brevo HTTP API
import os
import base64
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from dotenv import load_dotenv
import requests

load_dotenv()
logger = logging.getLogger("lewis.mailer")

# Raw SMTP (587/465/2525) was timing out on every port from Railway — a
# common PaaS anti-abuse policy that blocks outbound SMTP entirely, so no
# amount of port-fallback tuning could fix it. Brevo's HTTP API sends over
# plain HTTPS instead, sidestepping SMTP-port blocking altogether.
BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
MAIL_FROM_ADDRESS = os.getenv("MAIL_FROM_ADDRESS", "lewissupport@lifedhealth.com")
MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "LEWIS Well-Being").replace('"', '')


def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
    bcc: Optional[List[str]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None
) -> bool:
    """
    Send an email via Brevo's transactional email HTTP API.
    """
    if not to_email or "@" not in to_email:
        logger.warning("Invalid destination email: %s", to_email)
        return False

    if not BREVO_API_KEY:
        logger.warning("BREVO_API_KEY not configured. Email to %s skipped.", to_email)
        return False

    payload: Dict[str, Any] = {
        "sender": {"name": MAIL_FROM_NAME, "email": MAIL_FROM_ADDRESS},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }
    if text_content:
        payload["textContent"] = text_content
    if bcc:
        payload["bcc"] = [{"email": b} for b in bcc]
    if attachments:
        formatted_attachments = []
        for att in attachments:
            name_val = att.get("filename") or att.get("name") or "LEWIS-Insight-Report.pdf"
            item = {"name": name_val}
            if att.get("url"):
                item["url"] = att["url"]
            elif att.get("content"):
                raw = att["content"]
                item["content"] = base64.b64encode(raw).decode("ascii") if isinstance(raw, bytes) else str(raw)
            formatted_attachments.append(item)
        payload["attachment"] = formatted_attachments

    try:
        resp = requests.post(
            BREVO_API_URL,
            headers={"api-key": BREVO_API_KEY, "Content-Type": "application/json", "accept": "application/json"},
            json=payload,
            timeout=60,
        )
        if resp.ok:
            logger.info("Successfully dispatched email to %s via Brevo API (Subject: %s, Attachments: %d)", to_email, subject, len(attachments or []))
            return True
        logger.error("Brevo API send to %s failed: %s %s", to_email, resp.status_code, resp.text[:500])
        return False
    except Exception as exc:
        logger.error("Failed to send email to %s via Brevo API: %s", to_email, exc)
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
    if order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "confirmation", bool(sent))
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

    # 1. Forward to Internal Support Team & Founders
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
    team_recipients_raw = os.getenv("SUPPORT_NOTIFICATION_EMAILS", "projectlifed@gmail.com,aayushraj1601@gmail.com")
    team_bccs = [e.strip() for e in team_recipients_raw.split(",") if e.strip() and e.strip() != MAIL_FROM_ADDRESS]
    send_email(to_email=MAIL_FROM_ADDRESS, subject=team_subject, html_content=team_html, bcc=team_bccs)

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


TECH_ALERT_EMAIL = os.getenv("TECH_ALERT_EMAIL", "tech@lifedhealth.com")


def send_report_failure_alert(
    user_email: Optional[str],
    user_name: Optional[str],
    report_uuid: Optional[str],
    order_id: Optional[str],
    reason: str
) -> bool:
    """
    Internal ops alert: a paid customer's report could NOT be sent (and,
    per policy, no generic/stale substitute was sent in its place — see
    send_report_delivery_email). Notifies tech@ with enough to find and
    manually verify + send the report. Sent at most once per order — the
    PDF-generation failure this guards is usually persistent, and the
    retry queue / 30s reconciliation loop would otherwise re-alert on
    every attempt.
    """
    if order_id:
        try:
            from auth import get_payment_order
            order = get_payment_order(order_id)
            if order and order.get("report_alert_mail_sent"):
                return True  # already alerted for this order — don't spam tech@
        except Exception as e:
            logger.warning("Could not check report_alert_mail_sent for %s: %s", order_id, e)

    name = (user_name or "(no name on file)").strip()
    email = user_email or "(no email on file)"
    rep_id = report_uuid or "(no report_uuid)"
    order_ref = order_id or "(no order_id)"

    subject = f"⚠️ LEWIS report NOT sent — manual send required · Order {order_ref}"
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
        <h2 style="color: #b91c1c; margin: 0 0 12px 0; font-size: 18px;">Report delivery failed — no email was sent to the customer</h2>
        <p style="font-size: 13.5px; color: #334155; line-height: 1.5;">
          The system refused to send a generic or stale report in place of this customer's real one.
          Please verify the report and send it manually.
        </p>
        <table style="width: 100%; font-size: 13.5px; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>User Name:</strong></td><td style="padding: 6px 0; color: #0f172a;">{name}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>User Email:</strong></td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:{email}" style="color: #00ae9d;">{email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Order ID:</strong></td><td style="padding: 6px 0; font-family: monospace; font-weight: 700; color: #0f172a;">{order_ref}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Report UUID:</strong></td><td style="padding: 6px 0; font-family: monospace; font-weight: 700; color: #0f172a;">{rep_id}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Failure reason:</strong></td><td style="padding: 6px 0; color: #b91c1c;">{reason}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;"><strong>Time:</strong></td><td style="padding: 6px 0; color: #64748b;">{datetime.now(timezone.utc).strftime("%d %B %Y, %H:%M UTC")}</td></tr>
        </table>
        <p style="font-size: 13px; color: #64748b;">
          Use <code>/admin/resend-report/{order_ref}</code> once the underlying issue is fixed, or generate and send the report manually.
        </p>
      </div>
    </div>
    """
    text_content = (
        f"Report delivery failed — no email was sent to the customer.\n\n"
        f"User Name: {name}\nUser Email: {email}\nOrder ID: {order_ref}\nReport UUID: {rep_id}\n"
        f"Failure reason: {reason}\n\nUse /admin/resend-report/{order_ref} once fixed, or send manually."
    )

    ok = send_email(to_email=TECH_ALERT_EMAIL, subject=subject, html_content=html_content, text_content=text_content)
    if ok and order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "report_alert", True)
        except Exception:
            pass
    return ok


def send_report_delivery_email(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None,
    report_data: Optional[Dict[str, Any]] = None,
    plan_id: Optional[str] = None,
    is_final_attempt: bool = True
) -> bool:
    """
    Send the completed Personal Wellbeing Insight Report to user email with attached PDF.

    `plan_id` is a hint, not the source of truth — build_report_pdf_for_plan
    routes by the actual shape of `report_data` first (plan_id can drift out
    of sync with which assessment the customer actually completed), and the
    email wording below follows that same real shape rather than plan_id, so
    the subject/body text never claims a page count that doesn't match what's
    attached. There is no generic-content fallback here on purpose — a
    customer's report is either their own answer-derived PDF or no email
    goes out at all (see the except: below, which returns False so
    mail_queue's retry/backoff and the reconciliation loop pick it up again,
    instead of silently sending stale/generic content).

    `is_final_attempt` gates the tech@ "manual verification needed" alert:
    mail_queue retries a failed report_delivery job up to MAX_ATTEMPTS times
    before giving up, so alerting on every one of those attempts would page
    tech@ for blips the next retry quietly fixes. Only the caller that knows
    this was the last attempt (mail_queue on exhaustion, or a direct
    single-shot call like /admin/resend-report) should set this True. Applies
    identically to both report shapes — full and streamlined both flow
    through this one function.
    """
    from pdf_generator import PLAN_SHAPE

    name = (user_name or "there").strip()
    rep_id = report_uuid or "LSR20260200"
    order_ref = order_id or "LS20260100"
    date_str = datetime.now(timezone.utc).strftime("%d %B %Y")
    # plan_id (what was actually paid for) is the source of truth for the
    # wording here, same as build_report_pdf_for_plan below — if the stored
    # report doesn't actually match, that call raises instead of sending,
    # so this label is never attached to the wrong PDF.
    shape = PLAN_SHAPE.get(plan_id, "full")
    page_count_label = "12-page" if shape == "streamlined" else "24-page"

    # Resolve public production domain (filter out localhost)
    raw_frontends = [u.strip() for u in os.getenv("FRONTEND_URL", "").split(",") if u.strip()]
    prod_frontends = [u for u in raw_frontends if "localhost" not in u and "127.0.0.1" not in u]
    frontend_base = prod_frontends[0] if prod_frontends else "https://lewiswellbeing.com"
    report_link = f"{frontend_base}/#mirror"

    try:
        from pdf_generator import build_report_pdf_for_plan
        pdf_bytes = build_report_pdf_for_plan(
            plan_id=plan_id,
            report_data=report_data,
            report_uuid=rep_id,
            user_name=name,
            order_id=order_ref
        )
    except Exception as pdf_err:
        logger.error(
            "Refusing to send report email for %s (order %s, plan %s): PDF generation failed: %s",
            rep_id, order_ref, plan_id, pdf_err, exc_info=True
        )
        if is_final_attempt:
            send_report_failure_alert(user_email, name, report_uuid, order_id, f"PDF generation failed: {pdf_err}")
        return False

    if not pdf_bytes or len(pdf_bytes) < 10000:
        logger.error(
            "Refusing to send report email for %s (order %s): generated PDF is missing or suspiciously "
            "small (%s bytes)", rep_id, order_ref, len(pdf_bytes) if pdf_bytes else 0
        )
        if is_final_attempt:
            send_report_failure_alert(
                user_email, name, report_uuid, order_id,
                f"generated PDF missing or too small ({len(pdf_bytes) if pdf_bytes else 0} bytes)"
            )
        return False

    # Persist the generated PDF so it's retrievable later (Lewis OS, resend,
    # in-app download) without re-rendering. Best-effort: never blocks send.
    try:
        from auth import save_report_pdf
        save_report_pdf(report_uuid=rep_id, plan_id=plan_id, pdf_bytes=pdf_bytes)
    except Exception as save_err:
        logger.warning("Could not persist report PDF for %s: %s", rep_id, save_err)

    pdf_filename = f"LEWIS-Insight-Report-{rep_id}.pdf"
    public_pdf_url = "https://lewis-production-953f.up.railway.app/download/Lewis-Insight-Report.pdf"
    direct_pdf_download = f"https://lewis-production-953f.up.railway.app/reports/{rep_id}/pdf" if rep_id else public_pdf_url

    attachments = [{
        "filename": pdf_filename,
        "content": pdf_bytes
    }]
    logger.info("Report delivery attachment ready: %s (Bytes: %d, plan: %s)", pdf_filename, len(pdf_bytes), plan_id or "personal_report")

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
              <strong>PDF Report Attached:</strong> Your full {page_count_label} Insight Report document (<code>{pdf_filename}</code>) is attached directly to this email. You can download and save it to your device anytime.
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

Please find your complete {page_count_label} Insight Report attached directly as a PDF document.

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
    if order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "report", bool(sent))
        except Exception:
            pass

    if sent and order_id:
        # Schedule Review & Experience Reflection email 20 minutes after report delivery
        try:
            from mail_queue import enqueue
            review_delay = int(os.getenv("REVIEW_EMAIL_DELAY_SECONDS", "1200"))
            enqueue(
                "review_invitation",
                {
                    "user_email": user_email,
                    "user_name": name,
                    "report_uuid": rep_id,
                    "order_id": order_ref
                },
                delay_seconds=review_delay
            )
            logger.info("Scheduled 20-minute review invitation email for %s (delay=%ds)", user_email, review_delay)
        except Exception as rev_err:
            logger.warning("Could not queue review invitation email: %s", rev_err)
    elif not sent and is_final_attempt:
        send_report_failure_alert(user_email, name, report_uuid, order_id, "Brevo API send failed (see server logs)")

    return sent


def send_review_invitation_email(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None
) -> bool:
    """
    Send a customer feedback and experience review request 20 minutes after report delivery.
    """
    import urllib.parse
    name = (user_name or "there").strip()
    rep_id = report_uuid or "LSR20260200"

    raw_frontends = [u.strip() for u in os.getenv("FRONTEND_URL", "").split(",") if u.strip()]
    prod_frontends = [u for u in raw_frontends if "localhost" not in u and "127.0.0.1" not in u]
    frontend_base = prod_frontends[0] if prod_frontends else "https://lewiswellbeing.com"

    encoded_email = urllib.parse.quote(user_email)
    encoded_name = urllib.parse.quote(name)
    order_param = f"&order_id={urllib.parse.quote(order_id)}" if order_id else ""
    review_url = f"{frontend_base}/#report-review?report_id={rep_id}&email={encoded_email}&name={encoded_name}{order_param}"

    subject = f"How was your LEWIS Wellbeing Report, {name}? · We'd love your reflection"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your LEWIS Experience Review</title>
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
          background: #00ae9d;
          padding: 30px 28px 24px;
          text-align: center;
          color: #ffffff;
        }}
        .header h1 {{
          margin: 8px 0 2px;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }}
        .content {{
          padding: 30px 28px;
        }}
        .greeting {{
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }}
        .stars-container {{
          background: #f8faf9;
          border: 1.5px solid #00ae9d;
          border-radius: 14px;
          padding: 22px;
          margin: 20px 0;
          text-align: center;
        }}
        .btn-review {{
          display: inline-block;
          background: #00ae9d;
          color: #ffffff !important;
          text-decoration: none;
          padding: 13px 28px;
          font-weight: 700;
          font-size: 14.5px;
          border-radius: 999px;
          box-shadow: 0 4px 14px rgba(0, 174, 157, 0.25);
          margin-top: 14px;
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
                  <circle cx="71" cy="11" r="7" fill="#ffffff" />
                  <circle cx="41" cy="41" r="11" fill="#ffffff" />
                  <path d="M71 41 V71 H41" fill="none" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="11" cy="71" r="7" fill="#ffffff" />
                </svg>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 800; color: #ffffff;">Lewis</span>
              </td>
            </tr>
          </table>
          <h1>How was your reflection?</h1>
          <p style="margin: 0; font-size: 13px; opacity: 0.92;">We'd love your thoughts on your Wellbeing Insight Report</p>
        </div>

        <div class="content">
          <div class="greeting">Hello {name},</div>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 14px;">
            You recently received your <strong>LEWIS Personal Wellbeing Insight Report</strong> (Report ID: <code>{rep_id}</code>).
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            We hope your personalized reflection provided clarity on your physical, emotional, and cognitive patterns. How would you rate your experience and the depth of insight provided?
          </p>

          <div class="stars-container">
            <div style="font-size: 14px; font-weight: 700; color: #007064; margin-bottom: 10px;">
              Rate your experience with your Insight Report
            </div>
            <div style="font-size: 30px; letter-spacing: 6px; color: #00ae9d;">
              ★★★★★
            </div>
            <div style="margin-top: 14px;">
              <a href="{review_url}" class="btn-review">
                Review Your Insight Report →
              </a>
            </div>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 16px 0 0;">
            Taking 1 minute to share your reflections helps us continuously refine and improve the Lewis experience for everyone.
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
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 800; color: #16302B;">Lewis Wellbeing Team</span>
                <div style="font-size: 11px; color: #64748b; margin-top: 1px;"><a href="mailto:lewissupport@lifedhealth.com" style="color: #00ae9d; text-decoration: none;">lewissupport@lifedhealth.com</a></div>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p style="margin: 0 0 4px;">© 2026 LEWIS Well-Being · A Lifed Health Intelligence System</p>
          <p style="margin: 0; font-size: 10.5px; color: #94a3b8;">
            You received this email because you completed a LEWIS Wellbeing Reflection.
          </p>
        </div>
      </div>
    </body>
    </html>
    """

    text_content = f"""
Hello {name},

We hope your personalized reflection provided clarity on your physical, emotional, and cognitive patterns.

We'd love to hear your thoughts — please take 1 minute to share your review:
{review_url}

Best regards,
Lewis Wellbeing Team
A Lifed Health Intelligence System
    """

    sent = send_email(
        to_email=user_email,
        subject=subject,
        html_content=html_content,
        text_content=text_content
    )
    if order_id:
        try:
            from auth import update_order_email_status
            update_order_email_status(order_id, "review", bool(sent))
        except Exception:
            pass
    return sent


def deferred_report_delivery(
    user_email: str,
    user_name: Optional[str] = None,
    report_uuid: Optional[str] = None,
    order_id: Optional[str] = None,
    force: bool = False,
    is_final_attempt: bool = True
) -> bool:
    """
    Worker-side handler for a queued "report_delivery" job: fetch the report
    (it may not have existed yet at enqueue time) and send it.

    The bug this guards: the mail_queue retry, the 30s reconciliation loop,
    and /admin/resend-report all funnel through this function, but nothing
    stopped two of them landing on the same still-"unsent" order at once —
    a customer got the same report emailed twice, sometimes with visibly
    inconsistent wording between the two sends (built from two independent,
    momentarily-diverging runs). `force=False` (the default, used by every
    automatic path) skips the send if this order is already marked
    report_mail_sent; only the admin resend endpoint passes force=True,
    since resending on purpose is its whole point.
    """
    # ponytail: a check-then-send guard, not an atomic claim — two automatic
    # triggers landing within the same few seconds could still both pass this
    # check before either sets report_mail_sent. Closes the actual observed
    # gap (reconciliation vs. a manual resend, minutes apart); an atomic
    # "UPDATE ... WHERE report_mail_sent = FALSE RETURNING" claim would close
    # the narrower millisecond-level race too, if that's ever seen in practice.
    if not force and order_id:
        try:
            from auth import get_payment_order
            existing_order = get_payment_order(order_id)
            if existing_order and existing_order.get("report_mail_sent"):
                logger.info("Report already sent for order %s — skipping duplicate delivery.", order_id)
                return True
        except Exception as e:
            logger.warning("Could not check report_mail_sent before delivery: %s", e)

    rep_json = None
    plan_id = None
    if report_uuid:
        try:
            from auth import get_report_by_uuid
            rec = get_report_by_uuid(report_uuid)
            if rec and rec.get("report_json"):
                rep_json = rec["report_json"]
            if rec:
                plan_id = rec.get("paid_plan")
        except Exception as e:
            logger.warning("Could not fetch report data for email: %s", e)

    # paid_plan is written onto the report row at payment time (see
    # record_successful_payment); fall back to the order's plan_id if the
    # report lookup above didn't have it (e.g. report row predates that write).
    if not plan_id and order_id:
        try:
            from auth import get_payment_order
            order = get_payment_order(order_id)
            if order:
                plan_id = order.get("plan_id")
        except Exception as e:
            logger.warning("Could not fetch order plan_id for email: %s", e)

    return send_report_delivery_email(
        user_email=user_email,
        user_name=user_name,
        report_uuid=report_uuid,
        order_id=order_id,
        report_data=rep_json,
        plan_id=plan_id,
        is_final_attempt=is_final_attempt
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
        # Root cause of "report mail sends instantly instead of after 5 min":
        # REPORT_EMAIL_DELAY_SECONDS was never set in .env/.env.example, so
        # this fell back to 0 (no delay) despite the docstring/callers above
        # assuming 300s. Default to the intended 5 minutes instead.
        delay_seconds = int(os.getenv("REPORT_EMAIL_DELAY_SECONDS", "300"))

    from mail_queue import enqueue
    enqueue(
        "report_delivery",
        {"user_email": user_email, "user_name": user_name, "report_uuid": report_uuid, "order_id": order_id},
        delay_seconds=delay_seconds
    )
