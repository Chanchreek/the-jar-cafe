'use strict';

/**
 * PRELOAD
 *
 * Loading will end after the document is fully loaded.
 */
const preloader = document.querySelector("[data-preaload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

/**
 * NAVBAR
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

navTogglers.forEach(toggler => toggler.addEventListener("click", toggleNavbar));

/**
 * BACK TO TOP BUTTON
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;
const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
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
 * RESERVATION FORM HANDLING
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reservationForm");

  if (!form) {
    console.error("Reservation form not found!");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form inputs
    const name = document.querySelector("[name='name']").value.trim();
    const phone = document.querySelector("[name='phone']").value.trim();
    const person = document.querySelector("[name='person']").value;
    const date = document.querySelector("[name='reservation-date']").value;
    const time = document.querySelector("[name='time']").value;
    const message = document.querySelector("[name='message']").value.trim();

    // Basic validation
    if (!name || !phone || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare form data
    const formData = {
      name,
      phone,
      person,
      reservationDate: date,
      time,
      message
    };

    try {
      const response = await fetch("https://the-jar-cafe.onrender.com/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Reservation successful! You will receive a confirmation email.");
        form.reset(); // Clear form fields
      } else {
        alert("Failed to reserve. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  });
});
