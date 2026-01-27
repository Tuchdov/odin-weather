"use strict";

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
  section.querySelector('.temperature').textContent = data.temp;
  section.querySelector('.feelslike').textContent = data.feelslike;
  section.querySelector('.conditions').textContent = `${emoji} ${data.conditions}`;
  section.querySelector('.humidity').textContent = data.humidity;
  section.querySelector('.uvindex').textContent = data.uvindex;
  section.querySelector('.windspeed').textContent = data.windspeed;
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
    tempmax.textContent = day.tempmax;

    const tempmin = document.createElement('p');
    tempmin.className = 'temp-low';
    tempmin.textContent = day.tempmin;

    const conditions = document.createElement('p');
    conditions.className = 'conditions';
    conditions.textContent =  `${emoji} ${day.conditions}`;

    const sunrise = document.createElement('p');
    sunrise.className = 'sunrise';
    sunrise.textContent = day.sunrise;

    const sunset = document.createElement('p');
    sunset.className = 'sunset';
    sunset.textContent = day.sunset;

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