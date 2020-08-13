let tempTag = document.querySelector("#temp");
let weatherTag = document.querySelector("#weather");
let newsTag = document.getElementById("news");
let newsArray = [];
let markerSwitch = document.querySelector("#role-checkbox");

let checkStatus = "restaurant";

let crimes = [];
let restaurants = [];
let darkMode = window.matchMedia('(prefers-color-scheme: dark)');

function initRestaurants() {
    for (let i = 0; i < restaurants.length; i++) {
        let restaurantLatitude = restaurants[i].restaurant.location.latitude;
        let restaurantLongitude = restaurants[i].restaurant.location.longitude;
        restaurantName = restaurants[i].restaurant.name;
        let maxDistance = distances(lat.latitude, lon.longitude, restaurantLatitude, restaurantLongitude);
        maxDistance = Math.round((maxDistance + Number.EPSILON) * 100) / 100

        displayMarker(restaurantLatitude, restaurantLongitude, restaurantName, maxDistance)
    }
}

let crimeCount = 0;
let restaurantCount = 0;
markerSwitch.addEventListener('change', function () {
    // map.getController().clear();
    // showCrimes();
    fg.clearLayers();
    if (this.checked) {
        // showCrimes();
        checkStatus = "crime";
        if (crimeCount == 0) {
            for (let i = 0; i < crimes.incidents.length; i++) {
                let incidentLat = crimes.incidents[i].incident_latitude
                let incidentLon = crimes.incidents[i].incident_longitude
                let crimeDistance = Math.round((distances(lat.latitude, lon.longitude, incidentLat, incidentLon) + Number.EPSILON) * 100) / 100;

                displayMarker(crimes.incidents[i].incident_latitude, crimes.incidents[i].incident_longitude, crimes.incidents[i].incident_offense_description, crimeDistance)
            }
            crimeCount++;
            restaurantCount = 0;
        }

    } else {
        checkStatus = "restaurant"
        // console.log(restaurants)
        if (restaurantCount == 0) {
            for (let i = 0; i < restaurants.length; i++) {
                let restaurantLatitude = restaurants[i].restaurant.location.latitude;
                let restaurantLongitude = restaurants[i].restaurant.location.longitude;
                restaurantName = restaurants[i].restaurant.name;
                let maxDistance = distances(lat.latitude, lon.longitude, restaurantLatitude, restaurantLongitude);
                maxDistance = Math.round((maxDistance + Number.EPSILON) * 100) / 100

                displayMarker(restaurantLatitude, restaurantLongitude, restaurantName, maxDistance)
            }
            restaurantCount++;
            crimeCount = 0;
        }
        // updateFood();
    }
})


class News {
    constructor(title, url) {
        this.title = title;
        this.url = url;
    }
}

function updateWeatherTag(data) {
    let temperature = Math.floor(data.main.temp);
    tempTag.innerHTML = `${temperature}°`
    let weatherDesc = data.weather[0].description;
    weatherTag.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    // console.log(weatherDesc)

}

function updateNewsTag(data) {
    let articles = [];
    // console.log(data.news)
    for (let i = 0; i < data.news.length; i++) {
        let article = new News();
        article.title = data.news[i].title;
        article.url = data.news[i].url;
        articles.push(article);
        //console.log(articles);
        newsArray.push(data.news[i].title)
        //newsTag.innerHTML = data.articles[i].title;
        // console.log(data.articles[i].title)
        // console.log(newsArray);
        if (articles.length == data.news.length) {
            for (let item = 0; item < articles.length; item++) {
                let p = document.createElement('p')
                p.innerHTML = `<a href="${articles[item].url}" target="_blank">${articles[item].title}</a><br>`;
                newsTag.appendChild(p);
            }
        }
        // console.log(article)

    }
}

function updateFood(apiFood) {
    // console.log(apiFood)
    if (apiFood) restaurants = apiFood;
    for (let i = 0; i < restaurants.length; i++) {
        let restaurantLatitude = restaurants[i].restaurant.location.latitude;
        let restaurantLongitude = restaurants[i].restaurant.location.longitude;

        getGeocode(restaurantLatitude, restaurantLongitude);
        // console.log(restaurantLatitude, restaurantLongitude)
        let maxDistance = distances(lat.latitude, lon.longitude, restaurantLatitude, restaurantLongitude);
        maxDistance = Math.round((maxDistance + Number.EPSILON) * 100) / 100
        // console.log(`${maxDistance} miles away`);

        restaurantName = restaurants[i].restaurant.name;

        // displayMarker(restaurantLatitude, restaurantLongitude, restaurantName, maxDistance);
        // L.mapquest.textMarker([restaurantLatitude, restaurantLongitude], {
        //     // text: restaurantName,
        //     // position: top,
        //     type: "marker",
        //     icon: {
        //         primaryColor: '#ec0000',
        //         secondaryColor: '#ecca00',
        //         size: 'md'
        //     },
        //     draggable: false
        // }).bindPopup(`${restaurantName}, ${maxDistance} miles away`).addTo(map);
    }
}

function displayMarker(lat, lon, name, distanceAway) {
    let primColor = '#383838';
    let secColor = '#25dede';
    if (darkMode.matches) {
        primColor = '#383838';
        secColor = '#25dede';
    } else {
        primColor = '#706e6e';
        secColor = '#C60404';
    }


    darkMode.addEventListener('change', event => {
        if (event.matches) {
            //dark mode
            primColor = '#383838';
            secColor = '#25dede';
        } else {
            //light mode
            primColor = '#706e6e';
            secColor = '#C60404';
        }
        L.mapquest.textMarker([lat, lon], {
            // text: restaurantName,
            // position: top,
            type: "marker",
            icon: {
                primaryColor: primColor,
                secondaryColor: secColor,
                size: 'md'
            },
            draggable: false
        }).bindPopup(`${name}, ${distanceAway} miles away`).addTo(fg);
    })

    L.mapquest.textMarker([lat, lon], {
        // text: restaurantName,
        // position: top,
        type: "marker",
        icon: {
            primaryColor: primColor,
            secondaryColor: secColor,
            size: 'md'
        },
        draggable: false
    }).bindPopup(`${name}, ${distanceAway} miles away`).addTo(fg);
}

function showCrimes(apiCrimes) {


    if (apiCrimes) crimes = apiCrimes;
    // console.log(apiCrimes)
    for (let i = 0; i < crimes.length; i++) {
        // console.log(crimes[i])
        let incident = crimes[i];
        let incidentLat = incident.incident_latitude;
        let incidentLon = incident.incident_longitude;
        let crimeDistance = Math.round((distances(lat.latitude, lon.longitude, incidentLat, incidentLon) + Number.EPSILON) * 100) / 100;

        // displayMarker(incidentLat, incidentLon, incident.incident_offense_description, crimeDistance)

        // L.mapquest.textMarker([incidentLat, incidentLon], {

        //     // position: top,
        //     type: "marker",
        //     icon: {
        //         primaryColor: '#960018',
        //         secondaryColor: '#333333',
        //         size: 'md'
        //     },
        //     draggable: false
        // }).bindPopup(`${incident.incident_offense_description}, ${crimeDistance} miles away`).addTo(map);
        // console.log(crimeDistance);
        // console.log(getDistance(incidentLat, incidentLon))
    }
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