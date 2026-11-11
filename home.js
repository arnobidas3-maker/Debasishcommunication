// Replace these placeholders with the business WhatsApp number (country code + number) and phone number.
const BUSINESS_WHATSAPP = "91XXXXXXXXXX";
const BUSINESS_PHONE = "";

const whatsappDigits = BUSINESS_WHATSAPP.replace(/\D/g, "");
const whatsappReady = whatsappDigits.length >= 10 && !/X/i.test(BUSINESS_WHATSAPP);

const notice = document.querySelector("#site-notice");
let noticeTimer;

function showNotice(message) {
  notice.textContent = message;
  notice.classList.add("is-visible");
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => notice.classList.remove("is-visible"), 5000);
}

function openWhatsApp(message) {
  if (!whatsappReady) {
    showNotice("WhatsApp is not configured yet. Please add the business number in home.js.");
    return;
  }

  const url = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const destination = link.dataset.destination;
    openWhatsApp(
      destination
        ? `Hello, I would like to enquire about a trip to ${destination}.`
        : "Hello, I would like to enquire about your car and driver services."
    );
  });
});

const phoneLink = document.querySelector(".button-outline");
if (phoneLink && BUSINESS_PHONE.trim()) {
  phoneLink.href = `tel:${BUSINESS_PHONE.replace(/[^\d+]/g, "")}`;
}

const bookingType = document.querySelector("#booking-type");
const bookingExtra = document.querySelector("#booking-extra");
const enquiryForm = document.querySelector("#enquiry-form");

if (bookingType && bookingExtra && enquiryForm) {
  function renderBookingExtra(type) {
    bookingExtra.replaceChildren();

    const fields = {
      Hourly: [
        { name: "duration", label: "How many hours?", type: "number", min: "1", placeholder: "e.g. 4" },
      ],
      "Half-Day": [
        { name: "startTime", label: "Preferred pickup time", type: "time" },
      ],
      "Full-Day": [
        { name: "startTime", label: "Preferred pickup time", type: "time" },
      ],
      Wedding: [
        { name: "eventDate", label: "Event date (if different)", type: "date" },
        { name: "vehicles", label: "Number of vehicles", type: "number", min: "1", placeholder: "e.g. 2" },
      ],
      Event: [
        { name: "eventName", label: "What is the occasion?", type: "text", placeholder: "e.g. family celebration" },
        { name: "startTime", label: "Preferred pickup time", type: "time" },
      ],
      Destination: [
        { name: "tripType", label: "Trip plan", type: "select", options: ["One-way", "Round trip", "Outstation"] },
        { name: "returnDate", label: "Return date (optional)", type: "date" },
      ],
    }[type] || [];

    for (const field of fields) {
      const label = document.createElement("label");
      label.className = "field field-extra";

      const caption = document.createElement("span");
      caption.textContent = field.label;
      label.append(caption);

      let input;
      if (field.type === "select") {
        input = document.createElement("select");
        input.name = field.name;
        for (const optionText of field.options) {
          const option = document.createElement("option");
          option.value = optionText;
          option.textContent = optionText;
          input.append(option);
        }
      } else {
        input = document.createElement("input");
        input.type = field.type;
        input.name = field.name;
        if (field.min) input.min = field.min;
        if (field.placeholder) input.placeholder = field.placeholder;
      }

      label.append(input);
      bookingExtra.append(label);
    }
  }

  bookingType.addEventListener("change", () => renderBookingExtra(bookingType.value));
  renderBookingExtra(bookingType.value);

  enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const labels = {
      service: "Service",
      bookingType: "Booking type",
      date: "Travel date",
      city: "Pickup city",
      pickup: "Pickup location",
      destination: "Destination",
      duration: "Hours",
      startTime: "Pickup time",
      eventDate: "Event date",
      vehicles: "Number of vehicles",
      eventName: "Occasion",
      tripType: "Trip plan",
      returnDate: "Return date",
    };
    const details = new FormData(form);
    const message = [
      "Hello, I would like to request a travel quote.",
      ...Array.from(details.entries())
        .filter(([, value]) => String(value).trim())
        .map(([key, value]) => `${labels[key] || key}: ${value}`),
    ].join("\n");

    openWhatsApp(message);
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    }
  });
}
