(function () {
  // ---- Settings ----
  // Paste your Google Apps Script Web App URL here (ends with /exec).
  // Steps are in README.md. Until it is set, the form falls back to opening an email.
  var GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxMPj1k1zeKheCk2fA7PY5KYxSyfdJd5_V6QVmTu-L5Oa-SN9DAMsW7G-DWSQ6NIennUw/exec";
  var CONTACT_EMAIL = "info@linkitnrn.com";

  // ---- Mobile menu ----
  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mobileNav");
  function setMenu(open) {
    panel.classList.toggle("hidden", !open);
    panel.classList.toggle("flex", open);
    btn.setAttribute("aria-expanded", String(open));
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  panel.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  // ---- Active nav link on scroll ----
  var links = document.querySelectorAll("header nav a");
  var ids = ["home", "about", "cta"];
  var on = ["text-[#0B2C5E]", "border-b-2", "border-[#0B2C5E]"];
  var off = ["text-gray-600"];
  function setActive(id) {
    links.forEach(function (a) {
      var active = a.getAttribute("href") === "#" + id;
      on.forEach(function (c) { a.classList.toggle(c, active); });
      off.forEach(function (c) { a.classList.toggle(c, !active); });
    });
  }
  window.addEventListener("scroll", function () {
    var cur = ids[0];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) cur = id;
    });
    setActive(cur);
  }, { passive: true });

  // ---- Partnership form (saves to Google Sheets) ----
  var form = document.getElementById("partnerForm");
  var status = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());

    if (!GOOGLE_SHEET_URL) {
      var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" +
        encodeURIComponent("Partnership request from " + (data.companyName || "website")) +
        "&body=" + encodeURIComponent(body);
      return;
    }

    var submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    status.className = "mt-4 text-center text-sm font-medium";
    status.textContent = "Sending...";

    // Apps Script does not send CORS headers, so we post in no-cors mode.
    // The request still reaches the script; the browser just hides the reply.
    fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(data)
    })
      .then(function () {
        status.textContent = "Thank you! We will contact you shortly.";
        status.className = "mt-4 text-center text-sm font-medium text-green-700";
        form.reset();
      })
      .catch(function () {
        status.textContent = "Something went wrong. Please try again or email " + CONTACT_EMAIL + ".";
        status.className = "mt-4 text-center text-sm font-medium text-red-600";
      })
      .finally(function () { submit.disabled = false; });
  });
})();
