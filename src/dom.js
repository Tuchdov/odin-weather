"use strict";

// Unit system state
let currentUnit = localStorage.getItem('unitPreference') || 'imperial';

// Weather icon to theme mapping
const weatherThemes = {
  'clear-day': 'theme-sunny',
  'clear-night': 'theme-night',
  'partly-cloudy-day': 'theme-cloudy',
  'partly-cloudy-night': 'theme-night',
  'cloudy': 'theme-cloudy',
  'rain': 'theme-rainy',
  'showers': 'theme-rainy',
  'thunderstorm': 'theme-stormy',
  'snow': 'theme-snowy',
  'wind': 'theme-cloudy',
  'fog': 'theme-foggy'
};

// Weather emoji mapping
const weatherEmojiMap = {
  "clear-day": "☀️",
  "clear-night": "🌙",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "☁️",
  "cloudy": "☁️",
  "rain": "🌧️",
  "showers": "🌦️",
  "thunderstorm": "⛈️",
  "snow": "❄️",
  "wind": "💨",
  "fog": "🌫️",
};

// Conversion utility functions
function fahrenheitToCelsius(temp) {
  return Math.round((temp - 32) * 5 / 9);
}

function mphToKmh(speed) {
  return Math.round(speed * 1.60934);
}

// Formatting functions
function formatTemperature(temp, unit) {
  if (unit === 'metric') {
    return `${fahrenheitToCelsius(temp)}°C`;
  }
  return `${Math.round(temp)}°F`;
}

function formatWindSpeed(speed, unit) {
  if (unit === 'metric') {
    return `${mphToKmh(speed)} km/h`;
  }
  return `${Math.round(speed)} mph`;
}

/**
 * Sets the weather theme on the body based on weather icon
 * @param {string} icon - Weather icon code from API
 */
export function setWeatherTheme(icon) {
  const body = document.body;

  // Remove all existing theme classes
  Object.values(weatherThemes).forEach(theme => {
    body.classList.remove(theme);
  });

  // Add new theme class
  const themeClass = weatherThemes[icon] || 'theme-sunny';
  body.classList.add(themeClass);
}

/**
 * Shows skeleton loading UI
 */
export function showSkeletonLoading() {
  const weatherContent = document.querySelector('.weather-content');
  const currentCard = document.querySelector('.card--current');
  const forecastGrid = document.querySelector('.forecast-grid');

  weatherContent.classList.add('is-loading');

  // Preserve the unit toggle button
  const toggle = currentCard.querySelector('.unit-toggle');

  // Create skeleton for current weather
  currentCard.innerHTML = `
    <div class="skeleton-current">
      <div class="skeleton skeleton--text-lg" style="width: 40%;"></div>
      <div class="skeleton-main">
        <div class="skeleton skeleton--text-4xl"></div>
        <div class="skeleton skeleton--icon"></div>
      </div>
      <div class="skeleton skeleton--text" style="width: 30%;"></div>
      <div class="skeleton-details">
        <div class="skeleton skeleton--block"></div>
        <div class="skeleton skeleton--block"></div>
        <div class="skeleton skeleton--block"></div>
        <div class="skeleton skeleton--block"></div>
      </div>
    </div>
  `;

  // Re-insert the toggle button
  if (toggle) {
    currentCard.insertBefore(toggle, currentCard.firstChild);
  }

  // Create skeleton for forecast cards
  forecastGrid.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const skeletonCard = document.createElement('article');
    skeletonCard.className = 'card card--forecast';
    skeletonCard.innerHTML = `
      <div class="skeleton-forecast">
        <div class="skeleton skeleton--text-lg" style="width: 60%;"></div>
        <div class="skeleton skeleton--icon"></div>
        <div class="skeleton skeleton--text" style="width: 80%;"></div>
        <div class="skeleton skeleton--text-sm" style="width: 100%;"></div>
      </div>
    `;
    forecastGrid.appendChild(skeletonCard);
  }
}

/**
 * Hides skeleton loading UI
 */
export function hideSkeletonLoading() {
  const weatherContent = document.querySelector('.weather-content');
  weatherContent.classList.remove('is-loading');
}

/**
 * Renders current weather data to the DOM
 * @param {Object} data - Current weather data
 * @param {string} data.resolvedAddress - Location name
 * @param {number} data.temp - Temperature
 * @param {number} data.feelslike - Feels like temperature
 * @param {string} data.conditions - Weather conditions
 * @param {number} data.humidity - Humidity percentage
 * @param {number} data.uvindex - UV index
 * @param {number} data.windspeed - Wind speed
 * @param {string} data.icon - Weather icon code
 */
export function renderCurrentWeather(data) {
  const card = document.querySelector('.card--current');
  const emoji = weatherEmojiMap[data.icon] || '🌡️';

  // Set weather theme
  setWeatherTheme(data.icon);

  // Preserve the unit toggle button before re-rendering
  const toggle = card.querySelector('.unit-toggle');

  // Render card content
  card.innerHTML = `
    <h2 class="location">${data.resolvedAddress}</h2>
    <div class="current-main">
      <span class="temperature">${formatTemperature(data.temp, currentUnit)}</span>
      <span class="conditions-icon" aria-hidden="true">${emoji}</span>
    </div>
    <p class="conditions">${data.conditions}</p>
    <div class="current-details">
      <p class="feelslike">Feels Like: ${formatTemperature(data.feelslike, currentUnit)}</p>
      <p class="humidity">Humidity: ${data.humidity}%</p>
      <p class="uvindex">UV Index: ${data.uvindex}</p>
      <p class="windspeed">Wind: ${formatWindSpeed(data.windspeed, currentUnit)}</p>
    </div>
  `;

  // Re-insert the toggle button
  if (toggle) {
    card.insertBefore(toggle, card.firstChild);
  }
}

/**
 * Renders forecast data to the DOM as individual cards
 * @param {Array<Object>} data - Array of forecast days
 * @param {string} data[].datetime - Date string
 * @param {number} data[].tempmax - Maximum temperature
 * @param {number} data[].tempmin - Minimum temperature
 * @param {string} data[].conditions - Weather conditions
 * @param {string} data[].sunrise - Sunrise time
 * @param {string} data[].sunset - Sunset time
 * @param {string} data[].icon - Weather icon code
 */
export function renderForecast(data) {
  const grid = document.querySelector('.forecast-grid');
  grid.innerHTML = '';

  data.forEach(day => {
    const emoji = weatherEmojiMap[day.icon] || '🌡️';
    const dateLabel = formatDate(day.datetime);

    const card = document.createElement('article');
    card.className = 'card card--forecast';
    card.setAttribute('aria-label', `Forecast for ${dateLabel}`);
    card.innerHTML = `
      <p class="date">${dateLabel}</p>
      <p class="conditions">${emoji} ${day.conditions}</p>
      <div class="temps">
        <span class="temp-high">H: ${formatTemperature(day.tempmax, currentUnit)}</span>
        <span class="temp-low">L: ${formatTemperature(day.tempmin, currentUnit)}</span>
      </div>
      <div class="sun-times">
        <span class="sunrise">☀️ ${formatTime(day.sunrise)}</span>
        <span class="sunset">🌙 ${formatTime(day.sunset)}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

/**
 * Formats date string to readable format
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formats time string to 12-hour format
 * @param {string} timeStr - Time string (HH:MM:SS)
 * @returns {string} Formatted time
 */
function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Initializes the location search form with validation
 * @param {Function} callback - Function to call with valid location input
 */
export function initLocationForm(callback) {
  const form = document.querySelector('.location-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#location-input');

    if (input.checkValidity()) {
      callback(input.value);
    } else {
      input.reportValidity();
    }
  });
}

/**
 * Shows an error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
  const formError = document.querySelector('.form-error');
  formError.textContent = message;
}

/**
 * Clears the error message
 */
export function clearError() {
  showError('');
}

/**
 * Initializes the unit toggle button
 * @param {Function} callback - Function to call when unit is toggled, receives new unit as parameter
 */
export function initUnitToggle(callback) {
  const toggleBtn = document.getElementById('unit-toggle-btn');

  // Set initial button text based on current unit
  toggleBtn.textContent = currentUnit === 'imperial'
    ? '°C / km/h'
    : '°F / mph';

  toggleBtn.addEventListener('click', () => {
    // Switch unit system
    currentUnit = currentUnit === 'imperial' ? 'metric' : 'imperial';

    // Update button text
    toggleBtn.textContent = currentUnit === 'imperial'
      ? '°C / km/h'
      : '°F / mph';

    // Save preference
    localStorage.setItem('unitPreference', currentUnit);

    // Call callback to re-render with new units
    callback(currentUnit);
  });
}
