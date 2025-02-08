'use strict';

/**
 * PRELOAD
 * Loading will end after document is loaded.
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
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

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

addEventOnElements(navTogglers, "click", toggleNavbar);

/**
 * HEADER & BACK TOP BTN
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
 * HERO SLIDER
 */
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");
let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  // Remove "active" from the last active item and add it to the current slide
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }
  updateSliderPos();
};

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }
  updateSliderPos();
};

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */
let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
};

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);

/**
 * PARALLAX EFFECT
 */
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {
  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;
  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);
  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }
});

/**
 * RESERVATION FORM HANDLING
 * This block waits for the DOM to load, then attaches a submit event listener to the reservation form.
 */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reservationForm");
  if (!form) {
    console.error("Reservation form not found!");
    return;
  }
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
    // Get form inputs (make sure your form includes an input with name="email" for user's email)
    const name = document.querySelector("[name='name']").value.trim();
    const email = document.querySelector("[name='email']").value.trim();
    const phone = document.querySelector("[name='phone']").value.trim();
    const person = document.querySelector("[name='person']").value;
    const date = document.querySelector("[name='reservation-date']").value;
    const time = document.querySelector("[name='time']").value;
    const message = document.querySelector("[name='message']").value.trim();
    // Basic validation
    if (!name || !email || !phone || !date || !time) {
      alert("Please fill in all required fields.");
      return;
    }
    // Prepare form data
    const formData = {
      name,
      email,
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
        alert("Reservation successful! A confirmation email has been sent.");
        form.reset(); // Clear form fields on success
      } else {
        alert("Failed to reserve. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  });
});
