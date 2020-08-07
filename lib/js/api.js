let weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=cc35d4d247449fbc0ef0a693e2d28e56&"
let apiLat = "lat=";
let apiLon = "&lon=";
let geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyC8BbmVXcy2MsI0ECfOrj1XkvIBqyp3-4E&latlng=";
let latlng = "40.714224,-73.961452";
let lat = 40.714224;
let lon = -73.961452;
let comma = ",";
let crimeAPIKey = "eTTNgvc5gR7S4JKzmPevEaFFvudBKD6HajzwSmx4";
let crimeAPITestKey = "k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG";
let crimeAPIURL = "https://api.crimeometer.com/v1/incidents/raw-data?distance=10mi&datetime_ini=2020-07-28T01:00:00:00.000Z&datetime_end=2020-08-01T01:00:00:00.000Z&"
// Geocode API Call
fetch(geocodeURL + latlng)
.then(function(response) {
    return response.json();
})
.then(function(geoJSON) {

console.log(geoJSON);
})

// Weather API Call
let weatherAPI = weatherURL + apiLat + lat + apiLon + lon;
  fetch(weatherAPI)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    console.log(data);
  })
  let crimeAPI = crimeAPIURL + apiLat + lat + apiLon + lon;
  fetch(crimeAPI)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    console.log(data);
  })
