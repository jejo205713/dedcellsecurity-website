// Dedcell Security - contact form handler (Google Apps Script Web App)
// Writes each submission to the "Leads" sheet AND emails you a notification.
// Setup: Google Sheet → Extensions → Apps Script → paste this → Deploy as Web App.
//
// In production this endpoint sits BEHIND the Vercel Function (/api/contact),
// which does per-IP rate limiting + validation. The guards below are a
// defense-in-depth backstop in case the /exec URL is ever hit directly:
//   - a global rate cap (protects against floods),
//   - a daily email-quota guard (protects Gmail's ~100 emails/day limit
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
    // Note the order: validate the value the user typed, THEN sanitize it for
    // the Sheet. Sanitizing first would make validation inspect a mutated
    // string, and would let junk through on the strength of our own edits.
    const name    = trim_(p.name, 100);
    const email   = trim_(p.email, 150);
    const company = trim_(p.company, 100);
    const phone   = trim_(p.phone, 40);
    const message = trim_(p.message, 5000);
    if (name.length < 2 || !isValidEmail_(email) || message.length < 10) {
      return json({ success: true });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Company', 'Phone', 'Message']);
    }

    sheet.appendRow([
      new Date(),
      deFormula_(name),
      deFormula_(email),
      deFormula_(company),
      deFormula_(phone),
      deFormula_(message)
    ]);

    // Only email while under the daily quota; the row is already saved regardless.
    if (canEmail_()) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        replyTo: email, // already validated above
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

// Trim to a max length and strip control characters (CR/LF in a header field
// is how mail-header injection starts). Newlines survive in the message body.
function trim_(v, max) {
  let s = String(v == null ? '' : v).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
  return s.trim().slice(0, max);
}

// Neutralize spreadsheet formula / CSV injection: a value the Sheet would
// treat as a formula gets a leading apostrophe so it renders as literal text.
function deFormula_(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// Strict email validation - mirrors lib/email.ts in the Next.js app.
// The previous /^[^\s@]+@[^\s@]+\.[^\s@]+$/ accepted RFC-legal-but-hostile
// quoted local parts such as  "><svg/onload=confirm(1)>"@x.y  which then
// landed in the Sheet and in this notification email.
function isValidEmail_(email) {
  if (typeof email !== 'string') return false;
  if (email.length === 0 || email.length > 254) return false;
  if (/[\x00-\x1f\x7f]/.test(email)) return false;

  const at = email.lastIndexOf('@');
  if (at <= 0 || at === email.length - 1) return false;

  const local  = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || domain.length > 255) return false;

  const LOCAL  = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
  const DOMAIN = /^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
  return LOCAL.test(local) && DOMAIN.test(domain);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
