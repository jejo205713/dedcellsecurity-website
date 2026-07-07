# Task: Connect the website contact form to Google Sheets + Email

**Goal:** When someone submits the "Request a Security Audit" form on dedcellsecurity.in,
we want it to (1) email **dedcellsec@gmail.com** and (2) add a row to a Google Sheet.

**Your deliverable:** one link (a "Web app URL" ending in `/exec`). Send that link back.
That's it — someone else wires it into the website.

**Time needed:** ~15 minutes. No coding knowledge required — just copy/paste and click.

---

## IMPORTANT — before you start
Sign in to Google with the **dedcellsec@gmail.com** account (NOT any personal account).
Everything below must be done while logged in as dedcellsec@gmail.com, or the emails and
sheet will go to the wrong place. If you don't have the password, ask before continuing.

---

## Step 1 — Create the Google Sheet
1. Go to https://sheets.google.com
2. Click the **+ Blank spreadsheet** (big colorful plus).
3. At the top-left, click "Untitled spreadsheet" and rename it to: **Dedcell Leads**
4. Leave the sheet empty — the script fills it automatically.

## Step 2 — Open the Apps Script editor
1. In that same spreadsheet, click the **Extensions** menu (top bar).
2. Click **Apps Script**. A new tab opens with a code editor.
3. You'll see a file called `Code.gs` with a few empty lines like `function myFunction() {}`.
4. Select ALL the text in that editor (click inside, press Ctrl+A) and delete it.

## Step 3 — Paste the script
Copy the ENTIRE code block below and paste it into the empty editor:

```javascript
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
```

## Step 4 — Save
1. Click the **floppy-disk Save icon** (or press Ctrl+S).
2. If it asks for a project name, type **Dedcell Form Handler** and save.

## Step 5 — Deploy it as a Web App
1. Top-right, click the blue **Deploy** button → **New deployment**.
2. Click the **gear icon** next to "Select type" → choose **Web app**.
3. Fill the form exactly like this:
   - **Description:** Dedcell form (anything is fine)
   - **Execute as:** **Me (dedcellsec@gmail.com)**   <-- must be "Me"
   - **Who has access:** **Anyone**                  <-- must be "Anyone" (NOT "Anyone with Google account")
4. Click **Deploy**.

## Step 6 — Authorize the permissions (one-time)
Google will pop up asking for permission (because the script sends email + edits the sheet):
1. Click **Authorize access**.
2. Choose the **dedcellsec@gmail.com** account.
3. You may see a scary screen: **"Google hasn't verified this app."** This is normal for our
   own script. Click **Advanced** (small link, bottom-left) → **Go to Dedcell Form Handler (unsafe)**.
4. Click **Allow**.

## Step 7 — Copy the Web App URL (the deliverable)
1. After deploying you'll see a box titled **Web app** with a URL that looks like:
   `https://script.google.com/macros/s/AKfycb.................../exec`
2. Click **Copy**.
3. **Paste that URL and send it back.** This is the only thing needed.

## Step 8 — (Optional) sanity check
- Open a new browser tab and paste that `/exec` URL, press Enter.
- You will see a short message like `{"success":false,...}` or an error about GET — **that is fine
  and expected** (the form uses POST, not GET). It just proves the link is live.

---

## Notes / gotchas
- Do NOT delete the Google Sheet or the Apps Script project later — the website depends on them.
- If you ever change the script, you must **Deploy → Manage deployments → Edit → Deploy** again,
  OR the changes won't go live. (Not needed for this task.)
- The final wiring into the website + a real end-to-end test happens AFTER you hand over the URL.
