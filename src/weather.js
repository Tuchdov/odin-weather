"use strict"
// You’re going to want functions that can take a location
//  and return the weather data for that location.
//  For now, just console.log() the information.

/**
 * Gets data from visual crossing
 * @param {string} location - The location to get the weather from
 * @returns {JSON} The JSON file that the API returns
 */
export async function getWeatherData(location) {
    const API_KEY = 'F7DAMFZQK663JES2VYHE3SHKU';  // this is public and free to use
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`);
    const weatherData = await response.json();
    return weatherData;
}
/** 
 * Gets current weather data
 * @param {string} location - The location to get the weather from
 * @returns {string} humidity - The relevant fields
 */
async function getCurrentData(location){
  const   weatherData = await getWeatherData(location);
  const current = weatherData.currentConditions;
  // destuctoring still need to understand this
  const {  temp, humidity , uvindex} = current;
  return console.log( `${location} stats:  temp: ${temp}, humidity: ${humidity}% , uvindex ${uvindex}`)
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


getCurrentData('london');
