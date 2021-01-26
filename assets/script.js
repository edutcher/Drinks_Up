var map;

$.ajax({
    url: `https://json.geoiplookup.io/`,
    type: "GET"
}).then(function(res) {
    const { latitude, longitude } = res;
    map = L.map('map').setView([latitude, longitude], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //getBrews(res.city, res.region);
}).catch((er) => {
    console.log(er);
})

function moveMap(lat, lon) {
    map.panTo(new L.LatLng(lat, lon));
}

function popMap(places) {
    for (var i = 0; i < places.length; i++) {
        let lat = places[i].latitude;
        let lon = places[i].longitude;
        L.marker([lat, lon]).addTo(map)
            .bindPopup(`${places[i].name}`)
            .openPopup();
    }
}

$(document).ready(function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems);
    var el = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(el);
});