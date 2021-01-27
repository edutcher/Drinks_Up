var map = L.map('map').setView([40.712, -74.006], 18);
var drinks;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function moveMap(lat, lon) {
    map.panTo(new L.LatLng(lat, lon));
}

function popMap(places) {
    for (var i = 0; i < places.length; i++) {
        let lat = places[i].latitude;
        let lon = places[i].longitude;
        if (lat != null && lon != null) {
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`${places[i].name}`)
                .openPopup();
        }
    }
}

function getBreweries(city) {

    city = city.trim().toLowerCase();
    var newCity = '';

    for (var i = 0; i < city.length; i++) {
        if (city[i] === " ") {
            newCity += "_";
        } else {
            newCity += city[i];
        }
    }

    var q = `https://api.openbrewerydb.org/breweries?by_city=${newCity}`
    $.ajax({
        url: q,
        type: "GET"
    }).then(function(res) {
        popMap(res);
        console.log(res);
    }).catch((er) => {
        console.log(er);
    })
}

function drinkInfo() {
    var id = $('.carousel').find('a.carousel-item.active').data("drinkId");
    console.log(id);

    var q = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

    $.ajax({
        url: q,
        type: "GET"
    }).then(function(res) {
        console.log(res);
        $('#drinkTitle').text(`${res.drinks[0].strDrink}`);
        $('#instructions').text(`${res.drinks[0].strInstructions}`);
        $('#ingredients').empty();
        var newList = $('<ul>');
        for (var i = 1; i < 16; i++) {
            var currentAmount = res.drinks[0]['strMeasure' + i];
            var currentIngredient = res.drinks[0]['strIngredient' + i];

            if (currentAmount === null && currentIngredient === null) break;
            else if (currentAmount === null) {
                var newItem = $('<li>');
                newItem.text(currentIngredient);
            } else {
                var newItem = $('<li>');
                newItem.text(`${currentAmount} - ${currentIngredient}`);
            }
            newList.append(newItem);
        }
        $('#ingredients').append(newList);
    })
}

function getDrinks(choice) {
    choice = choice.trim().toLowerCase();
    var q = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${choice}`;

    $.ajax({
        url: q,
        type: "GET"
    }).then(function(res) {
        console.log(res);
        drinks = res;
        $('.carousel').empty();
        for (var i = 0; i < res.drinks.length; i++) {
            var newAnch = $('<a>');
            newAnch.addClass('carousel-item');
            newAnch.data('drinkId', res.drinks[i].idDrink);
            var newImg = $('<img>');
            newImg.attr('src', res.drinks[i].strDrinkThumb);
            newAnch.append(newImg);
            $('.carousel').append(newAnch);
        }
        var options = {
            onCycleTo: () => {
                drinkInfo();
            }
        }
        var caro = document.querySelectorAll('.carousel');
        var instances = M.Carousel.init(caro, options);
    })
}

$.ajax({
    url: `https://json.geoiplookup.io/`,
    type: "GET"
}).then(function(res) {
    const { latitude, longitude } = res;

    moveMap(latitude, longitude);
    getBreweries(res.city);
}).catch((er) => {
    console.log(er);
})

$.ajax({
    url: 'https://www.thecocktaildb.com/api/json/v1/1/random.php',
    type: "GET"
}).then(function(res) {
    var newAnch = $('<a>');
    newAnch.addClass('carousel-item');
    newAnch.data('drinkId', res.drinks[0].idDrink);
    var newImg = $('<img>');
    newImg.attr('src', res.drinks[0].strDrinkThumb);
    newAnch.append(newImg);
    $('.carousel').append(newAnch);
    $('#drinkTitle').text(`${res.drinks[0].strDrink}`);
    $('#instructions').text(`${res.drinks[0].strInstructions}`);
    $('#ingredients').empty();
    var newList = $('<ul>');
    for (var i = 1; i < 16; i++) {
        var currentAmount = res.drinks[0]['strMeasure' + i];
        var currentIngredient = res.drinks[0]['strIngredient' + i];

        if (currentAmount === null && currentIngredient === null) break;
        else if (currentAmount === null) {
            var newItem = $('<li>');
            newItem.text(currentIngredient);
        } else {
            var newItem = $('<li>');
            newItem.text(`${currentAmount} - ${currentIngredient}`);
        }
        newList.append(newItem);
    }
    $('#ingredients').append(newList);
})

$(document).ready(function() {
    var options = {
        onCycleTo: () => {
            drinkInfo();
        }
    }
    var caro = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(caro, options);
    var tabs = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(tabs);
    var select = document.querySelectorAll('select');
    var instances = M.FormSelect.init(select);

    $(document).on("change", "select", function(e) {
        var spiritChoice = $('select').find('option:selected').val();
        console.log($('select').find('option:selected').val());
        getDrinks(spiritChoice);
    })

    $('form').submit((e) => {
        e.preventDefault();

        var city = $('#searchCity').val().trim().toLowerCase();
        console.log(city);
        getBreweries(city);
    })
});