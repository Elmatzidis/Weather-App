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
const APIKey = "B5EQMXUEUKGZYBEXWMRKQRW7M";

// Loads the whole page
export function loadPage() {
  const dom = buildLayout(document.body);
  const loading = document.querySelector(".loading");
  const weatherContainer = document.querySelector(".weatherContainer"); //The data render here
  const suggestedCities = document.querySelector(".suggestedCities");
  loading.style.display = "none";

  // Renders all weather data into the DOM. Called on fetch, and again
  // whenever the unit toggle changes (using the last-fetched data).
  function renderWeather(data, dayIndex = 0) {
    const today = data.days[0];
    const isToday = dayIndex === 0;
    const dayData = data.days[dayIndex];
    const cc = isToday ? data.currentConditions : dayData;
    const currentEpoch = isToday ? cc.datetimeEpoch : dayData.datetimeEpoch;

    // We get both today/tomorrows hours (48) ,then we filter which hours have passed
    // and sellect the next 12
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

    // Here we show the 12 hours that are being selected and then displayed in the DOM
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

    // We get the next days (counting todays) and display the data that corespond to that date
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

      // This is where each day of the week is being dispalyed
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

    // The info here are from the mid part of the page where we display the most "important"
    // information of the page
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

    // We loop through each info from above and dispaly each info to the coresponding place
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

  // Here we set the unti that we want to see
  function setUnit(unit) {
    unitSystem = unit;
    dom.celsiusBtn.classList.toggle("active", unit === "metric");
    dom.fahrenheitBtn.classList.toggle("active", unit === "us");
    if (currentWeatherData) renderWeather(currentWeatherData);
  }
  dom.celsiusBtn.addEventListener("click", () => setUnit("metric"));
  dom.fahrenheitBtn.addEventListener("click", () => setUnit("us"));
  setUnit("metric");

  // Here we set the theme that we like
  function setTheme(t) {
    dom.darkBtn.classList.toggle("active", t === "dark");
    dom.lightBtn.classList.toggle("active", t === "light");
    document.body.setAttribute("data-theme", t);
  }
  dom.darkBtn.addEventListener("click", () => setTheme("dark"));
  dom.lightBtn.addEventListener("click", () => setTheme("light"));
  setTheme("dark");

  // Pops up a window from the browser asking the user to track his location
  // if users accepts the user can see his current location in the app
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

  // Renders the data based on the user input
  async function fetchAndRenderWeather(query, displayName) {
    loading.style.display = "block";
    weatherContainer.style.display = "none";
    try {
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${APIKey}&elements=temp,humidity,hours,datetime,datetimeEpoch,feelslike,precip,icon,tempmax,tempmin,windspeed,windgust,snow,pressure,sunrise,sunset,uvindex,precipprob,moonphase`,
      );
      if (!response.ok) throw new Error("Weather not found");
      const data = await response.json();

      setTimeout(() => {
        console.log(dom.search.textContent);
        loading.style.display = "none";
        currentWeatherData = data;
        renderWeather(data);
        dom.search.value = displayName || data.resolvedAddress;
        weatherContainer.classList.add("visible");
      }, 500);
    } catch (error) {
      loading.style.display = "none";
      console.error("Weather fetch failed:", error);
      if (query !== "Thessaloniki") fetchAndRenderWeather("Thessaloniki");
      else alert(error.message);
    }
  }

  function fetchWeatherByCoordinates(lat, lon) {
    reverseGeocode(lat, lon)
      .catch(() => null)
      .then((cityName) => fetchAndRenderWeather(`${lat},${lon}`, cityName));
  }

  function fetchDefaultCityWeather(city = "Thessaloniki") {
    fetchAndRenderWeather(encodeURIComponent(city), city);
  }

  // This is the function that suggets cities according the user for instance
  // if we type Lon we get cities starting with "Lon"
  async function getSuggestedCities(query) {
    const APIKey = "29559a2d4b704fa1abd5f86540c03fd3";
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=json&apiKey=${APIKey}&limit=5&lang=en`,
      );
      if (!response.ok) throw new Error("Failed to fetch suggested cities");
      const data = await response.json();
      suggestedCities.innerHTML = "";
      data.results.forEach((city) => {
        const cityCard = elementBuilder(
          "div",
          "suggestion-item",
          suggestedCities,
        );
        // These are some data we want to know for the suggestion function in detail 
        const primaryName =
          city.city ||
          city.municipality ||
          city.district ||
          city.county ||
          city.suburb ||
          city.town ||
          city.village ||
          city.name ||
          city.address_line1 ||
          "Unknown Location";

        cityCard.textContent = `${primaryName}${city.country ? `, ${city.country}` : ""}`;
        // Loops through the suggested cities
        cityCard.addEventListener("click", (e) => {
          e.stopPropagation();
          suggestedCities.innerHTML = "";
          suggestedCities.style.display = "none";
          dom.search.value = `${primaryName}${city.country ? `, ${city.country}` : ""}`;
          fetchWeatherByCoordinates(city.lat, city.lon);
        });
      });
    } catch (error) {
      console.error("Error fetching suggested cities:", error);
    }
  }

  // This where the users enter the city they want to search
  let currentTime;
  dom.search.addEventListener("input", (e) => {
    const city = e.target.value.trim();
    clearTimeout(currentTime);
    suggestedCities.style.display = "block";

    if (city.length <= 2) {
      suggestedCities.innerHTML = " ";
      suggestedCities.style.display = "none";
      return;
    }

    currentTime = setTimeout(() => {
      getSuggestedCities(city);
    }, 400);
  });
  // This where the users enter the city they want to search

  dom.search.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = dom.search.value.trim();
      if (city) {
        suggestedCities.style.display = "none";
        fetchDefaultCityWeather(city);
      }
    }
  });

  getUserLocation();
}
loadPage();
