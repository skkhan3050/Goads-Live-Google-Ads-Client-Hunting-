/**
 * GoAdsLive - Google Sheets Lead Capture Integration
 * Connected Spreadsheet: GoAds Live Client Hunting Lead Google Ads
 * Spreadsheet ID: 1z6xW1_OY3t47J0v0HaI8wVobEIwVgGjOCgQY2A9BntQ
 */

// Live Google Apps Script Web App Deployment URL:
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw7bMxurClZnetgq1p5sDjM9szFt-v0IFUFfCd-Lq3WZTF_GTwzr275yZ8-X0vnUiud/exec";

/**
 * Universal Lead Sender Function
 * Submits lead data to Google Sheet
 */
async function sendLeadToGoogleSheet(leadData) {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  
  const payload = {
    timestamp: timestamp,
    name: leadData.name || "",
    phone: leadData.phone || "",
    email: leadData.email || "",
    service: leadData.service || "",
    category: leadData.category || leadData.budget || "",
    message: leadData.message || leadData.website || "",
    source: leadData.source || window.location.pathname
  };

  // Ensure Google Tag Manager dataLayer event is fired
  if (typeof window.trackGtmFormSubmit === "function") {
    window.trackGtmFormSubmit({
      form_id: leadData.formId || leadData.form_id || (leadData.source || "form").toLowerCase().replace(/[^a-z0-9]/g, "_"),
      form_name: leadData.source || "Website Form",
      name: leadData.name,
      phone: leadData.phone,
      email: leadData.email,
      service: leadData.service,
      category: leadData.category,
      message: leadData.message,
      source: leadData.source
    });
  }

  try {
    if (GOOGLE_SHEET_WEBAPP_URL) {
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log("Lead captured to Google Sheet successfully:", payload);
    } else {
      console.log("Lead captured locally (awaiting deployment webhook URL):", payload);
    }
    // Store in localStorage as resilient backup
    try {
      const existing = JSON.parse(localStorage.getItem("goadslive_leads") || "[]");
      existing.unshift(payload);
      localStorage.setItem("goadslive_leads", JSON.stringify(existing.slice(0, 100)));
    } catch(e) {}
  } catch (err) {
    console.error("Error saving lead to Google Sheet:", err);
  }
}

// Attach to all forms across the website
document.addEventListener("DOMContentLoaded", function () {
  // 1. Homepage Desktop Hero Reservation Form
  const heroForm = document.getElementById("heroReservationForm");
  if (heroForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = heroForm.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : "Submit";
      if (btn) btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

      const lead = {
        name: (document.getElementById("res_fullname") || {}).value || "",
        phone: (document.getElementById("res_phone") || {}).value || "",
        email: "",
        service: (document.getElementById("res_service") || {}).value || "General Growth",
        category: (document.getElementById("res_category") || {}).value || "",
        message: "Booked via Desktop Hero Form",
        source: "Homepage - Desktop Hero Reservation"
      };

      sendLeadToGoogleSheet(lead);

      // WhatsApp notification
      const waMsg = `*New Free Consultation Booking*\n\n*Name:* ${lead.name}\n*Phone:* ${lead.phone}\n*Service:* ${lead.service}\n*Business Category:* ${lead.category}\n*Source:* Homepage Hero`;
      const waUrl = "https://wa.me/917439469915?text=" + encodeURIComponent(waMsg);

      setTimeout(() => {
        if (btn) btn.innerHTML = '✓ Booked Successfully!';
        window.open(waUrl, "_blank");
        heroForm.reset();
        setTimeout(() => { if (btn) btn.innerHTML = origText; }, 3000);
      }, 500);
    });
  }

  // 2. Homepage Mobile Hero Reservation Form
  const heroMobileForm = document.getElementById("heroReservationFormMobile");
  if (heroMobileForm) {
    heroMobileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = heroMobileForm.querySelector('button[type="submit"]');
      const origText = btn ? btn.innerHTML : "Submit";
      if (btn) btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Submitting...';

      const nameEl = heroMobileForm.querySelector(".res-fullname");
      const phoneEl = heroMobileForm.querySelector(".res-phone");
      const serviceEl = heroMobileForm.querySelector(".res-service");
      const catEl = heroMobileForm.querySelector(".res-category");

      const lead = {
        name: nameEl ? nameEl.value : "",
        phone: phoneEl ? phoneEl.value : "",
        email: "",
        service: serviceEl ? serviceEl.value : "General Growth",
        category: catEl ? catEl.value : "",
        message: "Booked via Mobile Hero Form",
        source: "Homepage - Mobile Hero Reservation"
      };

      sendLeadToGoogleSheet(lead);

      const waMsg = `*New Free Consultation Booking*\n\n*Name:* ${lead.name}\n*Phone:* ${lead.phone}\n*Service:* ${lead.service}\n*Business Category:* ${lead.category}\n*Source:* Mobile Hero`;
      const waUrl = "https://wa.me/917439469915?text=" + encodeURIComponent(waMsg);

      setTimeout(() => {
        if (btn) btn.innerHTML = '✓ Booked Successfully!';
        window.open(waUrl, "_blank");
        heroMobileForm.reset();
        setTimeout(() => { if (btn) btn.innerHTML = origText; }, 3000);
      }, 500);
    });
  }

  // 3. Homepage Bottom Section WhatsApp Form
  const waForm = document.getElementById("whatsappForm");
  if (waForm) {
    waForm.addEventListener("submit", function (e) {
      const lead = {
        name: (document.getElementById("name") || {}).value || "",
        phone: (document.getElementById("phone") || {}).value || "",
        email: (document.getElementById("email") || {}).value || "",
        service: (document.getElementById("service") || {}).value || "",
        message: (document.getElementById("message") || {}).value || "",
        category: "Bottom Contact Section",
        source: "Homepage - Bottom Contact Section"
      };
      sendLeadToGoogleSheet(lead);
    });
  }

  // 4. Contact Page Main Form
  const contactForm = document.getElementById("mainContactPageForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const lead = {
        name: (document.getElementById("contactName") || {}).value || "",
        phone: (document.getElementById("contactPhone") || {}).value || "",
        email: (document.getElementById("contactEmail") || {}).value || "",
        service: (document.getElementById("contactService") || {}).value || "",
        category: (document.getElementById("contactBudget") || {}).value || "",
        message: (document.getElementById("contactMessage") || {}).value || "",
        website: (document.getElementById("contactWebsite") || {}).value || "",
        source: "Contact Page - Growth Proposal Form"
      };
      sendLeadToGoogleSheet(lead);
    });
  }

  // 5. Modal Consultation Form (whatsappForm2)
  const modalForm = document.getElementById("whatsappForm2");
  if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
      const lead = {
        name: (document.getElementById("name2") || {}).value || "",
        phone: (document.getElementById("phone2") || {}).value || "",
        email: (document.getElementById("email2") || {}).value || "",
        service: (document.getElementById("service2") || {}).value || "",
        message: (document.getElementById("message2") || {}).value || "",
        category: "Modal Consultation Booking",
        source: "Modal Pop-up Form"
      };
      sendLeadToGoogleSheet(lead);
    });
  }

  // 6. Blog Newsletter Form (newsletterForm)
  const newsForm = document.getElementById("newsletterForm");
  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailEl = document.getElementById("newsletterEmail") || newsForm.querySelector('input[type="email"]');
      const lead = {
        name: "Newsletter Subscriber",
        phone: "",
        email: emailEl ? emailEl.value.trim() : "",
        service: "Weekly ROAS Dispatch",
        category: "Newsletter Subscription",
        message: "Subscribed via Blog Sidebar",
        source: "Blog - ROAS Dispatch Newsletter"
      };
      sendLeadToGoogleSheet(lead);
      alert("Thank you! You have been subscribed to the Weekly ROAS Dispatch.");
      newsForm.reset();
    });
  }
});
