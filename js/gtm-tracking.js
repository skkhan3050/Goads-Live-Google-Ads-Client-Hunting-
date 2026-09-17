/**
 * GoAdsLive - Google Tag Manager (GTM) & GA4 Conversion Tracking Engine
 * ==============================================================================
 * Automatically tracks and fires dataLayer events for all form submissions across
 * the entire website (Hero forms, Contact forms, Modal forms, Newsletter).
 *
 * HOW IT WORKS:
 * 1. Pushes 'form_submission' custom event into window.dataLayer
 * 2. Pushes 'generate_lead' GA4 recommended event into window.dataLayer
 * 3. Works seamlessly with Google Tag Manager triggers & tags
 * ==============================================================================
 */

// Initialize dataLayer safely
window.dataLayer = window.dataLayer || [];

/**
 * Universal GTM Form Tracking Function
 * Can be called programmatically or will be triggered automatically on form submit
 * @param {Object} data - Lead & form details
 */
window.trackGtmFormSubmit = function (data) {
  window.dataLayer = window.dataLayer || [];

  const formId = data.form_id || (data.form && data.form.id) || "website_lead_form";
  const formName = data.form_name || data.source || "Website Form";
  const service = data.service || data.service_requested || "General Growth";
  const category = data.category || data.budget || "Direct Inquiry";
  const name = data.name || data.lead_name || "";
  const phone = data.phone || data.lead_phone || "";
  const email = data.email || data.lead_email || "";
  const message = data.message || data.lead_message || data.website || "";

  // 1. Primary Custom Event for GTM Triggers
  const gtmEventPayload = {
    event: "form_submission",
    event_category: "Form Submission",
    event_action: "Submit",
    event_label: formName,
    form_id: formId,
    form_name: formName,
    service_requested: service,
    lead_category: category,
    lead_name: name,
    lead_phone: phone,
    lead_email: email,
    lead_message: message,
    page_title: document.title,
    page_path: window.location.pathname,
    page_url: window.location.href,
    submission_timestamp: new Date().toISOString()
  };

  window.dataLayer.push(gtmEventPayload);

  // 2. Google Analytics 4 Standard Recommended Event ('generate_lead')
  const ga4LeadPayload = {
    event: "generate_lead",
    currency: "INR",
    value: data.value || 1,
    form_id: formId,
    form_name: formName,
    lead_service: service
  };

  window.dataLayer.push(ga4LeadPayload);

  // 3. Clear Visual Console Feedback for Debugging & Verification
  console.log(
    "%c[GTM Event Fired] %cform_submission & generate_lead",
    "background: #ff6b00; color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 4px;",
    "color: #10b981; font-weight: bold; font-size: 13px;",
    gtmEventPayload
  );
};

/**
 * Global Automatic Form Submit Interceptor
 * Listens in the capture phase to ensure events fire reliably
 * before any modal closes, page unloads, or WhatsApp redirects occur.
 */
document.addEventListener(
  "submit",
  function (event) {
    const form = event.target;
    if (!form || form.tagName !== "FORM") return;

    // Prevent duplicate firing within 1500ms for the same form element
    const now = Date.now();
    if (form._gtmLastFired && now - form._gtmLastFired < 1500) {
      return;
    }
    form._gtmLastFired = now;

    // Helper to safely fetch value by selector
    const getVal = (selectors) => {
      for (const sel of selectors) {
        const el = form.querySelector(sel);
        if (el && el.value && el.value.trim() !== "") {
          return el.value.trim();
        }
      }
      return "";
    };

    const name = getVal([
      '#res_fullname',
      '.res-fullname',
      '#contactName',
      '#name2',
      '#name',
      'input[name*="name" i]',
      'input[id*="name" i]'
    ]);

    const phone = getVal([
      '#res_phone',
      '.res-phone',
      '#contactPhone',
      '#phone2',
      '#phone',
      'input[type="tel"]',
      'input[name*="phone" i]',
      'input[id*="phone" i]',
      'input[name*="mobile" i]',
      'input[id*="mobile" i]'
    ]);

    const email = getVal([
      '#contactEmail',
      '#email2',
      '#email',
      '#newsletterEmail',
      'input[type="email"]',
      'input[name*="email" i]',
      'input[id*="email" i]'
    ]);

    const service = getVal([
      '#res_service',
      '.res-service',
      '#contactService',
      '#service2',
      '#service',
      'select[name*="service" i]',
      'select[id*="service" i]'
    ]);

    const category = getVal([
      '#res_category',
      '.res-category',
      '#contactBudget',
      'select[name*="budget" i]',
      'select[name*="category" i]'
    ]);

    const message = getVal([
      '#contactMessage',
      '#message2',
      '#message',
      'textarea',
      'input[name*="message" i]'
    ]);

    // Map friendly human readable name for known forms
    let friendlyName = form.getAttribute("data-form-name") || "";
    if (!friendlyName) {
      if (form.id === "heroReservationForm") friendlyName = "Homepage - Desktop Hero Reservation";
      else if (form.id === "heroReservationFormMobile") friendlyName = "Homepage - Mobile Hero Reservation";
      else if (form.id === "whatsappForm") friendlyName = "Homepage - Bottom Contact Section";
      else if (form.id === "whatsappForm2") friendlyName = "Modal Consultation Booking";
      else if (form.id === "mainContactPageForm") friendlyName = "Contact Page - Growth Proposal Form";
      else if (form.id === "newsletterForm") friendlyName = "Blog - ROAS Dispatch Newsletter";
      else friendlyName = form.id || "General Website Form";
    }

    window.trackGtmFormSubmit({
      form_id: form.id || "general_form",
      form_name: friendlyName,
      name: name,
      phone: phone,
      email: email,
      service: service || "General Growth",
      category: category,
      message: message,
      source: window.location.pathname
    });
  },
  true // Capture phase: runs before child stopPropagation / preventDefault
);
