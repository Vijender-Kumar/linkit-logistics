# Linkit Logistics website
Website for Linkit Logistics.

```
linkit-logistics/
├── index.html
├── css/style.css
├── js/main.js
├── google-apps-script/Code.gs
├── assets/images/...
└── README.md
```

## Run
Open `index.html`, or host the folder on any static host (Netlify, cPanel, Hostinger, GitHub Pages).

## Send form data to Google Sheets
The "Request a Partnership" form saves each submission as a new row in a Google Sheet.

1. Create a new Google Sheet (any name).
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the default code, paste in everything from `google-apps-script/Code.gs`, and click **Save**.
4. Click **Deploy → New deployment**. Click the gear icon and choose **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy** and approve the permission prompts (Advanced → "Go to project" if Google shows a warning).
6. Copy the **Web app URL** (it ends with `/exec`).
7. Open `js/main.js` and paste it here:
   `var GOOGLE_SHEET_URL = "https://script.google.com/macros/s/XXXX/exec";`
8. Publish the site again and submit a test entry. A "Partnership Requests" tab with headers is created automatically on the first submission.

If you later edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.

Columns saved: Timestamp, Company Name, Email, Contact No, Fleet Size, Vehicle Type, Fuel Type, Pick City, Drop City.

Until `GOOGLE_SHEET_URL` is set, the form opens an email to `info@linkitnrn.com` instead.

## Styling
Styles use Tailwind utility classes, loaded from the Tailwind CDN in `index.html`, so it works
with no setup. For production speed, compile Tailwind once:
`npx tailwindcss -i ./css/style.css -o ./css/tailwind.css --content ./index.html --minify`
then replace the CDN `<script>` with a link to `css/tailwind.css`.
