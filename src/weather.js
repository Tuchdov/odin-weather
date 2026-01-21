"use strict"
/**
 * Gets data from visual crossing
 * @param {string} location - The location to get the weather from
 * @returns {JSON} The JSON file that the API returns
 */
export async function getWeatherData(location) {
  if (location.length === 0){
    throw new Error('No location provided')
  }
  
  const API_KEY = 'F7DAMFZQK663JES2VYHE3SHKU';  // this is public and free to use
  const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`);
  if (!response.ok) {
    throw new Error(`Location "${location}" not found`);
  }
  const weatherData = await response.json();
  return weatherData;
}

/** 
 * Gets current weather data
 * @param {string} location - The location to get the weather from
 * @returns {object}  - The relevant fields
 */
export async function getCurrentData(location) {
  const weatherData = await getWeatherData(location);
  // destuctoring still need to understand this
  const current = (({ temp, feelslike, conditions, humidity, uvindex, windspeed } )=>
     ({ temp, feelslike, conditions, humidity, uvindex, windspeed }))(weatherData.currentConditions);
  return current
}

/** 
 * Gets weather for next 3 days
 * @param {string} location - The location to get the weather from
 * @returns {Array}] with The relevant fields, each day is an object
 */

export async function getForecast(location) {
  const weatherData = await getWeatherData(location);
  const weatherArr = [];
  for (let i = 1; i <= 3; i++) {
    // create an object and push it to the array
    const forecast = (({ datetime, tempmax, tempmin, sunrise, sunset, conditions }) =>
       ({ datetime, tempmax, tempmin, sunrise, sunset, conditions }))(weatherData.days[i]);
    weatherArr.push(forecast)
  }
  return weatherArr;
}

const weatherEmojiMap = {
  'clear-day': '☀️',
  'clear-night': '🌙',
  'partly-cloudy-day': '⛅',
  'partly-cloudy-night': '☁️',
  'cloudy': '☁️',
  'rain': '🌧️',
  'showers': '🌦️',
  'thunderstorm': '⛈️',
  'snow': '❄️',
  'wind': '💨',
  'fog': '🌫️'
  // Add other mappings as needed based on the Visual Crossing documentation
};

