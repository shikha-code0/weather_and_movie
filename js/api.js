/**
 * api.js — Reusable API functions for Weather and Movie APIs.
 *
 * This file contains all fetch() calls, separated from UI logic.
 * Each function returns a Promise that resolves to parsed JSON data,
 * or throws an Error with a user-friendly message on failure.
 */

/* ============================================================
   WEATHER API — Open-Meteo (no API key required)
   ============================================================
   Open-Meteo provides free weather data without an API key.
   We use two endpoints:
   1. Geocoding API — to convert a city name into latitude/longitude
   2. Forecast API — to get weather using those coordinates
   Documentation: https://open-meteo.com/en/docs
   ============================================================ */

/**
 * Fetch coordinates for a city name using Open-Meteo's Geocoding API.
 * @param {string} cityName — The city to search (e.g. "Kanpur")
 * @returns {Promise<Object>} — { latitude, longitude, name, country, timezone }
 * @throws {Error} if the city is not found or the request fails
 */
export const fetchCityCoordinates = async (cityName) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cityName
  )}&count=1&language=en&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather data. Please try again.");
  }

  const data = await response.json();

  // Check if any results were returned
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Please check the city name.");
  }

  // Destructure the first matching result
  const { latitude, longitude, name, country, timezone } = data.results[0];

  return { latitude, longitude, name, country, timezone };
};

/**
 * Fetch current weather for given coordinates using Open-Meteo Forecast API.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} — structured weather data
 * @throws {Error} if the request fails
 */
export const fetchWeather = async (latitude, longitude) => {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,` +
    `wind_speed_10m,pressure_msl,visibility,is_day&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather data. Please try again.");
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error("Weather data is incomplete. Please try another city.");
  }

  // Destructure current weather values from the API response
  const {
    temperature_2m,
    relative_humidity_2m,
    apparent_temperature,
    weather_code,
    wind_speed_10m,
    pressure_msl,
    visibility,
    is_day,
  } = data.current;

  // Map the numeric weather code to a text description + emoji icon
  const { description, icon } = mapWeatherCode(weather_code);

  return {
    temperature: Math.round(temperature_2m),
    feelsLike: Math.round(apparent_temperature),
    humidity: relative_humidity_2m,
    windSpeed: Math.round(wind_speed_10m),
    pressure: Math.round(pressure_msl),
    visibility: visibility ? Math.round(visibility / 1000) : null,
    isDay: is_day === 1,
    description,
    icon,
  };
};

/**
 * Map Open-Meteo WMO weather codes to human-readable text + emoji.
 * Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 * @param {number} code — WMO weather code
 * @returns {{description: string, icon: string}}
 */
const mapWeatherCode = (code) => {
  const weatherMap = {
    0:  { description: "Clear sky",         icon: "☀️" },
    1:  { description: "Mainly clear",       icon: "🌤️" },
    2:  { description: "Partly cloudy",      icon: "⛅" },
    3:  { description: "Overcast",           icon: "☁️" },
    45: { description: "Fog",                icon: "🌫️" },
    48: { description: "Rime fog",           icon: "🌫️" },
    51: { description: "Light drizzle",      icon: "🌦️" },
    53: { description: "Moderate drizzle",   icon: "🌦️" },
    55: { description: "Dense drizzle",      icon: "🌧️" },
    56: { description: "Freezing drizzle",   icon: "🌧️" },
    57: { description: "Freezing drizzle",   icon: "🌧️" },
    61: { description: "Slight rain",        icon: "🌦️" },
    63: { description: "Moderate rain",      icon: "🌧️" },
    65: { description: "Heavy rain",         icon: "🌧️" },
    66: { description: "Freezing rain",      icon: "🌧️" },
    67: { description: "Freezing rain",      icon: "🌧️" },
    71: { description: "Slight snow",        icon: "🌨️" },
    73: { description: "Moderate snow",      icon: "🌨️" },
    75: { description: "Heavy snow",         icon: "❄️" },
    77: { description: "Snow grains",        icon: "🌨️" },
    80: { description: "Slight rain showers",icon: "🌦️" },
    81: { description: "Rain showers",       icon: "🌧️" },
    82: { description: "Violent rain showers",icon: "⛈️" },
    85: { description: "Snow showers",       icon: "🌨️" },
    86: { description: "Heavy snow showers", icon: "❄️" },
    95: { description: "Thunderstorm",       icon: "⛈️" },
    96: { description: "Thunderstorm w/ hail",icon: "⛈️" },
    99: { description: "Severe thunderstorm", icon: "⛈️" },
  };

  return weatherMap[code] ?? { description: "Unknown", icon: "❓" };
};

/* ============================================================
   MOVIE API — OMDb API (requires free API key)
   ============================================================
   OMDb (Open Movie Database) provides movie information.
   Get a free API key at: https://www.omdbapi.com/apikey.aspx

   The key is stored in js/config.js and imported here.
   If the key is the placeholder, we fall back to a free
   demo approach using OMDb's search + by-search endpoints
   with the placeholder text parameter.

   For full details (plot, director, actors) we use the
   "t" (title) or "i" (imdbID) endpoint.
   ============================================================ */

import { OMDB_API_KEY } from "./config.js";

const OMDB_BASE = "https://www.omdbapi.com/";

/**
 * Search for movies by title using OMDb API.
 * @param {string} query — movie title to search (e.g. "Avengers")
 * @returns {Promise<Array>} — array of movie result objects
 * @throws {Error} with user-friendly message
 */
export const fetchMovies = async (query) => {
  const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
    query
  )}&type=movie`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again later.");
  }

  const data = await response.json();

  // OMDb returns { Response: "False", Error: "Movie not found!" }
  if (data.Response === "False") {
    if (data.Error === "Movie not found!") {
      throw new Error("No movies found. Try another search.");
    }
    if (data.Error === "Invalid API key!") {
      throw new Error(
        "Unable to retrieve movie information. API key may be invalid."
      );
    }
    throw new Error(data.Error || "Unable to retrieve movie information.");
  }

  // Return the array of search results (each has Title, Year, imdbID, Poster, Type)
  const { Search = [] } = data;
  return Search;
};

/**
 * Fetch full details for a single movie by its imdbID.
 * @param {string} imdbID — the IMDb ID from search results
 * @returns {Promise<Object>} — full movie details
 * @throws {Error} with user-friendly message
 */
export const fetchMovieDetails = async (imdbID) => {
  const url = `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(
    imdbID
  )}&plot=full`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve movie information.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    throw new Error("Unable to retrieve movie information.");
  }

  return data;
};
