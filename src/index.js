import './style.css'; 
const weather=fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}}?key=B5EQMXUEUKGZYBEXWMRKQRW7M&elements=temp,humidity,feelslike`)
.then(function(response){
    return response.json();
})
.then(function(data){
   
})
