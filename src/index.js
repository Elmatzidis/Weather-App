import "./style.css";
import clearDay from "./Images/clear-day.svg";
import clearNight from "./Images/clear-night.svg";
import rain from "./Images/rain.svg";
import partlyCloudy from "./Images/partly-cloudy-day.svg";
import cloudy from "./Images/cloudy.svg";
import partlyCloudyNight from "./Images/partly-cloudy-night.svg";
import snow from "./Images/snow.svg";
import moonFirst from "./Images/moon-first-quarter.svg";
import moonLast from "./Images/moon-last-quarter.svg";
import moonNew from "./Images/moon-new.svg";
import moonFull from "./Images/moon-full.svg";
import moonWaningCrescent from "./Images/moon-waning-crescent.svg";
import moonWaningGibbous from "./Images/moon-waning-gibbous.svg";
import moonWaxingCrescent from "./Images/moon-waxing-crescent.svg";
import moonWaxingGibbous from "./Images/moon-waxing-gibbous.svg";
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
  snow: snow,
  "moon-first-quarter": moonFirst,
  "moon-last-quarter": moonLast,
  "moon-new": moonNew,
  "moon-full": moonFull,
  "moon-waning-crescent": moonWaningCrescent,
  "moon-waning-gibbous": moonWaningGibbous,
  "moon-waxing-crescent": moonWaxingCrescent,
  "moon-waxing-gibbous": moonWaxingGibbous,
  "uv-index": uvindex,
  wind: wind,
  pressure: pressure,
  sunrise: sunrise,
  sunset: sunset,
};

// This variable is declared outside so the event listener can see it
let weatherIconEl;

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
  weatherContainer.style.display = "block";

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
  const weekTitle=elementBuilder("h1","weekTitle",weatherContainer)
  // Mid-bottom part of the content
  const bottomContent = elementBuilder("div","bottomContent",weatherContainer,);
  const weekInfo = elementBuilder("div", "weekInfo", bottomContent);


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
        const today = data.days[0];
        const cc = data.currentConditions;
        const condition = cc.icon;
        const currentEpoch = cc.datetimeEpoch;
        const allHours = [...data.days[0].hours, ...data.days[1].hours];

        weekInfo.innerHTML=" ";
        hourlyContent.innerHTML = " ";

        const next12Hours = allHours
          .filter((hourData) => hourData.datetimeEpoch > currentEpoch)
          .slice(0, 12);
        const iconPath = weatherIcons[condition];
        if (weatherIconEl) weatherIconEl.src = iconPath;

        next12Hours.forEach((hourData) => {

          const hourlyCards = elementBuilder(
            "div",
            "hourlyCards",
            hourlyContent,
          );
          const dateObj = new Date(hourData.datetimeEpoch * 1000);
          const formattedTime = dateObj.toLocaleTimeString([], {
            hour: "numeric",
            hour12: true,
          });
          const timeCard = elementBuilder("p", "timeCard", hourlyCards);
          const weatherCard=elementBuilder("img","weatherCard",hourlyCards)
          timeCard.textContent = formattedTime;
          weatherCard.src=weatherIcons[hourData.icon]
        });

        const daysToShow = 7;
const nextDays = data.days.slice(1, daysToShow); // fixed: was cutting off day 6
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

  weekTempMax.textContent = `${Math.round(dayData.tempmax)}°`;
  weekTempMin.textContent = `${Math.round(dayData.tempmin)}°`;
});
        
        const temp = cc.temp;
        const tempmax = today.tempmax;
        const tempmin = today.tempmin;

        const detailedInfo = [
          {
            label: "Chance of rain",
            value: Math.round(today.precipprob) + "%",
            icon: rain,
          },
          {
            label: "Wind",
            value: Math.round(cc.windspeed) + " km/h",
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
            value: Math.round(cc.windgust ?? 0) + " km/h",
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
          const textWrapper = elementBuilder(
            "div",
            "cardTextWrapper",
            weatherCard,
          );
          const labelEl = elementBuilder("p", "cardLabel", textWrapper);
          labelEl.textContent = detail.label;

          const valueEl = elementBuilder("p", "cardValue", textWrapper);
          valueEl.textContent = detail.value;
        });

        dayTemp.textContent = `${temp}°C`;
        dayTempFeels.textContent = `Feels ${cc.feelslike}°C`;

        maxEl.textContent = `↑ ${tempmax}°C`;
        minEl.textContent = `↓ ${tempmin}°C`;

        maxContentText.textContent = "max";
        minContenText.textContent = "min";

        weekTitle.textContent="This week";

        weatherContainer.style.display = "block";

      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }
  });
}
loadPage();