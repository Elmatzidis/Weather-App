import { weatherIcons } from "./Icons.js";
import { elementBuilder } from "./Utilitys.js";

// Builds the page skeleton and returns references to every element
export function buildLayout(root, index) {
  const main = elementBuilder("div", "main", root);
  const content = elementBuilder("div", "content", main);

  //TOP PART (Always visible) 
  const topContent = elementBuilder("div", "topContent", content);
  const searchWrapper = elementBuilder("div", "searchBar", topContent);
  elementBuilder("div", "searchIcon", searchWrapper);
  const settings = elementBuilder("div", "settings", topContent);
  const search = elementBuilder("input", "search", searchWrapper);
  search.placeholder = "Search for a location...";

  const translator = elementBuilder(
    "div",
    "google_translate_element",
    topContent,
  );

  const suggestedCities = elementBuilder(
    "div",
    "suggestedCities",
    searchWrapper,
  );
  // Loads until the data are show
  const loading = elementBuilder("div", "loading", content);

  // Here is where all of the data are being placed when the user searches a city
  // Displaying ever info they need to know
  const weatherContainer = elementBuilder("div", "weatherContainer", content);
  weatherContainer.style.display = "none";

  // TOP MID PART
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

  // MID-LOWER
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

  // Settings panel 
  const settingsPanel = elementBuilder("div", "settingsPanel", topContent);
  settingsPanel.style.display = "none";

  const unitRow = elementBuilder("div", "settingRow", settingsPanel);
  elementBuilder("p", "settingLabel", unitRow).textContent = "Temperature";
  const unitButtons = elementBuilder("div", "toggleGroup", unitRow);

  // Celsius button conversion
  const celsiusBtn = elementBuilder("button", "toggleBtn", unitButtons);
  celsiusBtn.type = "button";
  celsiusBtn.textContent = "°C";

   // fahrenheit button conversion
  const fahrenheitBtn = elementBuilder("button", "toggleBtn", unitButtons);
  fahrenheitBtn.type = "button";
  fahrenheitBtn.textContent = "°F";

  // Here we set the desired theme of the page
  const themeRow = elementBuilder("div", "settingRow", settingsPanel);
  elementBuilder("p", "settingLabel", themeRow).textContent = "Theme";
  const themeButtons = elementBuilder("div", "toggleGroup", themeRow);
  const darkBtn = elementBuilder("button", "toggleBtn", themeButtons);
  darkBtn.type = "button";
  darkBtn.textContent = "Dark";
  const lightBtn = elementBuilder("button", "toggleBtn", themeButtons);
  lightBtn.type = "button";
  lightBtn.textContent = "Light";


  // This is the google translator ,as of now it uses 7 languages
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,el,es,fr,de,it,ru",
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element",
    );
  };

  const translatorDiv = document.createElement("div");
  translatorDiv.id = "google_translate_element";
  settingsPanel.appendChild(translatorDiv);

  const transScript = document.createElement("script");
  transScript.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  transScript.async = true;
  document.head.appendChild(transScript);

  // Returning every crucial part of the page 
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
