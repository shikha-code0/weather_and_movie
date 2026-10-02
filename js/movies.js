/**
 * movies.js — Movie Search App UI logic.
 *
 * Handles:
 * - Form submission (search for movies)
 * - Loading state
 * - Error display
 * - Dynamic rendering of movie result cards
 * - Movie details modal (fetch + display)
 *
 * Imports the API functions from api.js.
 */

import { fetchMovies, fetchMovieDetails } from "./api.js";

/* DOM elements */
const movieForm = document.querySelector("#movie-form");
const movieInput = document.querySelector("#movie-input");
const movieStatus = document.querySelector("#movie-status");
const movieResults = document.querySelector("#movie-results");
const searchBtn = document.querySelector("#movie-search-btn");

/* Modal elements */
const modal = document.querySelector("#movie-modal");
const modalBody = document.querySelector("#modal-body");
const modalClose = document.querySelector("#modal-close");

/**
 * Initialize the Movie Search App — attach event listeners.
 */
export const initMovies = () => {
  movieForm.addEventListener("submit", handleMovieSubmit);
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", handleModalOverlayClick);
  document.addEventListener("keydown", handleEscKey);
};

/**
 * Handle movie form submission.
 * @param {Event} event
 */
const handleMovieSubmit = async (event) => {
  event.preventDefault();

  const query = movieInput.value.trim();

  // Input validation
  if (!query) {
    showMovieError("Please enter a movie name.");
    movieResults.innerHTML = "";
    movieInput.focus();
    return;
  }

  // Start loading
  setLoading(true);
  movieResults.innerHTML = "";
  showMovieLoading();

  try {
    // Fetch movies from OMDb
    const movies = await fetchMovies(query);

    // Render movie cards
    renderMovieCards(movies);
    movieStatus.innerHTML = "";
  } catch (error) {
    showMovieError(error.message);
    movieResults.innerHTML = "";
  } finally {
    setLoading(false);
  }
};

/**
 * Show loading indicator.
 */
const showMovieLoading = () => {
  movieStatus.className = "status-message info";
  movieStatus.innerHTML = `
    <span class="loading-dots" aria-label="Searching movies">
      <span></span><span></span><span></span>
    </span>
    Searching movies...
  `;
};

/**
 * Show an error message.
 * @param {string} message
 */
const showMovieError = (message) => {
  movieStatus.className = "status-message error";
  movieStatus.setAttribute("role", "alert");
  movieStatus.textContent = message;
};

/**
 * Toggle loading state on the search button.
 * @param {boolean} isLoading
 */
const setLoading = (isLoading) => {
  if (isLoading) {
    searchBtn.classList.add("loading");
    searchBtn.disabled = true;
    searchBtn.setAttribute("aria-busy", "true");
  } else {
    searchBtn.classList.remove("loading");
    searchBtn.disabled = false;
    searchBtn.setAttribute("aria-busy", "false");
  }
};

/**
 * Render movie cards dynamically from API search results.
 * Uses template literals and destructuring.
 * @param {Array} movies — array of OMDb search results
 */
const renderMovieCards = (movies) => {
  // Map each movie object to an HTML card using template literals
  const cardsHtml = movies
    .map((movie) => {
      // Destructure fields from the movie object
      const { Title, Year, imdbID, Poster } = movie;

      // Handle missing poster — use placeholder instead of broken image
      const posterHtml =
        Poster && Poster !== "N/A"
          ? `<img class="movie-poster" src="${Poster}" alt="${Title} poster" loading="lazy" />`
          : `<div class="movie-poster-placeholder" aria-label="No poster available">🎬</div>`;

      return `
        <article class="movie-card">
          ${posterHtml}
          <div class="movie-info">
            <h3 class="movie-title">${Title}</h3>
            <p class="movie-year">Release: ${Year}</p>
            <button
              class="movie-detail-btn"
              data-imdb-id="${imdbID}"
              aria-label="View details for ${Title}"
            >
              View Details
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  movieResults.innerHTML = cardsHtml;

  // Attach click listeners to each "View Details" button
  const detailButtons = document.querySelectorAll(".movie-detail-btn");
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const imdbID = btn.getAttribute("data-imdb-id");
      openMovieDetails(imdbID);
    });
  });
};

/**
 * Fetch full movie details and open the modal.
 * @param {string} imdbID
 */
const openMovieDetails = async (imdbID) => {
  // Show loading state inside modal
  modal.hidden = false;
  modalBody.innerHTML = `
    <div style="text-align:center; padding: 2rem;">
      <span class="loading-dots" aria-label="Loading movie details">
        <span></span><span></span><span></span>
      </span>
      <p style="margin-top: 1rem; color: var(--color-text-muted);">Loading details...</p>
    </div>
  `;

  try {
    const details = await fetchMovieDetails(imdbID);
    renderMovieDetails(details);
  } catch (error) {
    modalBody.innerHTML = `
      <div style="text-align:center; padding: 2rem;">
        <p style="color: var(--color-error); font-weight: 500;">${error.message}</p>
      </div>
    `;
  }
};

/**
 * Render full movie details inside the modal.
 * Uses destructuring and template literals.
 * @param {Object} details — full OMDb movie details
 */
const renderMovieDetails = (details) => {
  const {
    Title,
    Year,
    Rated,
    Released,
    Runtime,
    Genre,
    Director,
    Actors,
    Plot,
    imdbRating,
    Poster,
    Language,
    Country,
    BoxOffice,
  } = details;

  // Handle missing poster
  const posterHtml =
    Poster && Poster !== "N/A"
      ? `<img class="modal-poster" src="${Poster}" alt="${Title} poster" />`
      : `<div class="modal-poster-placeholder" aria-label="No poster available">🎬</div>`;

  // Build meta tags
  const tagsHtml = `
    ${Year ? `<span class="modal-tag">${Year}</span>` : ""}
    ${Rated && Rated !== "N/A" ? `<span class="modal-tag">${Rated}</span>` : ""}
    ${Runtime && Runtime !== "N/A" ? `<span class="modal-tag">${Runtime}</span>` : ""}
    ${Genre && Genre !== "N/A" ? `<span class="modal-tag">${Genre}</span>` : ""}
  `;

  // Build details grid — only show fields that have valid data
  const detailRow = (label, value) =>
    value && value !== "N/A"
      ? `<div class="modal-detail-row">
           <span class="modal-detail-label">${label}</span>
           <span class="modal-detail-value">${value}</span>
         </div>`
      : "";

  const detailsHtml = `
    ${detailRow("Director", Director)}
    ${detailRow("Actors", Actors)}
    ${detailRow("Language", Language)}
    ${detailRow("Country", Country)}
    ${detailRow("Released", Released)}
    ${detailRow("Box Office", BoxOffice)}
  `;

  // Full modal HTML
  modalBody.innerHTML = `
    <div class="modal-poster-section">
      ${posterHtml}
      <div class="modal-heading">
        <h2 id="modal-title">${Title}</h2>
        <div class="modal-meta">${tagsHtml}</div>
        ${imdbRating && imdbRating !== "N/A" ? `<p class="modal-rating-big">⭐ ${imdbRating}/10</p>` : ""}
      </div>
    </div>
    ${Plot && Plot !== "N/A" ? `<p class="modal-plot">"${Plot}"</p>` : ""}
    <div class="modal-details-grid">${detailsHtml}</div>
  `;
};

/**
 * Close the movie details modal.
 */
const closeModal = () => {
  modal.hidden = true;
  modalBody.innerHTML = "";
};

/**
 * Close modal when clicking on the overlay (outside the modal box).
 * @param {Event} event
 */
const handleModalOverlayClick = (event) => {
  if (event.target === modal) {
    closeModal();
  }
};

/**
 * Close modal on Escape key.
 * @param {KeyboardEvent} event
 */
const handleEscKey = (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
};
