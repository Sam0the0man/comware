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

let weatherURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=cc35d4d247449fbc0ef0a693e2d28e56&"

let apiLat = "lat=";
let apiLon = "&lon=";

let crimeAPIURL;

let comma = ",";
let crimeAPIKey = "eTTNgvc5gR7S4JKzmPevEaFFvudBKD6HajzwSmx4";
let crimeAPITestKey = "k3RAzKN1Ag14xTPlculT39RZb38LGgsG8n27ZycG";
// let crimeAPIURL = "https://api.crimeometer.com/v1/incidents/raw-data?distance=10mi&datetime_ini=2020-07-28T01:00:00.000Z&datetime_end=2020-08-01T01:00:00.000Z&page=1&"
let newsURL =
  'http://newsapi.org/v2/top-headlines?' +
  'q=New%20York&' +
  'apiKey=553770983ea048d29a3022aaee5a1199';
const offsetDistance = "10mi";


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
  // getCrime();
  findCrime();
  // loadMap();
  // findFood();
  // getGeocode(lat.latitude, lon.longitude);
  // findEvents();
  // getNews();
});

function runAPIs() {
  //   // Geocode API Call
  //   let geocodeURL = "http://www.mapquestapi.com/geocoding/v1/reverse?key=9RN8sk8YqVpEX3X3GFDMAPdDXujcmTX8&location=" + lat.latitude + comma + lon.longitude;
  //   getGeocode(geocodeURL);

  //   // Weather API Call
  //   let weatherAPI = weatherURL + apiLat + lat.latitude + apiLon + lon.longitude;
  //   getWeather(weatherAPI);
  //   // Crime API Call
  //   let crimeAPI = crimeAPIURL + apiLat + lat.latitude + apiLon + lon.longitude;
  //   findCrime(crimeAPI);
  //   // News API Call
  //   getNews();
  //   // Load Map
  loadMap();
}

function getCrime() {
  let request = new XMLHttpRequest();

  crimeAPIURL = `https://api.crimeometer.com/v1/incidents/raw-data?lat=${lat.latitude}&lon=${lon.longitude}&distance=${offsetDistance}&datetime_ini=${startDate}&datetime_end=${endDate}&page=${page}`;
  request.open('GET', crimeAPIURL);

  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('x-api-key', crimeAPIKey);

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      console.log('Status:', this.status);
      console.log('Headers:', this.getAllResponseHeaders());
      console.log('Body:', this.responseText);
      console.log(this.responseText.incidents);
    }
  };
  request.send();

  // console.log(distances(lat.latitude, lon.longitude, this.responseText.incidents[0].incident_latitude, this.responseText.incidents[0].incident_longitude))
}

function getGeocode(latitude, longitude) {
  let geocodeURL = `http://www.mapquestapi.com/geocoding/v1/reverse?key=9RN8sk8YqVpEX3X3GFDMAPdDXujcmTX8&location=${latitude},${longitude}`
  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (geoJSON) {
      console.log(geoJSON);
    })
}

function getWeather(weatherAPI) {
  fetch(weatherAPI)
    .then(function (resp) {
      return resp.json()
    }) // Convert data to json
    .then(function (data) {
      console.log(data);
    })
}

function getNews() {
  fetch(newsURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
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
  }).addTo(map);
}

function distances(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  } else {
    let radlat1 = Math.PI * lat1 / 180;
    let radlat2 = Math.PI * lat2 / 180;
    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344
    }
    if (unit == "N") {
      dist = dist * 0.8684
    }
    return dist;
  }
}
let foodKey = "4486b600a45e8dffaed915b679ebaa9e";

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

        console.log(restaurantLatitude, restaurantLongitude)

        let maxDistance = distances(lat.latitude, lon.longitude, restaurantLatitude, restaurantLongitude);
        maxDistance = Math.round((maxDistance + Number.EPSILON) * 100) / 100
        console.log(`${maxDistance} miles away`);

        restaurantName = restaurants[i].restaurant.name;

        L.mapquest.textMarker([restaurantLatitude, restaurantLongitude], {
          text: restaurantName,
          position: top,
          type: "marker",
          icon: {
            primaryColor: '#334EFF',
            secondaryColor: '#333333',
            size: 'md'
          },
          draggable: false
        }).addTo(map);
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
    }
  })
}