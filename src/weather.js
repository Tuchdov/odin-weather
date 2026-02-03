/**
 * Gets data from visual crossing
 * @param {string} location - The location to get the weather from
 * @returns {JSON} The JSON file that the API returns
 */
export async function getWeatherData(location) {
  if (location.length === 0) {
    throw new Error("No location provided");
  }

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('Weather API key is not configured');
}
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`,
  );
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
  const { resolvedAddress } = weatherData;
  const { temp, feelslike, conditions, humidity, uvindex, windspeed, icon } =
    weatherData.currentConditions;

  return {
    resolvedAddress,
    temp,
    feelslike,
    conditions,
    humidity,
    uvindex,
    windspeed,
    icon,
  };
}




// Refactor weather.js to have extraction functions
export function extractCurrentData(weatherData) {
  const { resolvedAddress } = weatherData;
  const { temp, feelslike, conditions, humidity, uvindex, windspeed, icon } =
    weatherData.currentConditions;
  
  return {
    resolvedAddress,
    temp,
    feelslike,
    conditions,
    humidity,
    uvindex,
    windspeed,
    icon,
  };
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
    const forecast =
      (({ datetime, tempmax, tempmin, sunrise, sunset, conditions, icon }) => ({
        datetime,
        tempmax,
        tempmin,
        sunrise,
        sunset,
        conditions,
        icon,
      }))(weatherData.days[i]);
    weatherArr.push(forecast);
  }
  return weatherArr;
}

export function extractForecastData(weatherData) {
  const FORECAST_DAYS = 3
  const weatherArr = [];
  for (let i = 1; i <= FORECAST_DAYS; i++) {
    // create an object and push it to the array
    const forecast =
      (({ datetime, tempmax, tempmin, sunrise, sunset, conditions, icon }) => ({
        datetime,
        tempmax,
        tempmin,
        sunrise,
        sunset,
        conditions,
        icon,
      }))(weatherData.days[i]);
    weatherArr.push(forecast);
  }
  return weatherArr;
}
