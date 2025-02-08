'use strict';

/**
 * PRELOAD
 * Loading will end after the document is loaded.
 */
const preloader = document.querySelector("[data-preaload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * Add event listener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  elements.forEach(el => el.addEventListener(eventType, callback));
};

/**
 * NAVBAR TOGGLE
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};
addEventOnElements(navTogglers, "click", toggleNavbar);

/**
 * HEADER & BACK TO TOP BUTTON
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");
let lastScrollPos = 0;
const hideHeader = function () {
  if (lastScrollPos < window.scrollY) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScrollPos = window.scrollY;
};
window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * HERO SLIDER
 * Wrapped in DOMContentLoaded to ensure all slider elements are loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
  const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
  const heroSliderNextBtn = document.querySelector("[data-next-btn]");
  let currentSlidePos = 0;
  
  const updateSliderPos = function () {
    heroSliderItems.forEach((item, index) => {
      item.classList.toggle("active", index === currentSlidePos);
    });
  };
  
  const slideNext = function () {
    currentSlidePos = (currentSlidePos + 1) % heroSliderItems.length;
    updateSliderPos();
  };
  
  const slidePrev = function () {
    currentSlidePos = (currentSlidePos - 1 + heroSliderItems.length) % heroSliderItems.length;
    updateSliderPos();
  };
  
  if (heroSliderNextBtn) {
    heroSliderNextBtn.addEventListener("click", slideNext);
  }
  if (heroSliderPrevBtn) {
    heroSliderPrevBtn.addEventListener("click", slidePrev);
  }
});

/**
 * RESERVATION FORM HANDLING
 * Wrapped in DOMContentLoaded to ensure the form is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reservationForm");
  if (!form) {
    console.error("Reservation form not found!");
    return;
  }
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const name = document.querySelector("[name='name']").value.trim();
    const email = document.querySelector("[name='email']").value.trim();
    const phone = document.querySelector("[name='phone']").value.trim();
    const person = document.querySelector("[name='person']").value;
    const date = document.querySelector("[name='reservation-date']").value;
    const time = document.querySelector("[name='time']").value;
    const message = document.querySelector("[name='message']").value.trim();
    if (!name || !email || !phone || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }
    const formData = { name, email, phone, person, reservationDate: date, time, message };
    try {
      const response = await fetch("https://the-jar-cafe.onrender.com/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("Reservation successful! A confirmation email has been sent.");
        form.reset();
      } else {
        alert("Failed to reserve. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  });
});
