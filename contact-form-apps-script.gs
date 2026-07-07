// Dedcell Security — contact form handler
// Writes each submission to the "Leads" sheet AND emails you a notification.
// Setup: Google Sheet → Extensions → Apps Script → paste this → Deploy as Web App.

const SHEET_NAME   = 'Leads';
const NOTIFY_EMAIL = 'dedcellsec@gmail.com';

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: real users never fill "botcheck"; bots do. Silently drop them.
    if (p.botcheck) {
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
      p.name    || '',
      p.email   || '',
      p.company || '',
      p.phone   || '',
      p.message || ''
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: p.email || NOTIFY_EMAIL,
      subject: 'New Security Audit Request - dedcellsecurity.in',
      body:
        'New lead from dedcellsecurity.in\n\n' +
        'Name: '    + (p.name    || '') + '\n' +
        'Email: '   + (p.email   || '') + '\n' +
        'Company: ' + (p.company || '') + '\n' +
        'Phone: '   + (p.phone   || '') + '\n\n' +
        'Message:\n' + (p.message || '')
    });

    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
