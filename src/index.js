import "./style.css";

export function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}

export function loadPage() {
  // This is where the app is placed in
  const main = elementBuilder("div", "main", document.body);
  const content = elementBuilder("div", "content", main);

  // Top part of the content is displayed here
  const topContent = elementBuilder("div", "topContent", content);
  const searchWrapper = elementBuilder("div", "searchBar", topContent);
  // 2. Add the icon to the wrapper
  const searchImage = elementBuilder("div", "searchIcon", searchWrapper);

  // 3. Add the input to the wrapper

  const search = elementBuilder("input", "search", searchWrapper);
  search.placeholder = "Search for a location...";

  const settings = elementBuilder("div", "settings", topContent);

  // Top-mid part of the content is displayed here
  const topMidContent = elementBuilder("div", "topMidContent", content);
  const generalInfo = elementBuilder("div", "generalInfo", topMidContent);

  // Mid part of the content is displayed here
  const midContent = elementBuilder("div", "midContent", content);
  const weatherInfo = elementBuilder("div", "weatherInfo", midContent);

  // Mid-lower part of the content is displayed here
  const lowerMidContent = elementBuilder("div", "lowerMidContent", content);
  const hourlyInfo = elementBuilder("div", "hourlyInfo", lowerMidContent);

  // Mid-bottom part of the content is displayed here
  const bottomContent = elementBuilder("div", "bottomContent", content);
  const weekInfo = elementBuilder("div", "weekInfo", bottomContent);

  search.textContent = "Type";
}

// const weather=fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Thessaloniki}?key=B5EQMXUEUKGZYBEXWMRKQRW7M&elements=temp,humidity,feelslike`)
// .then(function(response){
//     return response.json();
// })
// .then(function(data){
//    return data.json
// })

loadPage();
