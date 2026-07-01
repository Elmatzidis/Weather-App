import './style.css'; 

function elementBuilder(type, className, parent) {
  const element = document.createElement(type);
  if (className) element.classList.add(className);
  if (parent) parent.appendChild(element);
  return element;
}

export function loadPage(){

    const main=elementBuilder("div","main",document.body)
    const content=elementBuilder("div","content",main)    
    const search=elementBuilder("submit","search",content)
    const generalInfo=elementBuilder("div","generalInfo",content)
    const weatherInfo=elementBuilder("div","weatherInfo",content)
    const hourlyInfo=elementBuilder("div","hourlyInfo",content)
    const weekInfo=elementBuilder("div","weekInfo",content)

    

}


// const weather=fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Thessaloniki}?key=B5EQMXUEUKGZYBEXWMRKQRW7M&elements=temp,humidity,feelslike`)
// .then(function(response){
//     return response.json();
// })
// .then(function(data){
//    return data.json
// })

loadPage()