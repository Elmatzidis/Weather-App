# Weather App

A JavaScript weather dashboard that shows current conditions, hourly forecasts, and weekly trends for searched or geolocated locations.

## Purpose
This project is built to provide a simple and responsive way to check weather details, compare upcoming days, and quickly search cities with autocomplete support.

## Tech Stack
- JavaScript (ES Modules)
- HTML5
- CSS3
- Webpack 5
- webpack-dev-server
- date-fns

## APIs & Modules Used
- **Visual Crossing Weather API**: forecast and current weather data
- **Geoapify Geocoding API**: city autocomplete suggestions
- **OpenStreetMap Nominatim API**: reverse geocoding from coordinates to city names
- **Browser Geolocation API**: detect user location
- **Project modules**:
  - `/home/runner/work/Weather-App/Weather-App/src/index.js` (app logic, API calls, rendering)
  - `/home/runner/work/Weather-App/Weather-App/src/layout.js` (DOM layout creation)
  - `/home/runner/work/Weather-App/Weather-App/src/Utilitys.js` (unit conversions/utilities)
  - `/home/runner/work/Weather-App/Weather-App/src/Icons.js` (weather icon mapping)

## How to Run
1. Clone the repository:

```bash
git clone https://github.com/Elmatzidis/Weather-App.git
```

2. Move into the project directory:

```bash
cd Weather-App
```

3. Install dependencies:

```bash
npm install
```

4. Start the local development server:

```bash
npm run live
```

5. Build the production bundle:

```bash
npm run build
```

6. (Optional) Deploy the `dist` folder to GitHub Pages:

```bash
npm run deploy
```
