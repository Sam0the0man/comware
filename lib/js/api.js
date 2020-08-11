// Dates
let date = new Date();
let aWeekAgo = new Date(new Date().setDate(date.getDate() - 7));

let today = {
  year: String(date.getFullYear()),
  month: String(date.getMonth() + 1).padStart(2, '0'),
  day: String(date.getDate()).padStart(2, '0'),
  hour: String(date.getHours()).padStart(2, '0'),
  minutes: String(date.getMinutes()).padStart(2, '0'),
  seconds: String(date.getSeconds()).padStart(2, '0'),
  milliseconds: String(date.getMilliseconds()).padEnd(3, '0')
}
let lastWeek = {
  year: String(aWeekAgo.getFullYear()),
  month: String(aWeekAgo.getMonth() + 1).padStart(2, '0'),
  day: String(aWeekAgo.getDate()).padStart(2, '0'),
  hour: String(aWeekAgo.getHours()).padStart(2, '0'),
  minutes: String(aWeekAgo.getMinutes()).padStart(2, '0'),
  seconds: String(aWeekAgo.getSeconds()).padStart(2, '0'),
  milliseconds: String(aWeekAgo.getMilliseconds()).padEnd(3, '0')
}
let startDate = lastWeek.year + '-' + lastWeek.month + '-' + lastWeek.day + 'T' + lastWeek.hour + ':' + lastWeek.minutes + ':' + lastWeek.seconds + '.' + lastWeek.milliseconds + 'Z';
let endDate = today.year + '-' + today.month + '-' + today.day + 'T' + today.hour + ':' + today.minutes + ':' + today.seconds + '.' + today.milliseconds + 'Z';

// Coordinates
let lat = {
  latitude: null,
  latitudeListener: function (val) {},
  set lat(val) {
    this.latitude = val;
    this.latitudeListener(val);
  },
  get lat() {
    return this.latitude;
  },
  registerListener: function (listener) {
    this.latitudeListener = listener;
  }
}
let lon = {
  longitude: null,
  longitudeListener: function (val) {},
  set lon(val) {
    this.longitude = val;
    this.longitudeListener(val);
  },
  get lon() {
    return this.longitude;
  },
  registerListener: function (listener) {
    this.longitudeListener = listener;
  }
}

let crimeAPIURL;
let crimeAPIKey = "eTTNgvc5gR7S4JKzmPevEaFFvudBKD6HajzwSmx4";
let crimeAPITestKey = "k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG";
// let crimeAPIURL = "https://api.crimeometer.com/v1/incidents/raw-data?distance=10mi&datetime_ini=2020-07-28T01:00:00.000Z&datetime_end=2020-08-01T01:00:00.000Z&page=1&"

const offsetDistance = "10mi";
let foodKey = "4486b600a45e8dffaed915b679ebaa9e";


console.log(lastWeek);
console.log(today)
const page = 1;

// Event API
let clientID = 'k8CmfyXeORc'
let clientSecret = "7_fcu4NrLJNqxb_LxGFndEHVAkfGl3BQLPC10GH3Rb7tACuxLOSWyA"
let accessToken = "nqKmou50v5NVvHYGE7vdlngL-9z_G143JxZZ8MvR"
// console.log(endDate);
let geolocation = navigator.geolocation;
window.onload = geolocation.getCurrentPosition(useCoordinates);

let map;

function useCoordinates(pos) {
  let crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  lat.lat = crd.latitude;
  lon.lon = crd.longitude;
  console.log(lat);
  console.log(lon);
}
lat.registerListener(function (val) {
  console.log("Someone changed the value of lat.lat to " + val);
})
lon.registerListener(function (val) {
  console.log("Someone changed the value of lon.lon to " + val);
  
  
  loadMap();
  showCrimes();
  findFood();
  // getGeocode(lat.latitude, lon.longitude);
  // findEvents();
  getWeather();
})
let i = 1;
function getGeocode(latitude, longitude) {
  let geocodeURL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=9RN8sk8YqVpEX3X3GFDMAPdDXujcmTX8&location=${latitude},${longitude}`
  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (geoJSON) {
      // console.log(geoJSON);
      let stateCode = geoJSON.results[0].locations[0].adminArea3;
      console.log(stateCode);

      

      let newsURL = `http://newsapi.org/v2/top-headlines?q=${state[stateCode]}&apiKey=553770983ea048d29a3022aaee5a1199`;
      if (i == 1) {
        getNews(newsURL);
        i++;
      }
    })
}
function getWeather() {
  let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=cc35d4d247449fbc0ef0a693e2d28e56&lat=${lat.latitude}&lon=${lon.longitude}`;
  fetch(weatherAPI)
    .then(function (resp) {
      return resp.json()
    }) // Convert data to json
    .then(function (data) {
      console.log(data);
      updateWeatherTag(data);
    })
}

function getNews(newsURL) {
  fetch(newsURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      updateNewsTag(data);
    })
}

function loadMap() {
  L.mapquest.key = '9RN8sk8YqVpEX3X3GFDMAPdDXujcmTX8';
  document.querySelector("#map").innerHTML = "";
  // 'map' refers to a <div> element with the ID map
  map = L.mapquest.map('map', {
    center: [lat.latitude, lon.longitude],
    layers: L.mapquest.tileLayer('map'),
    zoom: 12
  })
  L.marker([lat.latitude, lon.longitude], {
    icon: L.mapquest.icons.marker(),
    draggable: false
  }).bindPopup('You are here').addTo(map);
}



function findFood() {

  $.ajax({
    url: `https://developers.zomato.com/api/v2.1/geocode?lat=${lat.latitude}&lon=${lon.longitude}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('user-key', foodKey)
    },
    success: function (data) {
      // alert(data);
      //process the JSON data etc
      console.log(data);
      let restaurants = data.nearby_restaurants;
      for (let i = 0; i < restaurants.length; i++) {
        let restaurantLatitude = restaurants[i].restaurant.location.latitude;
        let restaurantLongitude = restaurants[i].restaurant.location.longitude;

        getGeocode(restaurantLatitude, restaurantLongitude);
        // console.log(restaurantLatitude, restaurantLongitude)
          let maxDistance = distances(lat.latitude, lon.longitude, restaurantLatitude, restaurantLongitude);
          maxDistance = Math.round((maxDistance + Number.EPSILON) * 100) / 100
          console.log(`${maxDistance} miles away`);
          
        restaurantName = restaurants[i].restaurant.name;

        L.mapquest.textMarker([restaurantLatitude, restaurantLongitude], {
          // text: restaurantName,
          // position: top,
          type: "marker",
          icon: {
            primaryColor: '#334EFF',
            secondaryColor: '#333333',
            size: 'md'
          },
          draggable: false
        }).bindPopup(`${restaurantName}, ${maxDistance} miles away`).addTo(map);
      }
    }
  })
}

function findEvents() {
  $.ajax({
    url: `https://api.predicthq.com/v1/events?location_around.offset=${offsetDistance}&location_around.origin=${lat.latitude},${lon.longitude}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Accept', 'application/json')
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
    },
    success: function (data) {
      console.log(data);
    }
  })
}
function findCrime() {
  $.ajax({
    url: `https://api.crimeometer.com/v1/incidents/raw-data?lat=${lat.latitude}&lon=${lon.longitude}&distance=${offsetDistance}&datetime_ini=${startDate}&datetime_end=${endDate}&page=${page}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('x-api-key', `${crimeAPITestKey}`)
    },
    success: function (data) {
      console.log(data);
      console.log(data.incidents[0].incident_latitude);
      // showCrimes(data);
    }
  })
}