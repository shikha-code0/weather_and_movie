/**
 * weather.js — Weather App UI logic.
 *
 * Handles:
 * - Form submission (search for city)
 * - Loading state
 * - Error display
 * - Dynamic DOM rendering of weather data
 *
 * Imports the API functions from api.js.
 */

import { fetchCityCoordinates, fetchWeather } from "./api.js";

/* DOM elements — fetched once at module load */
const weatherForm = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const weatherStatus = document.querySelector("#weather-status");
const weatherResult = document.querySelector("#weather-result");
const searchBtn = document.querySelector("#weather-search-btn");

/**
 * Initialize the Weather App — attach event listeners.
 */
export const initWeather = () => {
  // Form submit (handles both button click + Enter key)
  weatherForm.addEventListener("submit", handleWeatherSubmit);
};

/**
 * Handle weather form submission.
 * @param {Event} event — the submit event
 */
const handleWeatherSubmit = async (event) => {
  event.preventDefault(); // prevent page reload

  const city = cityInput.value.trim();

  // Input validation — empty check
  if (!city) {
    showWeatherError("Please enter a city name.");
    weatherResult.innerHTML = "";
    cityInput.focus();
    return;
  }

  // Start loading state
  setLoading(true);
  weatherResult.innerHTML = "";
  showWeatherLoading();

  try {
    // Step 1: Convert city name to coordinates
    const coords = await fetchCityCoordinates(city);

    // Step 2: Fetch weather using coordinates
    const weather = await fetchWeather(coords.latitude, coords.longitude);

    // Step 3: Render the weather card
    renderWeatherCard(coords, weather);
    weatherStatus.innerHTML = "";
  } catch (error) {
    // Show user-friendly error message
    showWeatherError(error.message);
    weatherResult.innerHTML = "";
  } finally {
    // Always stop loading state
    setLoading(false);
  }
};

/**
 * Show loading indicator in the status area.
 */
const showWeatherLoading = () => {
  weatherStatus.className = "status-message info";
  weatherStatus.innerHTML = `
    <span class="loading-dots" aria-label="Loading weather data">
      <span></span><span></span><span></span>
    </span>
    Loading weather...
  `;
};

/**
 * Show an error message in the status area.
 * @param {string} message — the error message to display
 */
const showWeatherError = (message) => {
  weatherStatus.className = "status-message error";
  weatherStatus.setAttribute("role", "alert");
  weatherStatus.textContent = message;
};

/**
 * Enable/disable loading state on the search button.
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
 * Render the weather card into the result container.
 * Uses template literals to build HTML dynamically.
 * @param {Object} coords — { name, country, timezone }
 * @param {Object} weather — weather data from fetchWeather()
 */
const renderWeatherCard = (coords, weather) => {
  const {
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    pressure,
    visibility,
    description,
    icon,
    isDay,
  } = weather;

  // Build the details grid — only include fields the API actually returned
  const detailsHtml = `
    <div class="detail-item">
      <span class="detail-label">Feels Like</span>
      <span class="detail-value">${feelsLike}°C</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Humidity</span>
      <span class="detail-value">${humidity}%</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Wind Speed</span>
      <span class="detail-value">${windSpeed} km/h</span>
    </div>
    <div class="detail-item">
      <span class="detail-label">Pressure</span>
      <span class="detail-value">${pressure} hPa</span>
    </div>
    ${visibility !== null ? `
    <div class="detail-item">
      <span class="detail-label">Visibility</span>
      <span class="detail-value">${visibility} km</span>
    </div>` : ""}
    <div class="detail-item">
      <span class="detail-label">Time of Day</span>
      <span class="detail-value">${isDay ? "Daytime" : "Nighttime"}</span>
    </div>
  `;

  // Current time in the city's timezone
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: coords.timezone || undefined,
  });

  // Template literal for the full weather card
  const cardHtml = `
    <div class="weather-card">
      <div class="weather-card-header">
        <span class="weather-icon" style="font-size: 4rem;" aria-hidden="true">${icon}</span>
        <div>
          <h2 class="weather-city">${coords.name}, ${coords.country}</h2>
          <p class="weather-time">Local time: ${timeString}</p>
        </div>
      </div>

      <div class="weather-temp">${temperature}°C</div>
      <div class="weather-condition">${description}</div>

      <div class="weather-details">
        ${detailsHtml}
      </div>
    </div>
  `;

  weatherResult.innerHTML = cardHtml;
};
