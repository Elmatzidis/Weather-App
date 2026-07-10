// This function builds the element add a class and then appends it to the desired parent we want 
export function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}


// These function convert the untit "mph" or "km/h" of speed and the temperature 
// "°F" or "°C"
let unitSystem = "metric";

export function convertTemp(celsius,unitSystem) {
  return unitSystem === "us"
    ? Math.round((celsius * 9) / 5 + 32)
    : Math.round(celsius);
}
export function tempUnitLabel() {
  return unitSystem === "us" ? "°F" : "°C";
}
export function convertSpeed(kmh,unitSystem) {
  return unitSystem === "us" ? Math.round(kmh * 0.621371) : Math.round(kmh);
}
export function speedUnitLabel() {
  return unitSystem === "us" ? "mph" : "km/h";
}
