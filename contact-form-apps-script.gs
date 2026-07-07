// Dedcell Security — contact form handler (Google Apps Script Web App)
// Writes each submission to the "Leads" sheet AND emails you a notification.
// Setup: Google Sheet → Extensions → Apps Script → paste this → Deploy as Web App.
//
// In production this endpoint sits BEHIND the Vercel Function (/api/contact),
// which does per-IP rate limiting + validation. The guards below are a
// defense-in-depth backstop in case the /exec URL is ever hit directly:
//   - a global rate cap (protects against floods),
//   - a daily email-quota guard (protects Gmail's ~100 emails/day limit —
//     over the cap we still save the row, we just skip the email),
//   - server-side validation (silently drops junk / direct-abuse hits),
//   - formula/CSV-injection sanitization before writing to the Sheet.

const SHEET_NAME          = 'Leads';
const NOTIFY_EMAIL        = 'dedcellsec@gmail.com';
const MAX_PER_MINUTE      = 20;  // global submissions/min accepted (flood backstop)
const MAX_EMAILS_PER_DAY  = 80;  // stay under Gmail's daily send quota

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: real users never fill "botcheck"; bots do. Silently drop them.
    if (p.botcheck) {
      return json({ success: true });
    }

    // Global flood backstop. Not atomic, but good enough to blunt a burst.
    if (!underRateLimit_()) {
      return json({ success: false, error: 'rate_limited' });
    }

    // Server-side validation. Direct-to-endpoint abusers get a silent success.
    const name    = safe_(p.name, 100);
    const email   = safe_(p.email, 150);
    const company = safe_(p.company, 100);
    const phone   = safe_(p.phone, 40);
    const message = safe_(p.message, 5000);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      return json({ success: true });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Company', 'Phone', 'Message']);
    }

    sheet.appendRow([new Date(), name, email, company, phone, message]);

    // Only email while under the daily quota; the row is already saved regardless.
    if (canEmail_()) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : NOTIFY_EMAIL,
        subject: 'New Security Audit Request - dedcellsecurity.in',
        body:
          'New lead from dedcellsecurity.in\n\n' +
          'Name: '    + name    + '\n' +
          'Email: '   + email   + '\n' +
          'Company: ' + company + '\n' +
          'Phone: '   + phone   + '\n\n' +
          'Message:\n' + message
      });
    }

    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

// Global per-minute counter via the script cache (shared across all callers).
function underRateLimit_() {
  const cache = CacheService.getScriptCache();
  const key = 'rl_' + Math.floor(Date.now() / 60000);
  const cur = Number(cache.get(key) || '0');
  if (cur >= MAX_PER_MINUTE) return false;
  cache.put(key, String(cur + 1), 120);
  return true;
}

// Per-day email counter so a flood can't burn the Gmail send quota.
function canEmail_() {
  const props = PropertiesService.getScriptProperties();
  const day = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const key = 'emailcount_' + day;
  const n = Number(props.getProperty(key) || '0');
  if (n >= MAX_EMAILS_PER_DAY) return false;
  props.setProperty(key, String(n + 1));
  return true;
}

// Trim to a max length and neutralize spreadsheet formula / CSV injection:
// a value the Sheet would treat as a formula gets a leading apostrophe.
function safe_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
