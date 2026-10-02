/**
 * main.js — Application entry point.
 *
 * Responsibilities:
 * - Initialize the Weather App and Movie Search App
 * - Handle single-page navigation (Home / Weather / Movies)
 * - Handle mobile hamburger menu toggle
 *
 * This file imports and coordinates the other modules.
 */

import { initWeather } from "./weather.js";
import { initMovies } from "./movies.js";

/* ===== View Navigation ===== */

/**
 * All view elements keyed by name.
 */
const views = {
  home: document.querySelector("#view-home"),
  weather: document.querySelector("#view-weather"),
  movies: document.querySelector("#view-movies"),
};

/**
 * All navigation links.
 */
const navLinks = document.querySelectorAll(".nav-link");

/**
 * Switch to a specific view (home, weather, or movies).
 * Hides all other views and updates the active nav link.
 * @param {string} viewName — "home" | "weather" | "movies"
 */
const switchView = (viewName) => {
  // Hide all views
  Object.values(views).forEach((view) => {
    view?.classList.remove("active");
  });

  // Show the selected view
  const targetView = views[viewName];
  if (targetView) {
    targetView.classList.add("active");
  }

  // Update active state on nav links
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("data-view") === viewName);
  });

  // Close mobile menu after navigation
  closeMobileMenu();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Set up click handlers for all navigation links and app cards.
 */
const initNavigation = () => {
  // Nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const viewName = link.getAttribute("data-view");
      switchView(viewName);
    });
  });

  // Home page app cards / buttons (they have data-view attributes)
  const clickableCards = document.querySelectorAll("[data-view]");
  clickableCards.forEach((element) => {
    // Skip nav links — already handled above
    if (element.classList.contains("nav-link")) return;

    element.addEventListener("click", (event) => {
      event.preventDefault();
      const viewName = element.getAttribute("data-view");
      switchView(viewName);
    });
  });
};

/* ===== Mobile Menu Toggle ===== */

const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-menu");

/**
 * Open the mobile navigation menu.
 */
const openMobileMenu = () => {
  navToggle.classList.add("open");
  navMenu.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
};

/**
 * Close the mobile navigation menu.
 */
const closeMobileMenu = () => {
  navToggle.classList.remove("open");
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
};

/**
 * Initialize the mobile menu toggle button.
 */
const initMobileMenu = () => {
  if (!navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
};

/* ===== App Initialization ===== */

/**
 * Start the application when the DOM is fully loaded.
 */
const init = () => {
  initNavigation();
  initMobileMenu();
  initWeather();
  initMovies();
};

// Wait for DOM to be ready, then initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
