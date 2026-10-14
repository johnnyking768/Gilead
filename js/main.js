// Replace this with your WhatsApp number in international format (no + sign).
const WHATSAPP_NUMBER = "2349135481136";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const currentYear = document.getElementById("current-year");

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("is-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    nav?.classList.toggle("is-open", !isOpen);
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  // Smooth scroll with sticky-header offset for in-page links.
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      const offset = (header?.offsetHeight || 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", link.getAttribute("href"));
      closeMenu();
    });
  });

  const waUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = waUrl(link.dataset.message || "Hello Gilead Business Advisory, I'd like to get a website for my business.");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  const form = document.getElementById("contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const business = String(data.get("business") || "").trim();
    const offering = String(data.get("offering") || "").trim();
    const message = form.querySelector(".form-message");

    if (!name || !business || !offering) {
      if (message) message.textContent = "Please complete all three fields before continuing.";
      form.reportValidity();
      return;
    }
    if (message) message.textContent = "Opening WhatsApp with your message…";
    const text = `Hello Gilead Business Advisory, I'd like a website for my business.\nName: ${name}\nBusiness name: ${business}\nWhat I sell: ${offering}`;
    window.open(waUrl(text), "_blank", "noopener,noreferrer");
  });
});
