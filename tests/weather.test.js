/**
 * Tests for weather.js module
 * deno test --allow-net tests/weather.test.js 
 */

import {
  assert,
  assertEquals,
  assertExists,
} from "jsr:@std/assert";

import {
  getWeatherData,
  getCurrentData,
  getForecast,
} from "../src/weather.js";



// Cache API responses to avoid multiple network calls
let weatherDataResult;
let currentDataResult;
let forecastResult;

// Fetch all data once before tests run
Deno.test.beforeAll(async () => {
  console.log("Fetching weather data for tests...");
  weatherDataResult = await getWeatherData("london");
  currentDataResult = await getCurrentData("london");
  forecastResult = await getForecast("london");
});

// ============================================
// Tests for getWeatherData(location)
// ============================================

Deno.test("getWeatherData - returns an object", () => {
  assertExists(weatherDataResult, "Should return something, not undefined/null");
  assertEquals(typeof weatherDataResult, "object", "Should return an object");
});

Deno.test("getWeatherData - has expected top-level keys", () => {
  assert("currentConditions" in weatherDataResult, "Should have 'currentConditions' key");
  assert("days" in weatherDataResult, "Should have 'days' key");
});

// ============================================
// Tests for getCurrentData(location)
// ============================================

Deno.test("getCurrentData - returns an object", () => {
  assertExists(currentDataResult, "Should return something, not undefined/null");
  assertEquals(typeof currentDataResult, "object", "Should return an object");
});

Deno.test("getCurrentData - has exactly the right keys", () => {
  const expectedKeys = ["temp", "feelslike", "conditions", "humidity", "uvindex", "windspeed"];
  const actualKeys = Object.keys(currentDataResult);

  // Check all expected keys exist
  for (const key of expectedKeys) {
    assert(key in currentDataResult, `Should have '${key}' key`);
  }

  // Check no extra keys
  assertEquals(actualKeys.length, 6, "Should have exactly 6 keys, no more");
});

Deno.test("getCurrentData - values are correct types", () => {
  // Numbers: temp, feelslike, humidity, uvindex, windspeed
  assertEquals(typeof currentDataResult.temp, "number", "temp should be a number");
  assertEquals(typeof currentDataResult.feelslike, "number", "feelslike should be a number");
  assertEquals(typeof currentDataResult.humidity, "number", "humidity should be a number");
  assertEquals(typeof currentDataResult.uvindex, "number", "uvindex should be a number");
  assertEquals(typeof currentDataResult.windspeed, "number", "windspeed should be a number");

  // String: conditions
  assertEquals(typeof currentDataResult.conditions, "string", "conditions should be a string");
});

// ============================================
// Tests for getForecast(location)
// ============================================

Deno.test("getForecast - returns an array", () => {
  assert(Array.isArray(forecastResult), "Should return an array, not an object");
});

Deno.test("getForecast - returns exactly 3 items", () => {
  assertEquals(forecastResult.length, 3, "Should return exactly 3 days");
});

Deno.test("getForecast - each item has the right keys", () => {
  const expectedKeys = ["datetime", "tempmax", "tempmin", "sunrise", "sunset", "conditions"];

  for (let i = 0; i < forecastResult.length; i++) {
    const day = forecastResult[i];
    for (const key of expectedKeys) {
      assert(key in day, `Day ${i + 1} should have '${key}' key`);
    }
  }
});

Deno.test("getForecast - values are correct types", () => {
  for (let i = 0; i < forecastResult.length; i++) {
    const day = forecastResult[i];

    // Numbers: tempmax, tempmin
    assertEquals(typeof day.tempmax, "number", `Day ${i + 1}: tempmax should be a number`);
    assertEquals(typeof day.tempmin, "number", `Day ${i + 1}: tempmin should be a number`);

    // Strings: datetime, sunrise, sunset, conditions
    assertEquals(typeof day.datetime, "string", `Day ${i + 1}: datetime should be a string`);
    assertEquals(typeof day.sunrise, "string", `Day ${i + 1}: sunrise should be a string`);
    assertEquals(typeof day.sunset, "string", `Day ${i + 1}: sunset should be a string`);
    assertEquals(typeof day.conditions, "string", `Day ${i + 1}: conditions should be a string`);
  }
});

// ============================================
// Edge Case Tests
// ============================================

Deno.test("getWeatherData - handles location with spaces", async () => {
  const result = await getWeatherData("new york");
  assertExists(result, "Should return data for 'new york'");
  assert("currentConditions" in result, "Should have currentConditions for location with spaces");
});

Deno.test("getCurrentData - handles location with spaces", async () => {
  const result = await getCurrentData("new york");
  assertExists(result, "Should return current data for 'new york'");
  assertEquals(typeof result.temp, "number", "Should have valid temp for location with spaces");
});

Deno.test("getForecast - handles location with spaces", async () => {
  const result = await getForecast("new york");
  assert(Array.isArray(result), "Should return array for 'new york'");
  assertEquals(result.length, 3, "Should return 3 days for location with spaces");
});

Deno.test("getWeatherData - throws error for empty string", async () => {
  let errorThrown = false;
  try {
    await getWeatherData("");
  } catch (error) {
    errorThrown = true;
  }
  assert(errorThrown, "Should throw an error for empty location string");
});

Deno.test("getCurrentData - throws error for empty string", async () => {
  let errorThrown = false;
  try {
    await getCurrentData("");
  } catch (error) {
    errorThrown = true;
  }
  assert(errorThrown, "Should throw an error for empty location string");
});

Deno.test("getForecast - throws error for empty string", async () => {
  let errorThrown = false;
  try {
    await getForecast("");
  } catch (error) {
    errorThrown = true;
  }
  assert(errorThrown, "Should throw an error for empty location string");
});






