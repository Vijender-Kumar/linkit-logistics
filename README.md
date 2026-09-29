# Linkit Logistics website
## linkit-logistics
Website for Linkit Logisitics

## Run
Open `index.html`, or host the folder on any static host (Netlify, cPanel, Hostinger, GitHub Pages).

## Form
Edit `FORM_ENDPOINT` in `js/main.js` (e.g. a Formspree URL). If left empty, the form opens
an email to `info@linkitlogistics.com`.

## Styling
Styles use Tailwind utility classes, loaded from the Tailwind CDN in `index.html`, so it works
with no setup. For production speed, compile Tailwind once:
`npx tailwindcss -i ./css/style.css -o ./css/tailwind.css --content ./index.html --minify`
then replace the CDN `<script>` with a link to `css/tailwind.css`.
