# Intern Task — Connect the contact form to a Google Sheet, then redeploy

**Goal:** every submission on https://dedcellsecurity.in/#/contact should
(1) add a row to a Google Sheet **and** (2) email **dedcellsec@gmail.com**.

**What's already done for you:** the website code is already wired up. You only have to
do two things: create the Google script (to get one URL), then paste that URL into **one line**
of the code and redeploy. No JavaScript knowledge needed — just copy/paste.

**Accounts you need (you already have these):**
- Google + Vercel: **dedcellsec@gmail.com**
- GitHub: access to `jejo205713/dedcellsecurity-website`

**Total time:** ~25 minutes.

---

## PART A — Create the Google Sheet + script (get your URL)

> Do everything in PART A while signed in to Google as **dedcellsec@gmail.com**
> (NOT a personal account), or the leads go to the wrong place.

1. Go to https://sheets.google.com → click **+ Blank spreadsheet**.
2. Rename it (top-left) to **Dedcell Leads**. Leave it empty — the script fills it.
3. In that sheet: menu **Extensions → Apps Script**. A code editor opens in a new tab.
4. Delete everything in the editor (click inside, `Ctrl+A`, `Delete`).
5. Open the file **`contact-form-apps-script.gs`** from our repo, copy its ENTIRE contents,
   and paste it into the empty editor. (It's in the same folder as this guide.)
6. Click the **Save** icon (or `Ctrl+S`). If asked for a project name, use **Dedcell Form Handler**.
7. Top-right **Deploy → New deployment**.
   - Click the **gear** next to "Select type" → choose **Web app**.
   - **Execute as:** `Me (dedcellsec@gmail.com)`
   - **Who has access:** `Anyone`  ← must be exactly "Anyone", not "Anyone with Google account"
   - Click **Deploy**.
8. **Authorize** (one-time): click **Authorize access** → pick dedcellsec@gmail.com →
   if you see *"Google hasn't verified this app"*, click **Advanced → Go to Dedcell Form Handler (unsafe)** → **Allow**.
   *(It's our own script — this warning is normal.)*
9. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb....../exec`  ← **this is the URL you need. Keep it.**

> Quick check: paste that `/exec` URL in a browser tab. Seeing an error about GET / "script function
> not found" is **fine** — it just proves the link is live (the form uses POST, not GET).

---

## PART B — Put your URL into the website (terminal)

Open a terminal on your Linux Mint machine.

### B1. Get the code (first time only)
```bash
cd ~
git clone https://github.com/jejo205713/dedcellsecurity-website.git
cd dedcellsecurity-website
```
*(If you already cloned it before, instead run: `cd ~/dedcellsecurity-website && git pull`)*

### B2. Open the file and paste your URL
Open the site file in a text editor (either command works on Mint):
```bash
xed public/index.html      # graphical editor
# or:  nano public/index.html   # terminal editor
```
Press `Ctrl+F` and search for: **`PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE`**

You'll find this line:
```javascript
const CONTACT_FORM_URL = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';
```
Replace **only** the placeholder text between the quotes with your `/exec` URL from Part A.
It should end up looking like:
```javascript
const CONTACT_FORM_URL = 'https://script.google.com/macros/s/AKfycb....../exec';
```
**Keep the quotes. Keep the semicolon. Change nothing else.** Save the file
(in `xed`: `Ctrl+S`; in `nano`: `Ctrl+O` `Enter` then `Ctrl+X`).

---

## PART C — Deploy it live

Pick **ONE** of the two methods below. **Method 1 is preferred** — after a 5-minute one-time
setup, every future change deploys automatically just by pushing to GitHub.

### Method 1 (recommended): push to GitHub → Vercel auto-deploys

**One-time setup (only needed once, ever):** connect the repo to Vercel.
1. Go to https://vercel.com and sign in as **dedcellsec@gmail.com**.
2. Open the **dedcell-security** project → **Settings → Git**.
3. Click **Connect Git Repository**, authorize **GitHub**, and pick
   `jejo205713/dedcellsecurity-website` (branch `main`).

Once connected, deploy your change from the terminal:
```bash
git add public/index.html
git commit -m "Connect contact form to Google Sheet"
git push origin main
```
Vercel automatically builds and publishes to **dedcellsecurity.in** within ~1 minute.
(Git may ask for your GitHub username + a token/password the first time.)

### Method 2 (fallback): deploy with the Vercel CLI

Use this if the Git connection above isn't set up.
```bash
# install once (needs Node.js):
sudo apt install -y nodejs npm
sudo npm install -g vercel
# from inside the project folder:
vercel login                      # sign in as dedcellsec@gmail.com
vercel link                       # pick the existing "dedcell-security" project
vercel --prod                     # publishes to dedcellsecurity.in
```
Still commit + push to GitHub too, so the repo stays in sync:
```bash
git add public/index.html && git commit -m "Connect contact form to Google Sheet" && git push origin main
```

---

## PART D — Test it end-to-end (do this, don't skip)

1. Wait ~1 minute after deploying, then open https://dedcellsecurity.in/#/contact
   and do a hard refresh: `Ctrl+Shift+R`.
2. Fill in the form with test data and submit. You should see the **success** message.
3. Check that it worked:
   - The **Dedcell Leads** Google Sheet has a new row (a "Leads" tab appears automatically).
   - **dedcellsec@gmail.com** received a "New Security Audit Request" email.
4. If both happened — **done.** 🎉  Delete the test row from the sheet.

---

## Troubleshooting
- **No row / no email:** the URL is probably wrong. Re-check that `CONTACT_FORM_URL` ends in
  `/exec` and that in Part A step 7 you set **Who has access = Anyone**.
- **Form shows "Network error":** you likely left the placeholder text or removed a quote —
  re-open the file and check the `CONTACT_FORM_URL` line.
- **Changed the Apps Script later?** You MUST redeploy it: in Apps Script go to
  **Deploy → Manage deployments → (pencil/Edit) → Deploy**, or the changes won't take effect.
- **Don't delete** the "Dedcell Leads" sheet or the "Dedcell Form Handler" script — the site depends on them.
