import { weatherIcons } from "./Icons.js";
import { elementBuilder } from "./Utilitys.js";

// Builds the page skeleton and returns references to every element
// script.js needs to touch later (rendering weather, wiring settings, etc).
export function buildLayout(root, index) {
  const main = elementBuilder("div", "main", root);
  const content = elementBuilder("div", "content", main);

  // --- TOP PART (Always visible) ---
  const topContent = elementBuilder("div", "topContent", content);
  const searchWrapper = elementBuilder("div", "searchBar", topContent);
  elementBuilder("div", "searchIcon", searchWrapper);
  const settings = elementBuilder("div", "settings", topContent);
  const search = elementBuilder("input", "search", searchWrapper);
  search.placeholder = "Search for a location...";

  const weatherContainer = elementBuilder("div", "weatherContainer", content);
  weatherContainer.style.display = "BLOCK";

  // Top mid part
  const topMidContent = elementBuilder(
    "div",
    "topMidContent",
    weatherContainer,
  );

  const dayInfo = elementBuilder("div", "dayInfo", topMidContent);
  const dayIcon = elementBuilder("div", "dayIcon", dayInfo);
  const dayTempInfo = elementBuilder("div", "dayTempInfo", dayInfo);
  const dayTemp = elementBuilder("div", "dayTemp", dayTempInfo);
  const dayTempFeels = elementBuilder("div", "dayTempFeels", dayTempInfo);

  const weatherIconEl = elementBuilder("img", "weather-icon", dayIcon);
  const minMaxTemp = elementBuilder("div", "minMaxTemp", topMidContent);

  const maxContent = elementBuilder("div", "maxContent", minMaxTemp);
  const maxContentText = elementBuilder("p", "maxContentText", maxContent);
  const maxEl = elementBuilder("div", "maxTemp", maxContent);

  const minContent = elementBuilder("div", "minContent", minMaxTemp);
  const minContentText = elementBuilder("p", "minContenText", minContent);
  const minEl = elementBuilder("div", "minTemp", minContent);

  // Mid part of the content
  const midContent = elementBuilder("div", "midContent", weatherContainer);
  const weatherInfo = elementBuilder("div", "weatherInfo", midContent);
  const hourlyText = elementBuilder("h1", "hourlyText", weatherContainer);
  hourlyText.textContent = "Hourly Forecast";

  // Mid-lower part of the content
  const lowerMidContent = elementBuilder(
    "div",
    "lowerMidContent",
    weatherContainer,
  );
  const hourlyInfo = elementBuilder("div", "hourlyInfo", lowerMidContent);
  const hourlyContent = elementBuilder("div", "hourlyContent", hourlyInfo);

  const weekTitle = elementBuilder("h1", "weekTitle", weatherContainer);
  const bottomContent = elementBuilder(
    "div",
    "bottomContent",
    weatherContainer,
  );
  const weekInfo = elementBuilder("div", "weekInfo", bottomContent);

  // --- Settings panel ---
  const settingsPanel = elementBuilder("div", "settingsPanel", topContent);
  settingsPanel.style.display = "none";

  const unitRow = elementBuilder("div", "settingRow", settingsPanel);
  elementBuilder("p", "settingLabel", unitRow).textContent = "Temperature";
  const unitButtons = elementBuilder("div", "toggleGroup", unitRow);
  const celsiusBtn = elementBuilder("button", "toggleBtn", unitButtons);
  celsiusBtn.type = "button";
  celsiusBtn.textContent = "°C";
  const fahrenheitBtn = elementBuilder("button", "toggleBtn", unitButtons);
  fahrenheitBtn.type = "button";
  fahrenheitBtn.textContent = "°F";

  const themeRow = elementBuilder("div", "settingRow", settingsPanel);
  elementBuilder("p", "settingLabel", themeRow).textContent = "Theme";
  const themeButtons = elementBuilder("div", "toggleGroup", themeRow);
  const darkBtn = elementBuilder("button", "toggleBtn", themeButtons);
  darkBtn.type = "button";
  darkBtn.textContent = "Dark";
  const lightBtn = elementBuilder("button", "toggleBtn", themeButtons);
  lightBtn.type = "button";
  lightBtn.textContent = "Light";

  return {
    search,
    settings,
    settingsPanel,
    weatherContainer,
    weatherIconEl,
    dayTemp,
    dayTempFeels,
    maxContentText,
    maxEl,
    minContentText,
    minEl,
    weatherInfo,
    hourlyContent,
    weekTitle,
    weekInfo,
    celsiusBtn,
    fahrenheitBtn,
    darkBtn,
    lightBtn,
  };
}


