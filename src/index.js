import "./style.css";
import clearDay from "./Images/clear-day.svg";
import clearNight from "./Images/clear-night.svg";
import rain from "./Images/rain.svg";
import partlyCloudy from "./Images/partly-cloudy-day.svg";
import cloudy from "./Images/cloudy.svg";
import partlyCloudyNight from "./Images/partly-cloudy-night.svg";

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
};

// Converts Fahrenheit to Celsius
export function ConvertToCelsius(fahrenheit) {
  return (((fahrenheit - 32) * 5) / 9).toFixed(1);
}

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
  const dayTemp = elementBuilder("div", "dayTemp", dayInfo);
  const dayTempText = elementBuilder("div", "dayTempText", dayTemp);

  weatherIconEl = elementBuilder("img", "weather-icon", dayIcon);
  const minMaxTemp = elementBuilder("div", "minMaxTemp", topMidContent);

  const maxContent = elementBuilder("div", "maxContent", minMaxTemp);
  const maxContentText = elementBuilder("p", "maxContentText", maxContent);
  const maxEl = elementBuilder("div", "maxTemp", maxContent);

  const minConten = elementBuilder("div", "minConten", minMaxTemp);
  const minContenText = elementBuilder("p", "minContenText", minConten);
  const minEl = elementBuilder("div", "minTemp", minConten);

  // Mid part of the content
  const midContent = elementBuilder("div", "midContent", weatherContainer);
  const weatherInfo = elementBuilder("div", "weatherInfo", midContent);

  // Mid-lower part of the content
  const lowerMidContent = elementBuilder(
    "div",
    "lowerMidContent",
    weatherContainer,
  );
  const hourlyInfo = elementBuilder("div", "hourlyInfo", lowerMidContent);

  // Mid-bottom part of the content
  const bottomContent = elementBuilder(
    "div",
    "bottomContent",
    weatherContainer,
  );
  const weekInfo = elementBuilder("div", "weekInfo", bottomContent);

  // Searches the city which the user want to get the info from
  search.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const city = search.value;
      const APIKey = "B5EQMXUEUKGZYBEXWMRKQRW7M";

      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?key=${APIKey}&elements=temp,humidity,feelslike,precip,icon,tempmax,tempmin`,
        );
        const data = await response.json();
        const today = data.days[0];
        const { temp, feelslike, precip, humidity, icon, tempmax, tempmin } =
          data.currentConditions;
        const condition = data.currentConditions.icon;

        const tempC = ConvertToCelsius(temp);
        const feelslikeC = ConvertToCelsius(feelslike);
        const maxTempC = ConvertToCelsius(today.tempmax);
        const minTempC = ConvertToCelsius(today.tempmin);

        // Update the icon source
        const iconPath = weatherIcons[condition];
        console.log("Path found in object:", iconPath);

        if (weatherIconEl) {
          weatherIconEl.src = iconPath;
        }

        dayTemp.textContent = `${tempC}°C`;
        maxEl.textContent = `↑ ${maxTempC}°C `;
        minEl.textContent = `↓ ${minTempC}°C `;
        maxContentText.textContent = "max";
        minContenText.textContent = "min";

        console.log(
          `Weather: ${condition}, Temp: ${tempC}°C, Min/Max: ${minTempC}/${maxTempC}`,
        );

        // Once the data is successfully fetched and populated, show the container
        weatherContainer.style.display = "block"; // Change to "flex" if your CSS requires it
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    }
  });
}

loadPage();
