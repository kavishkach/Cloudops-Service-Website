"use strict";

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const contactForm = document.getElementById("contactForm");
const formResult = document.getElementById("formResult");

const currentYear = document.getElementById("currentYear");
const lastUpdated = document.getElementById("lastUpdated");

/* Header shadow */

function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeader);
updateHeader();

/* Mobile navigation */

function closeMobileMenu() {
  menuToggle.classList.remove("active");
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMobileMenu();
  }
});

/* Active navigation link */

const sections = document.querySelectorAll("main section[id]");

const observerOptions = {
  root: null,
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const activeId = entry.target.id;

    navLinks.forEach((link) => {
      const linkTarget = link.getAttribute("href");

      link.classList.toggle("active", linkTarget === `#${activeId}`);
    });
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* Status timestamp */

function updateStatusTime() {
  const now = new Date();

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(now);

  lastUpdated.textContent = `Last checked: ${formattedTime}`;
}

updateStatusTime();

/* Footer year */

currentYear.textContent = new Date().getFullYear();

/* Contact form validation */

function getFormGroup(field) {
  return field.closest(".form-group");
}

function showError(field, message) {
  const group = getFormGroup(field);
  const errorMessage = group.querySelector(".error-message");

  group.classList.add("error");
  errorMessage.textContent = message;
}

function clearError(field) {
  const group = getFormGroup(field);
  const errorMessage = group.querySelector(".error-message");

  group.classList.remove("error");
  errorMessage.textContent = "";
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

function validateForm() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const service = document.getElementById("service");
  const message = document.getElementById("message");

  let isValid = true;

  [name, email, service, message].forEach(clearError);

  if (name.value.trim().length < 2) {
    showError(name, "Please enter your name.");
    isValid = false;
  }

  if (!isValidEmail(email.value.trim())) {
    showError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!service.value) {
    showError(service, "Please select a service.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    showError(message, "Please add at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formResult.textContent = "";

  if (!validateForm()) {
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  window.setTimeout(() => {
    formResult.textContent =
      "Thank you. Your message has been received successfully.";

    contactForm.reset();

    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }, 900);
});

/* Remove errors while typing */

contactForm.querySelectorAll("input, textarea, select").forEach((field) => {
  field.addEventListener("input", () => {
    clearError(field);
    formResult.textContent = "";
  });

  field.addEventListener("change", () => {
    clearError(field);
    formResult.textContent = "";
  });
});