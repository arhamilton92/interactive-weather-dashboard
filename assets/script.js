var APIKey = "4a5de0ef81ad062d6730642be9cf3b8e";

// Here we are building the URL we need to query the database
var queryURL = "";
var queryURL2 = "";
var arrayOfCities = [];
var selectedCity = "";
var city = "";
var lat = "";
var long = "";
var time = "";
var F = "";
var currentDate= moment().add(1, 'days').format("L")
console.log(currentDate)


function searchCity() {  
    console.log(selectedCity)
    if (selectedCity === null) {
        selectedCity = "Atlanta"} 
        else {

            queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&appid=" + APIKey;

            if (selectedCity == "") {
                console.log('OOPS')
            }else {
                
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                console.log(response);

                $(".weather-info").empty();

                var K = response.main.temp;
                F = (K - 273.15) * 1.80 + 32;


                var cityEl = $("<h3>").attr("class", "mb-3").text(response.name);
                var windEl = $("<p>").text("Speed: " + response.wind.speed + " MPH");
                var humidityEl = $("<p>").text("Humidity: " + response.main.humidity);
                var tempEl = $("<p>").text("Temperature: " + F);

                lat  = response.coord.lat;
                long = response.coord.lon;
                time = response.dt;

                $(".weather-info").append(cityEl, windEl, humidityEl, tempEl)

                get5Day();

                })
            }
    }
}

function get5Day() {
    
    queryURL2 =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,minutely&appid=" + APIKey;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        console.log(response)

        $('.forecast').remove();
        
        for (i = 1; i < 6; i++) {
            var currentDate= moment().add(i, 'days').format("L")
            var weather = response.daily[i].weather[0].main;
            weather.toUpperCase();
            var temperature = response.daily[i].temp.day
            F = (temperature - 273.15) * 1.80 + 32;
            F = Math.floor(F);
            var humidity = response.daily[i].humidity

            var dateInfo = ($("<h4>").attr("class", "pt-2")).text(currentDate);
            var weatherInfo = $("<p>").text(weather)
            var tempInfo = $("<p>").text(F)
            var humidInfo =$("<p>").text(humidity)
    //creates a row for all the columns, and then appends them to it.
        var fiveDayRow = $("<div>").attr("class", "forecast").append(dateInfo, weatherInfo, tempInfo, humidInfo);
        $(".five-day").append(fiveDayRow);

        }
    })
}

{/* <div class="col-2 forecast textleft"> 
<h4 class="pt-2"> Atlanta </h4>
<p>Temp:</p>
<p class="pb-2">Temp:</p>
</div> */}

//capitalises the city name if not already capital
function capitalizeCity() {
    selectedCity = selectedCity[0].toUpperCase() + selectedCity.slice(1);
}

//this is a mess I'm so sorry
function toLocalStorage() {
    city = selectedCity
    console.log(city);
    var numberKey = "numberKey";
    var numberOfCities = arrayOfCities.length;
    var key = arrayOfCities.length;
    localStorage.setItem(key, city);
    localStorage.setItem(numberKey, numberOfCities)
    }

function fromLocalStorage() {
    var getCity = localStorage.getItem("numberKey");
    if (getCity !== null) {
        getCity = getCity += 1;
        $('.city-button').remove();

        for (i = 0; i < getCity || i <= 6 || i === getCity; i++) {
            selectedCity = localStorage.getItem(i);
            if (selectedCity !== null) {
            var cityButton = ($("<button>").attr("class", "btn btn-link white border city-button p-3")).attr("id", "i city-button").text(selectedCity);
            $(".city-button-list").prepend(cityButton);
            arrayOfCities.push(selectedCity);
            console.log(selectedCity);
        }}
    }
}


fromLocalStorage();
selectedCity = "Atlanta";
searchCity();


$(".search-button").on("click", function() {
    selectedCity = $(".citysearch").val();
    console.log('you clicked a button!');
    searchCity();
    if (selectedCity !== "") {
        selectedCity.toLowerCase();
        capitalizeCity();
        arrayOfCities.push(selectedCity);
        toLocalStorage();
        console.log(selectedCity);
        fromLocalStorage();
    } 
    console.log(arrayOfCities);
});

$(".city-button").on("click", function() {
    selectedCity = $(".city-button").text();
    searchCity();
    arrayOfCities.push(selectedCity);
    toLocalStorage();
    console.log(selectedCity);
    fromLocalStorage();
});