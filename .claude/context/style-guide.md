# Odin Weather - Style Guide

A comprehensive design system for the weather application featuring dynamic
weather-based theming and glassmorphism aesthetics.

---

## Color System

### Dynamic Weather Themes

The app background changes based on current weather conditions:

| Weather | Theme Class | Gradient Start | Gradient End | Text Color |
|---------|-------------|----------------|--------------|------------|
| Clear Day | `theme-sunny` | `#FFD93D` | `#6ECCAF` | `#1a1a2e` |
| Clear Night | `theme-night` | `#1a1a2e` | `#4a1942` | `#ffffff` |
| Cloudy | `theme-cloudy` | `#94A3B8` | `#64748B` | `#1e293b` |
| Rainy | `theme-rainy` | `#1E3A5F` | `#3B82F6` | `#ffffff` |
| Snowy | `theme-snowy` | `#E0F2FE` | `#BAE6FD` | `#0c4a6e` |
| Stormy | `theme-stormy` | `#4C1D95` | `#374151` | `#ffffff` |
| Foggy | `theme-foggy` | `#D1D5DB` | `#9CA3AF` | `#1f2937` |

### Glassmorphism Properties

```css
--glass-bg: rgba(255, 255, 255, 0.15);
--glass-bg-dark: rgba(0, 0, 0, 0.15);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-blur: 12px;
```

### Semantic Colors

```css
--color-error: #EF4444;
--color-success: #22C55E;
--color-warning: #F59E0B;
```

---

## Typography

### Font Stack

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, sans-serif;
```

### Scale

| Token | Size | Use Case |
|-------|------|----------|
| `--text-xs` | 12px | Labels, captions |
| `--text-sm` | 14px | Secondary text, metadata |
| `--text-base` | 16px | Body text |
| `--text-lg` | 20px | Subheadings |
| `--text-xl` | 24px | Section headings |
| `--text-2xl` | 32px | Card titles |
| `--text-3xl` | 48px | Hero temperature |
| `--text-4xl` | 64px | Large temperature display |

### Weights

| Token | Weight | Use Case |
|-------|--------|----------|
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Labels, buttons |
| `--font-semibold` | 600 | Subheadings |
| `--font-bold` | 700 | Headings, emphasis |

### Line Heights

```css
--leading-tight: 1.1;    /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

---

## Spacing

Base unit: **4px**

| Token | Value | Use Case |
|-------|-------|----------|
| `--space-xs` | 4px | Tight spacing, icon gaps |
| `--space-sm` | 8px | Inline elements, small gaps |
| `--space-md` | 16px | Default component padding |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Card padding |
| `--space-2xl` | 48px | Section margins |
| `--space-3xl` | 64px | Page sections |

---

## Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-sm` | 8px | Buttons, inputs |
| `--radius-md` | 16px | Cards, containers |
| `--radius-lg` | 24px | Large cards, modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows

### Card Shadows

```css
--shadow-card: 0 8px 32px rgba(0, 0, 0, 0.1);
--shadow-card-hover: 0 12px 40px rgba(0, 0, 0, 0.15);
--shadow-elevated: 0 16px 48px rgba(0, 0, 0, 0.2);
```

---

## Components

### Cards

**Base Card (Glassmorphism)**
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl);
}
```

**Current Weather Card**
- Full width on all viewports
- Larger padding: `--space-2xl`
- Prominent temperature display: `--text-4xl`
- Border radius: `--radius-lg`

**Forecast Card**
- Grid layout: 3 columns on desktop, 1 on mobile
- Standard padding: `--space-lg`
- Compact temperature display: `--text-xl`
- Border radius: `--radius-md`

### Buttons

**Primary Button**
```css
.btn {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

### Form Inputs

```css
.input {
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-base);
  color: inherit;
}

.input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}
```

---

## Skeleton Loading

### Animation

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: var(--radius-sm);
}
```

### Skeleton Variants

| Class | Height | Use Case |
|-------|--------|----------|
| `.skeleton--text` | 16px | Body text placeholder |
| `.skeleton--text-lg` | 24px | Heading placeholder |
| `.skeleton--text-xl` | 48px | Large heading placeholder |
| `.skeleton--icon` | 48px x 48px | Weather icon placeholder |
| `.skeleton--card` | Full height | Card container placeholder |

---

## Layout

### Container

```css
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
  min-height: 100vh;
}
```

### Forecast Grid

```css
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640px - 1024px | 2-column forecast grid |
| Desktop | > 1024px | 3-column forecast grid |

---

## Weather Icon to Theme Mapping

```javascript
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
```

---

## Accessibility

### Color Contrast

- All text must meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large)
- Dark themes use `#ffffff` text
- Light themes use dark text colors appropriate for the background

### Focus States

- All interactive elements must have visible focus indicators
- Use `outline` with `outline-offset` for focus rings
- Focus rings should contrast with both light and dark backgrounds

### Motion

- Respect `prefers-reduced-motion` for skeleton animations
- Keep transitions under 300ms for responsiveness

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
```

---

## Implementation Checklist

- [ ] CSS custom properties defined in `:root`
- [ ] Weather theme classes implemented
- [ ] Glassmorphism card styles applied
- [ ] Skeleton loading states functional
- [ ] Responsive grid layout working
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion preference respected
