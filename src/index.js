import "./style.css";
import { weatherIcons } from "./Icons.js";
import {
  elementBuilder,
  convertSpeed,
  convertTemp,
  tempUnitLabel,
  speedUnitLabel,
} from "./Utilitys.js";
import { buildLayout } from "./layout.js";

// --- Unit conversion state ---
let unitSystem = "metric"; // "metric" (°C, km/h) or "us" (°F, mph)
let currentWeatherData = null;

export function loadPage() {
  const dom = buildLayout(document.body);

  // Renders all weather data into the DOM. Called on fetch, and again
  // whenever the unit toggle changes (using the last-fetched data).
  function renderWeather(data, dayIndex = 0) {
    const today = data.days[0];
    const isToday = dayIndex === 0;
    const dayData = data.days[dayIndex];
    const cc = isToday ? data.currentConditions : dayData;
    const currentEpoch = isToday ? cc.datetimeEpoch : dayData.datetimeEpoch;

    let hoursToShow;
    if (isToday) {
      const allHours = [...data.days[0].hours, ...data.days[1].hours];
      hoursToShow = allHours
        .filter((hourData) => hourData.datetimeEpoch > currentEpoch)
        .slice(0, 12);
    } else {
      hoursToShow = dayData.hours.slice(0, 12);
    }

    dom.weekInfo.innerHTML = "";
    dom.hourlyContent.innerHTML = "";

    if (dom.weatherIconEl) dom.weatherIconEl.src = weatherIcons[cc.icon];

    hoursToShow.forEach((hourData) => {
      const hourlyCards = elementBuilder(
        "div",
        "hourlyCards",
        dom.hourlyContent,
      );
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
    const nextDays = data.days.slice(0, daysToShow);
    nextDays.forEach((dayData, index) => {
      const indexOf = index;
      const date = new Date(dayData.datetime + "T00:00:00");
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      const weekCard = elementBuilder("div", "weekCard", dom.weekInfo);
      weekCard.addEventListener("click", (e) => {
        currentWeatherData = data;
        renderWeather(data, indexOf);
      });
      if (indexOf === dayIndex) weekCard.classList.add("today");

      const todayLabel = elementBuilder("p", "todayLabel", weekCard);
      todayLabel.textContent = indexOf === 0 ? "Today" : "";
      const weekDay = elementBuilder("p", "weekDay", weekCard);
      weekDay.textContent = dayName;

      const weekIcon = elementBuilder("img", "weekIcon", weekCard);
      weekIcon.src = weatherIcons[dayData.icon];

      const weekTemp = elementBuilder("div", "weekTemp", weekCard);
      const weekTempMax = elementBuilder("span", "weekTempMax", weekTemp);
      const weekTempMin = elementBuilder("span", "weekTempMin", weekTemp);

      weekTempMax.textContent = `${convertTemp(dayData.tempmax, unitSystem)}°`;
      weekTempMin.textContent = `${convertTemp(dayData.tempmin, unitSystem)}°`;
    });

    const detailedInfo = [
      {
        label: "Chance of rain",
        value: Math.round(today.precipprob) + "%",
        icon: weatherIcons.rain,
      },
      {
        label: "Wind",
        value: convertSpeed(cc.windspeed, unitSystem) + " " + speedUnitLabel(),
        icon: weatherIcons.wind,
      },
      { label: "Sunrise", value: cc.sunrise, icon: weatherIcons.sunrise },
      { label: "Sunset", value: cc.sunset, icon: weatherIcons.sunset },
      { label: "UV Index", value: cc.uvindex, icon: weatherIcons.uvindex },
      {
        label: "Pressure",
        value: Math.round(cc.pressure) + " mb",
        icon: weatherIcons.pressure,
      },
      {
        label: "Humidity",
        value: Math.round(cc.humidity) + "%",
        icon: weatherIcons.humidity,
      },
      {
        label: "Gusts",
        value:
          convertSpeed(cc.windgust ?? 0, unitSystem) + " " + speedUnitLabel(),
        icon: weatherIcons.wind,
      },
    ];

    // Clear old cards before rendering new ones
    dom.weatherInfo.innerHTML = "";

    detailedInfo.forEach((detail) => {
      const weatherCard = elementBuilder("div", "weatherCard", dom.weatherInfo);

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

    dom.dayTemp.textContent = `${convertTemp(cc.temp, unitSystem)}${tempUnitLabel()}`;
    dom.dayTempFeels.textContent = `Feels ${convertTemp(cc.feelslike, unitSystem)}${tempUnitLabel()}`;

    dom.maxEl.textContent = `↑ ${convertTemp(today.tempmax, unitSystem)}${tempUnitLabel()}`;
    dom.minEl.textContent = `↓ ${convertTemp(today.tempmin, unitSystem)}${tempUnitLabel()}`;

    dom.maxContentText.textContent = "max";
    dom.minContentText.textContent = "min";

    dom.weekTitle.textContent = "This week...";

    dom.weatherContainer.style.display = "block";
  }

  // --- Settings panel ---
  dom.settings.addEventListener("click", () => {
    dom.settingsPanel.style.display =
      dom.settingsPanel.style.display === "none" ? "flex" : "none";
  });

  // Close the settings panel when clicking outside it
  document.addEventListener("click", (e) => {
    if (
      dom.settingsPanel.style.display !== "none" &&
      !dom.settingsPanel.contains(e.target) &&
      e.target !== dom.settings
    ) {
      dom.settingsPanel.style.display = "none";
    }
  });

  function setUnit(unit) {
    unitSystem = unit;
    dom.celsiusBtn.classList.toggle("active", unit === "metric");
    dom.fahrenheitBtn.classList.toggle("active", unit === "us");
    if (currentWeatherData) renderWeather(currentWeatherData);
  }
  dom.celsiusBtn.addEventListener("click", () => setUnit("metric"));
  dom.fahrenheitBtn.addEventListener("click", () => setUnit("us"));
  setUnit("metric");

  function setTheme(t) {
    dom.darkBtn.classList.toggle("active", t === "dark");
    dom.lightBtn.classList.toggle("active", t === "light");
    document.body.setAttribute("data-theme", t);
  }
  dom.darkBtn.addEventListener("click", () => setTheme("dark"));
  dom.lightBtn.addEventListener("click", () => setTheme("light"));
  setTheme("dark");

  // 1. Define the function FIRST
  // --- Fetching Logic ---
  // --- Fetching Logic ---

  function getUserLocation() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      fetchDefaultCityWeather();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        fetchDefaultCityWeather(); // user denied permission, timeout, etc.
      },
      {
        enableHighAccuracy: false, 
        timeout: 3000, 
      },
    );
  }

  async function reverseGeocode(lat, lon) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    );
    if (!response.ok) throw new Error("Reverse geocoding failed");
    const data = await response.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county ||
      "Unknown location"
    );
  }

  async function fetchWeatherByCoordinates(lat, lon) {
    const APIKey = "B5EQMXUEUKGZYBEXWMRKQRW7M";
    try {
      const [weatherResponse, cityName] = await Promise.all([
        fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${APIKey}&elements=temp,humidity,hours,datetime,datetimeEpoch,feelslike,precip,icon,tempmax,tempmin,windspeed,windgust,snow,pressure,sunrise,sunset,uvindex,precipprob,moonphase`,
        ),
        reverseGeocode(lat, lon).catch(() => null), 
      ]);

      if (!weatherResponse.ok) throw new Error("Location weather not found");

      const data = await weatherResponse.json();
      currentWeatherData = data;
      renderWeather(data);

      dom.search.value = cityName || data.resolvedAddress;
    } catch (error) {
      console.error("Coordinate fetch failed:", error);
      fetchDefaultCityWeather(); 
    }
  }

  async function fetchDefaultCityWeather(city = "Thessaloniki") {
    const APIKey = "B5EQMXUEUKGZYBEXWMRKQRW7M";
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${APIKey}&elements=temp,humidity,hours,datetime,datetimeEpoch,feelslike,precip,icon,tempmax,tempmin,windspeed,windgust,snow,pressure,sunrise,sunset,uvindex,precipprob,moonphase`,
      );

      if (!response.ok)
        throw new Error(`City not found (status ${response.status})`);

      const data = await response.json();
      currentWeatherData = data;
      renderWeather(data);
      dom.search.value = city;
    } catch (error) {
      console.error("Something went wrong:", error);
      alert(error.message);
    }
  }

  dom.search.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = dom.search.value.trim();
      if (city) fetchDefaultCityWeather(city);
    }
  });

  getUserLocation();
}
loadPage();
