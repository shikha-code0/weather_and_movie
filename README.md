# Weather App + Movie Search App

## Project Overview

This is a **JavaScript minor project** consisting of two interactive web applications that fetch live data from public REST APIs:

1. **Weather App** — Search for any city and see current temperature, humidity, wind speed, and more.
2. **Movie Search App** — Search for any movie and view posters, ratings, release details, and full movie information.

Both apps use the **Fetch API**, **Promises**, and **async/await** to make real HTTP requests to public APIs and dynamically render the results in the browser.

---

## Features

### Weather App

- Search weather by city name
- Current temperature (°C)
- Feels-like temperature
- Weather condition with icon
- Humidity percentage
- Wind speed (km/h)
- Pressure (hPa)
- Visibility (km)
- Daytime/Nighttime indicator
- Loading state
- Error handling (empty input, city not found, network failure)
- Responsive design

### Movie Search App

- Search movies by title
- Movie poster display (with placeholder for missing posters)
- Movie title and release year
- IMDb rating
- View Details button → opens modal
- Full movie details modal (director, actors, plot, genre, runtime, etc.)
- Loading state
- Error handling (empty input, no results, API failure, missing poster)
- Responsive card grid layout

---

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Media Queries, CSS Variables)
- JavaScript ES6+ (Modules, Arrow Functions, Template Literals, Destructuring)
- Fetch API
- REST APIs
- Git / GitHub

---

## JavaScript Concepts Demonstrated

This project explicitly demonstrates the following ES6+ concepts:

| Concept | Where to find it |
|---|---|
| **Arrow functions** | All JS files (e.g. `const searchMovies = () => {}` in movies.js) |
| **Template literals** | `renderWeatherCard()` in weather.js, `renderMovieCards()` in movies.js |
| **Destructuring** | `const { Title, Year, Poster } = movie;` in movies.js |
| **ES6 Modules** | `export` / `import` across api.js, weather.js, movies.js, main.js |
| **const / let** | Used throughout (no `var`) |
| **async / await** | `handleWeatherSubmit()`, `handleMovieSubmit()`, `openMovieDetails()` |
| **Promises** | fetch() returns Promises, chained with await |
| **Fetch API** | `fetchWeather()`, `fetchMovies()`, `fetchMovieDetails()` in api.js |
| **try / catch / finally** | `handleWeatherSubmit()`, `handleMovieSubmit()` |
| **DOM manipulation** | `document.querySelector()`, `innerHTML`, `textContent`, `classList` |
| **Event handling** | `addEventListener()` for forms, buttons, modal, keyboard |
| **Form processing** | `event.preventDefault()`, input validation, `.trim()` |

---

## API Information

### Weather API — Open-Meteo (No API Key Required)

- **API**: [Open-Meteo](https://open-meteo.com/)
- **Endpoints used**:
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}`
  - Forecast: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...`
- **Why**: Free, no registration, no API key needed, reliable
- **How it works**:
  1. User types a city name
  2. Geocoding API converts city name → latitude/longitude
  3. Forecast API returns weather using those coordinates

### Movie API — OMDb API (Free API Key Required)

- **API**: [OMDb API](https://www.omdbapi.com/)
- **Endpoints used**:
  - Search: `https://www.omdbapi.com/?apikey={key}&s={title}&type=movie`
  - Details: `https://www.omdbapi.com/?apikey={key}&i={imdbID}&plot=full`
- **Why**: Free tier (1,000 requests/day), well-known movie database
- **How it works**:
  1. User types a movie name
  2. Search endpoint returns matching movies (title, year, poster, IMDb ID)
  3. "View Details" fetches full details by IMDb ID

---

## Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/weather-movie-search-app.git
cd weather-movie-search-app
```

### Step 2: Get an OMDb API key (free)

1. Go to [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Fill in the free registration form
3. Check your email for the API key
4. Open `js/config.js` and replace the placeholder with your key:

```js
export const OMDB_API_KEY = "your-api-key-here";
```

### Step 3: Run the project

Since this project uses ES6 modules (`import`/`export`), you need to serve it via a local web server — you cannot just open `index.html` directly in the browser.

**Option A — VS Code Live Server (recommended for students):**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. The app opens in your browser at `http://127.0.0.1:5500`

**Option B — Python's built-in server:**
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option C — Node.js http-server:**
```bash
npx http-server -p 8000
```
Then open `http://localhost:8000` in your browser.

> **Note**: The Weather App works immediately without any API key. Only the Movie Search App requires an OMDb API key.

---

## API Key Setup

1. The OMDb API key is stored in `js/config.js`
2. This file is imported by `js/api.js`
3. To use your own key, simply edit `js/config.js`
4. For security in production, use a `.env` file and add it to `.gitignore`
5. The current project includes a free demo key — replace it with your own

---

## Project Structure

```
weather-movie-search-app/
│
├── index.html              # Main HTML page with all three views
├── README.md               # This file
├── .gitignore              # Files to ignore in Git
│
├── css/
│   └── style.css           # All styling (responsive, variables, animations)
│
└── js/
    ├── config.js           # API key configuration
    ├── api.js              # Reusable fetch() functions for both APIs
    ├── weather.js          # Weather App UI logic
    ├── movies.js           # Movie Search App UI logic
    └── main.js             # Entry point — navigation & initialization
```

---

## Screenshots

_Screenshots can be added here after running the project._

**Weather App:**
<!-- Add screenshot of weather search result -->

**Movie Search App:**
<!-- Add screenshot of movie search results -->

**Movie Details Modal:**
<!-- Add screenshot of movie details modal -->

---

## Future Improvements

- 5-day weather forecast view
- Geolocation-based weather (auto-detect user's city)
- Movie genre filtering
- Favorites / watchlist feature
- Search history
- Dark mode toggle
- Unit toggle for weather (°C / °F)
- Pagination for movie search results

---

## How to Push to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Weather + Movie Search App"

# Add your remote repository
git remote add origin https://github.com/yourusername/weather-movie-search-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## License

This project is open-source and free to use for educational purposes.
