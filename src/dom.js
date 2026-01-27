"use strict";

// Unit system state
let currentUnit = localStorage.getItem('unitPreference') || 'imperial';

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
  return `${temp}°F`;
}

function formatWindSpeed(speed, unit) {
  if (unit === 'metric') {
    return `${mphToKmh(speed)} km/h`;
  }
  return `${speed} mph`;
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
 */
export function renderCurrentWeather(data) {
  const section = document.querySelector('.current-weather');
  // add fallback icon
  const emoji = weatherEmojiMap[data.icon] || '🌡️';

  section.querySelector('.location').textContent = data.resolvedAddress;
  section.querySelector('.temperature').textContent = `Temperature: ${formatTemperature(data.temp, currentUnit)}`;
  section.querySelector('.feelslike').textContent = `Feels Like: ${formatTemperature(data.feelslike, currentUnit)}`;
  section.querySelector('.conditions').textContent = `${emoji} ${data.conditions}`;
  section.querySelector('.humidity').textContent = `Humidity: ${data.humidity}%`;
  section.querySelector('.uvindex').textContent = `UV Index: ${data.uvindex}`;
  section.querySelector('.windspeed').textContent = `Wind Speed: ${formatWindSpeed(data.windspeed, currentUnit)}`;
}

/**
 * Renders forecast data to the DOM
 * @param {Array<Object>} data - Array of forecast days
 * @param {string} data[].datetime - Date string
 * @param {number} data[].tempmax - Maximum temperature
 * @param {number} data[].tempmin - Minimum temperature
 * @param {string} data[].conditions - Weather conditions
 * @param {string} data[].sunrise - Sunrise time
 * @param {string} data[].sunset - Sunset time
 */
export function renderForecast(data) {
  const list = document.querySelector('.forecast-list');
  list.innerHTML = '';
  data.forEach(day => {
    const li = document.createElement('li');
    li.className = 'forecast-day';
    const emoji = weatherEmojiMap[day.icon] || '🌡️';

    const datetime = document.createElement('p');
    datetime.className = 'date';
    datetime.textContent = day.datetime;

    const tempmax = document.createElement('p');
    tempmax.className = 'temp-high';
    tempmax.textContent = `High: ${formatTemperature(day.tempmax, currentUnit)}`;

    const tempmin = document.createElement('p');
    tempmin.className = 'temp-low';
    tempmin.textContent = `Low: ${formatTemperature(day.tempmin, currentUnit)}`;

    const conditions = document.createElement('p');
    conditions.className = 'conditions';
    conditions.textContent =  `${emoji} ${day.conditions}`;

    const sunrise = document.createElement('p');
    sunrise.className = 'sunrise';
    sunrise.textContent = `Sunrise: ${day.sunrise}`;

    const sunset = document.createElement('p');
    sunset.className = 'sunset';
    sunset.textContent = `Sunset: ${day.sunset}`;

    li.appendChild(datetime);
    li.appendChild(tempmax);
    li.appendChild(tempmin);
    li.appendChild(conditions);
    li.appendChild(sunrise);
    li.appendChild(sunset);

    list.appendChild(li);
  });
}

/**
 * Initializes the location search form with validation
 * @param {Function} callback -  a place holder name, for a function you call that function and it will use the
 * input.checkValidity as an argument to this function 
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
  // Add other mappings as needed based on the Visual Crossing documentation
};

export function showError(messege){
  const formError = document.querySelector('.form-error');
  formError.textContent = messege;
}

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
    ? 'Switch to Metric (°C, km/h)'
    : 'Switch to Imperial (°F, mph)';
  
  toggleBtn.addEventListener('click', () => {
    // Switch unit system
    currentUnit = currentUnit === 'imperial' ? 'metric' : 'imperial';
    
    // Update button text
    toggleBtn.textContent = currentUnit === 'imperial'
      ? 'Switch to Metric (°C, km/h)'
      : 'Switch to Imperial (°F, mph)';
    
    // Save preference
    localStorage.setItem('unitPreference', currentUnit);
    
    // Call callback to re-render with new units
    callback(currentUnit);
  });
}