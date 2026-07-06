// --- Unit conversion state ---
export let unitSystem = "metric"; // "metric" (°C, km/h) or "us" (°F, mph)


export function convertTemp(celsius) {
  return unitSystem === "us"
    ? Math.round((celsius * 9) / 5 + 32)
    : Math.round(celsius);
}
export function tempUnitLabel() {
  return unitSystem === "us" ? "°F" : "°C";
}
export function convertSpeed(kmh) {
  return unitSystem === "us" ? Math.round(kmh * 0.621371) : Math.round(kmh);
}
export function speedUnitLabel() {
  return unitSystem === "us" ? "mph" : "km/h";
}

 export function setUnit(unit) {
    unitSystem = unit;
    celsiusBtn.classList.toggle("active", unit === "metric");
    fahrenheitBtn.classList.toggle("active", unit === "us");
    if (currentWeatherData) renderWeather(currentWeatherData);
  }