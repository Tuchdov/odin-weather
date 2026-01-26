/**
 * Tests for dom.js module
 * Run with: deno test tests/dom.test.js
 * 
 * This test file uses a global DOM mock to test DOM manipulation functions
 */

import {
  assert,
  assertEquals,
  assertExists,
} from "jsr:@std/assert";

import {
  renderCurrentWeather,
  renderForecast,
  initLocationForm,
} from "../src/dom.js";

// ============================================
// Global DOM Mock Setup
// ============================================

/**
 * Creates a mock DOM structure that matches our HTML
 */
function setupMockDOM() {
  const mockDocument = {
    // Store elements for querySelector to find
    _elements: new Map(),
    
    querySelector(selector) {
      return this._elements.get(selector) || null;
    },
    
    createElement(tagName) {
      const element = {
        tagName: tagName.toUpperCase(),
        className: '',
        _textContent: '',
        children: [],
        _attributes: new Map(),
        _eventListeners: new Map(),
        
        get textContent() {
          return this._textContent;
        },
        
        set textContent(value) {
          // Convert to string like real DOM does
          this._textContent = String(value);
        },
        
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        
        addEventListener(event, handler) {
          if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, []);
          }
          this._eventListeners.get(event).push(handler);
        },
        
        dispatchEvent(event) {
          const handlers = this._eventListeners.get(event.type) || [];
          handlers.forEach(handler => handler(event));
          return true;
        },
        
        querySelector(selector) {
          // Simple class-based selector for testing
          if (selector.startsWith('.')) {
            const className = selector.slice(1);
            return this.children.find(child => child.className === className) || null;
          }
          return null;
        },
        
        checkValidity() {
          return this._isValid !== false; // default true unless set false
        },
        
        reportValidity() {
          this._reportValidityCalled = true;
          return this.checkValidity();
        },
        
        get value() {
          return this._value || '';
        },
        
        set value(val) {
          this._value = val;
        }
      };
      
      return element;
    }
  };
  
  // Create current weather section elements
  const currentWeatherSection = mockDocument.createElement('section');
  currentWeatherSection.className = 'current-weather';
  
  const location = mockDocument.createElement('h2');
  location.className = 'location';
  const temperature = mockDocument.createElement('p');
  temperature.className = 'temperature';
  const feelslike = mockDocument.createElement('p');
  feelslike.className = 'feelslike';
  const conditions = mockDocument.createElement('p');
  conditions.className = 'conditions';
  const humidity = mockDocument.createElement('p');
  humidity.className = 'humidity';
  const uvindex = mockDocument.createElement('p');
  uvindex.className = 'uvindex';
  const windspeed = mockDocument.createElement('p');
  windspeed.className = 'windspeed';
  
  currentWeatherSection.children = [location, temperature, feelslike, conditions, humidity, uvindex, windspeed];
  
  // Store elements in the map
  mockDocument._elements.set('.current-weather', currentWeatherSection);
  mockDocument._elements.set('.current-weather .location', location);
  mockDocument._elements.set('.current-weather .temperature', temperature);
  mockDocument._elements.set('.current-weather .feelslike', feelslike);
  mockDocument._elements.set('.current-weather .conditions', conditions);
  mockDocument._elements.set('.current-weather .humidity', humidity);
  mockDocument._elements.set('.current-weather .uvindex', uvindex);
  mockDocument._elements.set('.current-weather .windspeed', windspeed);
  
  // Create forecast section elements
  const forecastList = mockDocument.createElement('ul');
  forecastList.className = 'forecast-list';
  forecastList.innerHTML = ''; // Support for innerHTML property
  forecastList._innerHTML = '';
  
  // Override innerHTML getter/setter
  Object.defineProperty(forecastList, 'innerHTML', {
    get() {
      return this._innerHTML;
    },
    set(value) {
      this._innerHTML = value;
      if (value === '') {
        this.children = [];
      }
    }
  });
  
  mockDocument._elements.set('.forecast-list', forecastList);
  
  // Create form elements
  const form = mockDocument.createElement('form');
  form.className = 'location-form';
  
  const input = mockDocument.createElement('input');
  input.className = 'location-input';
  input.id = 'location-input';
  
  mockDocument._elements.set('.location-form', form);
  mockDocument._elements.set('#location-input', input);
  
  return mockDocument;
}

// Set up global document before all tests
let mockDocument;

Deno.test.beforeEach(() => {
  mockDocument = setupMockDOM();
  globalThis.document = mockDocument;
});

Deno.test.afterEach(() => {
  delete globalThis.document;
});

// ============================================
// Tests for renderCurrentWeather
// ============================================

Deno.test("renderCurrentWeather - happy path: displays all values correctly", () => {
  const testData = {
    resolvedAddress: "London, UK",
    temp: 15.5,
    feelslike: 13.2,
    conditions: "Partly cloudy",
    humidity: 65,
    uvindex: 3,
    windspeed: 12.5,
    icon: "partly-cloudy-day"
  };
  
  renderCurrentWeather(testData);
  
  const section = mockDocument.querySelector('.current-weather');
  assertEquals(section.querySelector('.location').textContent, "London, UK");
  assertEquals(section.querySelector('.temperature').textContent, "15.5");
  assertEquals(section.querySelector('.feelslike').textContent, "13.2");
  assertEquals(section.querySelector('.humidity').textContent, "65");
  assertEquals(section.querySelector('.uvindex').textContent, "3");
  assertEquals(section.querySelector('.windspeed').textContent, "12.5");
});

Deno.test("renderCurrentWeather - emoji mapping: shows correct emoji for known icon", () => {
  const testData = {
    resolvedAddress: "London, UK",
    temp: 20,
    feelslike: 19,
    conditions: "Clear",
    humidity: 50,
    uvindex: 5,
    windspeed: 10,
    icon: "clear-day"
  };
  
  renderCurrentWeather(testData);
  
  const conditions = mockDocument.querySelector('.current-weather .conditions');
  assert(conditions.textContent.includes("☀️"), "Should include sun emoji for clear-day");
  assert(conditions.textContent.includes("Clear"), "Should include conditions text");
});

Deno.test("renderCurrentWeather - emoji fallback: shows default emoji for unknown icon", () => {
  const testData = {
    resolvedAddress: "London, UK",
    temp: 20,
    feelslike: 19,
    conditions: "Unknown condition",
    humidity: 50,
    uvindex: 5,
    windspeed: 10,
    icon: "unknown-weather-type"
  };
  
  renderCurrentWeather(testData);
  
  const conditions = mockDocument.querySelector('.current-weather .conditions');
  assert(conditions.textContent.includes("🌡️"), "Should show fallback thermometer emoji");
});

Deno.test("renderCurrentWeather - multiple emoji types: rain, snow, thunderstorm", () => {
  const testCases = [
    { icon: "rain", expectedEmoji: "🌧️" },
    { icon: "snow", expectedEmoji: "❄️" },
    { icon: "thunderstorm", expectedEmoji: "⛈️" },
  ];
  
  testCases.forEach(({ icon, expectedEmoji }) => {
    // Reset DOM for each test
    mockDocument = setupMockDOM();
    globalThis.document = mockDocument;
    
    const testData = {
      resolvedAddress: "Test City",
      temp: 10,
      feelslike: 8,
      conditions: "Test conditions",
      humidity: 80,
      uvindex: 2,
      windspeed: 15,
      icon: icon
    };
    
    renderCurrentWeather(testData);
    
    const conditions = mockDocument.querySelector('.current-weather .conditions');
    assert(
      conditions.textContent.includes(expectedEmoji),
      `Should show ${expectedEmoji} for ${icon} icon`
    );
  });
});

// ============================================
// Tests for renderForecast
// ============================================

Deno.test("renderForecast - happy path: creates correct number of list items", () => {
  const testData = [
    {
      datetime: "2024-01-27",
      tempmax: 15,
      tempmin: 8,
      conditions: "Partly cloudy",
      sunrise: "07:30",
      sunset: "17:45",
      icon: "partly-cloudy-day"
    },
    {
      datetime: "2024-01-28",
      tempmax: 16,
      tempmin: 9,
      conditions: "Sunny",
      sunrise: "07:29",
      sunset: "17:46",
      icon: "clear-day"
    },
    {
      datetime: "2024-01-29",
      tempmax: 14,
      tempmin: 7,
      conditions: "Rainy",
      sunrise: "07:28",
      sunset: "17:47",
      icon: "rain"
    }
  ];
  
  renderForecast(testData);
  
  const list = mockDocument.querySelector('.forecast-list');
  assertEquals(list.children.length, 3, "Should create exactly 3 list items");
});

Deno.test("renderForecast - correct data: each day shows correct values", () => {
  const testData = [
    {
      datetime: "2024-01-27",
      tempmax: 15,
      tempmin: 8,
      conditions: "Partly cloudy",
      sunrise: "07:30",
      sunset: "17:45",
      icon: "partly-cloudy-day"
    }
  ];
  
  renderForecast(testData);
  
  const list = mockDocument.querySelector('.forecast-list');
  const firstDay = list.children[0];
  
  // Find each child element by className
  const dateElement = firstDay.children.find(el => el.className === 'date');
  const tempHighElement = firstDay.children.find(el => el.className === 'temp-high');
  const tempLowElement = firstDay.children.find(el => el.className === 'temp-low');
  const conditionsElement = firstDay.children.find(el => el.className === 'conditions');
  const sunriseElement = firstDay.children.find(el => el.className === 'sunrise');
  const sunsetElement = firstDay.children.find(el => el.className === 'sunset');
  
  assertEquals(dateElement.textContent, "2024-01-27");
  assertEquals(tempHighElement.textContent, "15");
  assertEquals(tempLowElement.textContent, "8");
  assertEquals(sunriseElement.textContent, "07:30");
  assertEquals(sunsetElement.textContent, "17:45");
  assert(conditionsElement.textContent.includes("Partly cloudy"));
});

Deno.test("renderForecast - clears previous: calling twice doesn't duplicate", () => {
  const firstData = [
    {
      datetime: "2024-01-27",
      tempmax: 15,
      tempmin: 8,
      conditions: "Cloudy",
      sunrise: "07:30",
      sunset: "17:45",
      icon: "cloudy"
    }
  ];
  
  const secondData = [
    {
      datetime: "2024-01-28",
      tempmax: 20,
      tempmin: 12,
      conditions: "Sunny",
      sunrise: "07:29",
      sunset: "17:46",
      icon: "clear-day"
    },
    {
      datetime: "2024-01-29",
      tempmax: 18,
      tempmin: 10,
      conditions: "Rainy",
      sunrise: "07:28",
      sunset: "17:47",
      icon: "rain"
    }
  ];
  
  renderForecast(firstData);
  const list = mockDocument.querySelector('.forecast-list');
  assertEquals(list.children.length, 1, "Should have 1 item after first render");
  
  renderForecast(secondData);
  assertEquals(list.children.length, 2, "Should have 2 items after second render, not 3");
});

Deno.test("renderForecast - emoji mapping: each day shows correct emoji", () => {
  const testData = [
    { datetime: "2024-01-27", tempmax: 15, tempmin: 8, conditions: "Sunny", sunrise: "07:30", sunset: "17:45", icon: "clear-day" },
    { datetime: "2024-01-28", tempmax: 10, tempmin: 5, conditions: "Rainy", sunrise: "07:29", sunset: "17:46", icon: "rain" },
    { datetime: "2024-01-29", tempmax: 5, tempmin: -2, conditions: "Snowy", sunrise: "07:28", sunset: "17:47", icon: "snow" }
  ];
  
  renderForecast(testData);
  
  const list = mockDocument.querySelector('.forecast-list');
  const days = list.children;
  
  const day1Conditions = days[0].children.find(el => el.className === 'conditions');
  const day2Conditions = days[1].children.find(el => el.className === 'conditions');
  const day3Conditions = days[2].children.find(el => el.className === 'conditions');
  
  assert(day1Conditions.textContent.includes("☀️"), "Day 1 should show sun emoji");
  assert(day2Conditions.textContent.includes("🌧️"), "Day 2 should show rain emoji");
  assert(day3Conditions.textContent.includes("❄️"), "Day 3 should show snow emoji");
});

// ============================================
// Tests for initLocationForm
// ============================================

Deno.test("initLocationForm - valid submission: callback is called with input value", () => {
  let callbackCalled = false;
  let receivedValue = null;
  
  const testCallback = (value) => {
    callbackCalled = true;
    receivedValue = value;
  };
  
  initLocationForm(testCallback);
  
  const form = mockDocument.querySelector('.location-form');
  const input = mockDocument.querySelector('#location-input');
  
  // Set valid input
  input.value = "London";
  input._isValid = true; // Mock checkValidity to return true
  
  // Create and dispatch submit event
  const submitEvent = {
    type: 'submit',
    preventDefault() {
      this._defaultPrevented = true;
    },
    _defaultPrevented: false
  };
  
  form.dispatchEvent(submitEvent);
  
  assert(callbackCalled, "Callback should be called");
  assertEquals(receivedValue, "London", "Callback should receive input value");
  assert(submitEvent._defaultPrevented, "preventDefault should be called");
});

Deno.test("initLocationForm - invalid submission: callback is NOT called", () => {
  let callbackCalled = false;
  
  const testCallback = () => {
    callbackCalled = true;
  };
  
  initLocationForm(testCallback);
  
  const form = mockDocument.querySelector('.location-form');
  const input = mockDocument.querySelector('#location-input');
  
  // Set invalid input
  input.value = "123"; // Numbers should be invalid based on HTML pattern
  input._isValid = false; // Mock checkValidity to return false
  
  // Create and dispatch submit event
  const submitEvent = {
    type: 'submit',
    preventDefault() {
      this._defaultPrevented = true;
    },
    _defaultPrevented: false
  };
  
  form.dispatchEvent(submitEvent);
  
  assert(!callbackCalled, "Callback should NOT be called for invalid input");
  assert(input._reportValidityCalled, "reportValidity should be called");
});

Deno.test("initLocationForm - form doesn't reload: preventDefault works", () => {
  const testCallback = () => {};
  
  initLocationForm(testCallback);
  
  const form = mockDocument.querySelector('.location-form');
  const input = mockDocument.querySelector('#location-input');
  
  input.value = "Paris";
  input._isValid = true;
  
  const submitEvent = {
    type: 'submit',
    preventDefault() {
      this._defaultPrevented = true;
    },
    _defaultPrevented: false
  };
  
  form.dispatchEvent(submitEvent);
  
  assert(submitEvent._defaultPrevented, "preventDefault should be called to prevent form reload");
});

Deno.test("initLocationForm - handles multi-word locations", () => {
  let receivedValue = null;
  
  const testCallback = (value) => {
    receivedValue = value;
  };
  
  initLocationForm(testCallback);
  
  const form = mockDocument.querySelector('.location-form');
  const input = mockDocument.querySelector('#location-input');
  
  input.value = "New York";
  input._isValid = true;
  
  const submitEvent = {
    type: 'submit',
    preventDefault() {},
    _defaultPrevented: false
  };
  
  form.dispatchEvent(submitEvent);
  
  assertEquals(receivedValue, "New York", "Should handle multi-word locations");
});

// ============================================
// Edge Cases - What QA Would Add
// ============================================

Deno.test("renderCurrentWeather - edge case: handles missing icon gracefully", () => {
  const testData = {
    resolvedAddress: "Test City",
    temp: 20,
    feelslike: 19,
    conditions: "Unknown",
    humidity: 50,
    uvindex: 5,
    windspeed: 10
    // icon is missing
  };
  
  // Should not throw
  renderCurrentWeather(testData);
  
  const conditions = mockDocument.querySelector('.current-weather .conditions');
  assert(conditions.textContent.includes("🌡️"), "Should show fallback emoji when icon is missing");
});

Deno.test("renderForecast - edge case: handles empty array", () => {
  const testData = [];
  
  // Should not throw
  renderForecast(testData);
  
  const list = mockDocument.querySelector('.forecast-list');
  assertEquals(list.children.length, 0, "Should handle empty array gracefully");
});

Deno.test("initLocationForm - edge case: handles empty input value", () => {
  let callbackCalled = false;
  
  const testCallback = () => {
    callbackCalled = true;
  };
  
  initLocationForm(testCallback);
  
  const form = mockDocument.querySelector('.location-form');
  const input = mockDocument.querySelector('#location-input');
  
  input.value = "";
  input._isValid = false; // Empty should be invalid due to 'required' attribute
  
  const submitEvent = {
    type: 'submit',
    preventDefault() {},
    _defaultPrevented: false
  };
  
  form.dispatchEvent(submitEvent);
  
  assert(!callbackCalled, "Callback should NOT be called for empty input");
});