import "./style.css";
import clearDay from "./Images/clear-day.svg";
import clearNight from "./Images/clear-night.svg";
import rain from "./Images/rain.svg";
import partlyCloudy from "./Images/partly-cloudy-day.svg";
import cloudy from "./Images/cloudy.svg";
import partlyCloudyNight from "./Images/partly-cloudy-night.svg";
import uvindex from "./Images/uv-index.svg";
import wind from "./Images/wind.svg";
import pressure from "./Images/pressure-high.svg";
import sunrise from "./Images/sunrise.svg";
import sunset from "./Images/sunset.svg";
import humidity from "./Images/humidity.svg";

// Creates element, adds a classname, and appends it to the parent
export function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}

export const weatherIcons = {
  "clear-day": clearDay,
  "clear-night": clearNight,
  rain: rain,
  "partly-cloudy-day": partlyCloudy,
  cloudy: cloudy,
  "partly-cloudy-night": partlyCloudyNight,
  "uv-index": uvindex,
  wind: wind,
  pressure: pressure,
  sunrise: sunrise,
  sunset: sunset,
};

// This variable is declared outside so the event listener can see it
let weatherIconEl;

// --- Unit conversion state ---
let unitSystem = "metric"; // "metric" (°C, km/h) or "us" (°F, mph)
let currentWeatherData = null;

function convertTemp(celsius) {
  return unitSystem === "us"
    ? Math.round((celsius * 9) / 5 + 32)
    : Math.round(celsius);
}
function tempUnitLabel() {
  return unitSystem === "us" ? "°F" : "°C";
}
function convertSpeed(kmh) {
  return unitSystem === "us" ? Math.round(kmh * 0.621371) : Math.round(kmh);
}
function speedUnitLabel() {
  return unitSystem === "us" ? "mph" : "km/h";
}

export function loadPage() {
  // This is where the app is placed in
  const main = elementBuilder("div", "main", document.body);
  const content = elementBuilder("div", "content", main);

  // --- TOP PART (Always visible) ---
  const topContent = elementBuilder("div", "topContent", content);
  const searchWrapper = elementBuilder("div", "searchBar", topContent);
  const searchIcon = elementBuilder("div", "searchIcon", searchWrapper);
  const settings = elementBuilder("div", "settings", topContent);
  const search = elementBuilder("input", "search", searchWrapper);
  search.placeholder = "Search for a location...";

  const weatherContainer = elementBuilder("div", "weatherContainer", content);
  weatherContainer.style.display = "none";

  // Top mid part
  const topMidContent = elementBuilder("div","topMidContent",weatherContainer);

  const dayInfo = elementBuilder("div", "dayInfo", topMidContent);
  const dayIcon = elementBuilder("div", "dayIcon", dayInfo);
  const dayTempInfo = elementBuilder("div", "dayTempInfo", dayInfo);
  const dayTemp = elementBuilder("div", "dayTemp", dayTempInfo);
  const dayTempFeels = elementBuilder("div", "dayTempFeels", dayTempInfo);

  weatherIconEl = elementBuilder("img", "weather-icon", dayIcon);
  const minMaxTemp = elementBuilder("div", "minMaxTemp", topMidContent);

  const maxContent = elementBuilder("div", "maxContent", minMaxTemp);
  const maxContentText = elementBuilder("p", "maxContentText", maxContent);
  const maxEl = elementBuilder("div", "maxTemp", maxContent);

  const minConten = elementBuilder("div", "minContent", minMaxTemp);
  const minContenText = elementBuilder("p", "minContenText", minConten);
  const minEl = elementBuilder("div", "minTemp", minConten);

  // Mid part of the content
  const midContent = elementBuilder("div", "midContent", weatherContainer);
  const weatherInfo = elementBuilder("div", "weatherInfo", midContent);
  const hourlyText = elementBuilder("h1", "hourlyText", weatherContainer);
  // Mid-lower part of the content
  const lowerMidContent = elementBuilder(
    "div",
    "lowerMidContent",
    weatherContainer,
  );
  const hourlyInfo = elementBuilder("div", "hourlyInfo", lowerMidContent);

  hourlyText.textContent = "Hourly Forecast";
  const hourlyContent = elementBuilder("div", "hourlyContent", hourlyInfo);
  const weekTitle = elementBuilder("h1", "weekTitle", weatherContainer);
  const bottomContent = elementBuilder("div","bottomContent",weatherContainer);
  const weekInfo = elementBuilder("div", "weekInfo", bottomContent);

  // Renders all weather data into the DOM. Called on fetch, and again
  // whenever the unit toggle changes (using the last-fetched data).
  // NOTE: this must be defined after every DOM element it references above
  // (weatherContainer, dayTemp, weekInfo, etc.) has already been declared,
  // since referencing a `const` that hasn't run its declaration line yet
  // throws a ReferenceError, even from inside a function body.
  function renderWeather(data) {
    const today = data.days[0];
    const cc = data.currentConditions;
    const currentEpoch = cc.datetimeEpoch;
    const allHours = [...data.days[0].hours, ...data.days[1].hours];

    weekInfo.innerHTML = "";
    hourlyContent.innerHTML = "";

    const next12Hours = allHours
      .filter((hourData) => hourData.datetimeEpoch > currentEpoch)
      .slice(0, 12);

    if (weatherIconEl) weatherIconEl.src = weatherIcons[cc.icon];

    next12Hours.forEach((hourData) => {
      const hourlyCards = elementBuilder("div", "hourlyCards", hourlyContent);
      const dateObj = new Date(hourData.datetimeEpoch * 1000);
      const formattedTime = dateObj.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true,
      });
      const timeCard = elementBuilder("p", "timeCard", hourlyCards);
      const weatherCard = elementBuilder("img", "weatherCard", hourlyCards);
      timeCard.textContent = formattedTime;
      weatherCard.src = weatherIcons[hourData.icon];
    });

    const daysToShow = 7;
    const nextDays = data.days.slice(1, daysToShow);
    nextDays.forEach((dayData, index) => {
      const date = new Date(dayData.datetime + "T00:00:00");
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const isToday = index === 0;

      const weekCard = elementBuilder("div", "weekCard", weekInfo);
      if (isToday) weekCard.classList.add("today");

      const todayLabel = elementBuilder("p", "todayLabel", weekCard);
      todayLabel.textContent = isToday ? "Today" : "";

      const weekDay = elementBuilder("p", "weekDay", weekCard);
      weekDay.textContent = dayName;

      const weekIcon = elementBuilder("img", "weekIcon", weekCard);
      weekIcon.src = weatherIcons[dayData.icon];

      const weekTemp = elementBuilder("div", "weekTemp", weekCard);
      const weekTempMax = elementBuilder("span", "weekTempMax", weekTemp);
      const weekTempMin = elementBuilder("span", "weekTempMin", weekTemp);

      weekTempMax.textContent = `${convertTemp(dayData.tempmax)}°`;
      weekTempMin.textContent = `${convertTemp(dayData.tempmin)}°`;
    });

    const detailedInfo = [
      {
        label: "Chance of rain",
        value: Math.round(today.precipprob) + "%",
        icon: rain,
      },
      {
        label: "Wind",
        value: convertSpeed(cc.windspeed) + " " + speedUnitLabel(),
        icon: wind,
      },
      { label: "Sunrise", value: cc.sunrise, icon: sunrise },
      { label: "Sunset", value: cc.sunset, icon: sunset },
      { label: "UV Index", value: cc.uvindex, icon: uvindex },
      {
        label: "Pressure",
        value: Math.round(cc.pressure) + " mb",
        icon: pressure,
      },
      {
        label: "Humidity",
        value: Math.round(cc.humidity) + "%",
        icon: humidity,
      },
      {
        label: "Gusts",
        value: convertSpeed(cc.windgust ?? 0) + " " + speedUnitLabel(),
        icon: wind,
      },
    ];

    // Clear old cards before rendering new ones
    weatherInfo.innerHTML = "";

    detailedInfo.forEach((detail) => {
      const weatherCard = elementBuilder("div", "weatherCard", weatherInfo);

      const iconWrapper = elementBuilder("div", "cardIcon", weatherCard);
      const iconImg = elementBuilder("img", "cardIconImg", iconWrapper);
      iconImg.src = detail.icon;
      iconImg.alt = detail.label;
      const textWrapper = elementBuilder("div", "cardTextWrapper", weatherCard);
      const labelEl = elementBuilder("p", "cardLabel", textWrapper);
      labelEl.textContent = detail.label;

      const valueEl = elementBuilder("p", "cardValue", textWrapper);
      valueEl.textContent = detail.value;
    });

    dayTemp.textContent = `${convertTemp(cc.temp)}${tempUnitLabel()}`;
    dayTempFeels.textContent = `Feels ${convertTemp(cc.feelslike)}${tempUnitLabel()}`;

    maxEl.textContent = `↑ ${convertTemp(today.tempmax)}${tempUnitLabel()}`;
    minEl.textContent = `↓ ${convertTemp(today.tempmin)}${tempUnitLabel()}`;

    maxContentText.textContent = "max";
    minContenText.textContent = "min";

    weekTitle.textContent = "This week...";

    weatherContainer.style.display = "block";
  }

  // --- Settings panel ---
  // Defined after renderWeather (and everything it touches) already exists,
  // so setUnit/setTheme can safely call renderWeather without hitting a
  // "before initialization" error.
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

  settings.addEventListener("click", () => {
    settingsPanel.style.display =
      settingsPanel.style.display === "none" ? "flex" : "none";
  });

  // Close the settings panel when clicking outside it
  document.addEventListener("click", (e) => {
    if (
      settingsPanel.style.display !== "none" &&
      !settingsPanel.contains(e.target) &&
      e.target !== settings
    ) {
      settingsPanel.style.display = "none";
    }
  });

  function setUnit(unit) {
    unitSystem = unit;
    celsiusBtn.classList.toggle("active", unit === "metric");
    fahrenheitBtn.classList.toggle("active", unit === "us");
    if (currentWeatherData) renderWeather(currentWeatherData);
  }
  celsiusBtn.addEventListener("click", () => setUnit("metric"));
  fahrenheitBtn.addEventListener("click", () => setUnit("us"));
  setUnit("metric");

  function setTheme(t) {
    darkBtn.classList.toggle("active", t === "dark");
    lightBtn.classList.toggle("active", t === "light");
    document.body.setAttribute("data-theme", t);
  }
  darkBtn.addEventListener("click", () => setTheme("dark"));
  lightBtn.addEventListener("click", () => setTheme("light"));
  setTheme("dark");

  // Searches the city which the user want to get the info from
  search.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const city = search.value.trim();
      if (!city) return;
      const APIKey = "B5EQMXUEUKGZYBEXWMRKQRW7M";

      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${APIKey}&elements=temp,humidity,hours,datetime,datetimeEpoch,feelslike,precip,icon,tempmax,tempmin,windspeed,windgust,snow,pressure,sunrise,sunset,uvindex,precipprob,moonphase`,
        );

        if (!response.ok) {
          throw new Error(`City not found (status ${response.status})`);
        }

        const data = await response.json();
        currentWeatherData = data;
        renderWeather(data);
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }
  });
}
loadPage();
