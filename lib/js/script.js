let tempTag = document.querySelector("#temp");
let weatherTag = document.querySelector("#weather");
let newsTag = document.getElementById("news");
let newsArray = [];
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
    for (let i = 0; i < data.articles.length; i++) {
        let article = new News();
        article.title = data.articles[i].title;
        article.url = data.articles[i].url;
        articles.push(article);
        // console.log(articles);
        newsArray.push(data.articles[i].title)
        // newsTag.innerHTML = data.articles[i].title;
        // console.log(data.articles[i].title)
        // console.log(newsArray);
        if (articles.length == data.articles.length) {
            for (let item = 0; item < articles.length; item++) {
                let p = document.createElement('p')
                p.innerHTML = `<a href="${articles[item].url}" target="_blank">${articles[item].title}</a><br>`;
                newsTag.appendChild(p);
            }
        }
        // console.log(article)

    }
}

function updateFood(data) {
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
                primaryColor: '#ec0000',
                secondaryColor: '#ecca00',
                size: 'md'
            },
            draggable: false
        }).bindPopup(`${restaurantName}, ${maxDistance} miles away`).addTo(map);
    }
}

function showCrimes() {
    for (let i = 0; i < data.incidents.length; i++) {
        let incident = data.incidents[i];
        let incidentLat = incident.incident_latitude;
        let incidentLon = incident.incident_longitude;
        let crimeDistance = Math.round((distances(lat.latitude, lon.longitude, incidentLat, incidentLon) + Number.EPSILON) * 100) / 100;
        L.mapquest.textMarker([incidentLat, incidentLon], {

            // position: top,
            type: "marker",
            icon: {
                primaryColor: '#960018',
                secondaryColor: '#333333',
                size: 'md'
            },
            draggable: false
        }).bindPopup(`${incident.incident_offense_description}, ${crimeDistance} miles away`).addTo(map);
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