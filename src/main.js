import './style.css'
//
import * as dom from './dom.js'
import * as weather from './weather.js'

// Store current weather data for re-rendering when units change
let currentWeatherData = null;
let currentForecastData = null;

dom.initLocationForm(async (location) => {
  try {
    dom.clearError();

    // Show skeleton loading state
    dom.showSkeletonLoading();

    const weatherData = await weather.getWeatherData(location);
    const current = weather.extractCurrentData(weatherData);
    const forecast = weather.extractForecastData(weatherData);

    // Store data for unit toggle
    currentWeatherData = current;
    currentForecastData = forecast;

    // Hide skeleton and render actual data
    dom.hideSkeletonLoading();
    dom.renderCurrentWeather(current);
    dom.renderForecast(forecast);
  } catch (error) {
    dom.hideSkeletonLoading();
    dom.showError(error.message);
  }
});

// Initialize unit toggle button
dom.initUnitToggle(() => {
  // Re-render with new units if we have data
  if (currentWeatherData && currentForecastData) {
    dom.renderCurrentWeather(currentWeatherData);
    dom.renderForecast(currentForecastData);
  }
});
