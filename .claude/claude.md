# Odin Weather - Claude Project Context

## Project Overview

**Odin Weather** - A weather application that displays current conditions and
a 3-day forecast using the Visual Crossing Weather API. Built with vanilla
JavaScript, featuring unit conversion (Imperial/Metric), form validation, and
weather condition icons via emoji mapping.

**Author:** Dov Tuch **License:** MIT

## Technology Stack

- **Runtime:** Vanilla JavaScript (ES6 Modules)
- **Build Tool:** Vite 7.2.4
- **Testing:** Deno Testing Framework
- **API:** Visual Crossing Weather API
- **CSS:** Custom Styles with Dark/Light Mode Support
- **Storage:** Browser LocalStorage (unit preference)

## Project Structure

```
odin-weather/
├── src/
│   ├── main.js          # Application entry point & state management
│   ├── weather.js       # Weather API integration
│   ├── dom.js           # DOM manipulation, rendering & event handling
│   └── style.css        # Application styles
├── tests/               # Deno-based test suite
│   ├── weather.test.js  # Weather API tests
│   └── dom.test.js      # DOM rendering tests
├── meta-weather/        # Project requirements & reference docs
├── index.html           # Main HTML template
├── package.json         # NPM configuration (for Vite)
└── deno.lock            # Deno dependency lock
```

## Core Architecture

### main.js

Application entry point and state coordinator:

- Imports and initializes DOM and weather modules
- Stores current weather/forecast data for unit toggle re-rendering
- Handles form submission callback with error handling
- Initializes unit toggle with re-render callback

### weather.js

Weather API integration layer:

- `getWeatherData(location)` - Fetches raw data from Visual Crossing API
- `getCurrentData(location)` - Returns current conditions (temp, feelslike, conditions, humidity, uvindex, windspeed, icon)
- `getForecast(location)` - Returns 3-day forecast array (datetime, tempmax, tempmin, sunrise, sunset, conditions, icon)

### dom.js

View layer and event management:

- `renderCurrentWeather(data)` - Renders current weather section with unit formatting
- `renderForecast(data)` - Renders 3-day forecast list with unit formatting
- `initLocationForm(callback)` - Sets up location search form with validation
- `initUnitToggle(callback)` - Initializes Imperial/Metric toggle button
- `showError(message)` / `clearError()` - Error display handling
- Unit conversion utilities: `fahrenheitToCelsius()`, `mphToKmh()`
- Weather emoji mapping for condition icons

## Development Commands

### Using Deno

```bash
# Install Vite with Deno
deno install

# Development server (with hot reload)
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview

# Run tests
deno test tests/

# Run specific test file
deno test tests/weather.test.js

# Run tests with coverage
deno test --coverage=coverage tests/

# Watch mode for tests
deno test --watch tests/
```

### Alternative: Using npm, always prefer Deno

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

### Weather Display

- Current weather conditions:
  - Temperature with feels-like
  - Weather conditions with emoji icons
  - Humidity percentage
  - UV index
  - Wind speed
- 3-day forecast with high/low temps, sunrise/sunset times

### Unit Conversion

- Toggle between Imperial (°F, mph) and Metric (°C, km/h)
- Unit preference saved to localStorage
- Live re-render when units change

### User Experience

- Location search with form validation
- Error handling for invalid locations
- Weather condition emoji mapping
- Dark/light mode support via CSS
- Responsive design

## Development Workflow

1. **Start Development Server:**
   ```bash
   deno task dev
   ```
   Opens at `http://localhost:5173`

2. **Make Changes:**
   - Edit files in `src/`
   - Changes hot-reload automatically

3. **Run Tests:**
   ```bash
   deno test tests/
   ```

4. **Build for Production:**
   ```bash
   deno task build
   ```
   Output in `dist/` directory

## Testing

Tests are written for Deno using `@std/assert`:

```javascript
import { assertEquals } from "@std/assert";
import { getCurrentData } from "../src/weather.js";

Deno.test("getCurrentData returns weather object", async () => {
  const data = await getCurrentData("London");
  assertEquals(typeof data.temp, "number");
});
```

Run all tests:

```bash
deno test tests/
```

## Recent Development

Recent commits show active feature development:

- ✅ Add unit change button
- ✅ Add initializer for unit toggle button
- ✅ Add unit conversion and information for the fields
- ✅ Add main.js logic
- ✅ Add form error handling

## Important Notes

### API Usage

The app uses the Visual Crossing Weather API:

- Free tier API key included (public, rate-limited)
- Returns data in Imperial units (Fahrenheit, mph)
- Conversion to Metric handled client-side

### Global State

The application maintains:

- `currentWeatherData` - Cached current weather for re-rendering
- `currentForecastData` - Cached forecast for re-rendering
- `currentUnit` - Current unit system (imperial/metric)

### Weather Emoji Mapping

Weather conditions are mapped to emojis:

```javascript
{
  "clear-day": "☀️",
  "rain": "🌧️",
  "snow": "❄️",
  // ... etc
}
```

### LocalStorage Format

Unit preference is stored as a simple string:

```javascript
localStorage.setItem('unitPreference', 'imperial'); // or 'metric'
```

## Dependencies

**Runtime:** None (vanilla JavaScript)

**Development:**

- vite@7.2.4 - Build tool
  - esbuild - Transpiler
  - rollup - Bundler
  - postcss - CSS processing

**Testing:**

- @std/assert - Deno assertions

**External APIs:**

- Visual Crossing Weather API

## Code Style

- ES6+ JavaScript
- Module imports/exports
- Functional architecture
- Semantic HTML
- CSS custom properties for theming
- No framework dependencies

## Visual Development

### Design Principles

- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for
  guidance

### Quick Visual Check

IMMEDIATELY after implementing any front-end change:

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to
   visit each changed view
3. **Verify design compliance** - Compare against
   `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's
   specific request
5. **Check acceptance criteria** - Review any provided context files or
   requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px)
   of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review

Invoke the `@agent-design-review` subagent for thorough design validation when:

- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing
