(function () {
  // ---- Settings ----
  // Set FORM_ENDPOINT to a Formspree / your API URL to receive form submissions.
  // If empty, the form opens an email to CONTACT_EMAIL instead.
  var FORM_ENDPOINT = "";
  var CONTACT_EMAIL = "info@linkitlogistics.com";

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

  // ---- Partnership form ----
  var form = document.getElementById("partnerForm");
  var status = document.getElementById("formStatus");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());
    if (!FORM_ENDPOINT) {
      var body = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" +
        encodeURIComponent("Partnership request from " + (data.companyName || "website")) +
        "&body=" + encodeURIComponent(body);
      return;
    }
    var submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    status.textContent = "Sending...";
    fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(); status.textContent = "Thank you! We will contact you shortly."; status.className = "mt-4 text-center text-sm font-medium text-green-700"; form.reset(); })
      .catch(function () { status.textContent = "Something went wrong. Please try again or email " + CONTACT_EMAIL + "."; status.className = "mt-4 text-center text-sm font-medium text-red-600"; })
      .finally(function () { submit.disabled = false; });
  });
})();
