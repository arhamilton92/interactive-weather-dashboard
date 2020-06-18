//VARIABLES
var APIKey = "4a5de0ef81ad062d6730642be9cf3b8e";
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
var UV = "";
var uvEl = "";

//searches for city and uses its information to poplulate the app
function searchCity() {  
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + selectedCity + "&appid=" + APIKey;
    //if there is nothing in selectedCity variable, sets city to atlanta. Atlanta shows on the page when first loading it!
    //else, uses the selectedCity variable to pick the city.
    if (selectedCity === null) {
        selectedCity = "Atlanta"} 
        else {
            if (selectedCity == "") {
                console.log('no city searched!')
            }else {     
                $.ajax({
                    url: queryURL,
                    method: "GET"
                }).then(function(response) {
                    console.log(response);
                    //empties previously generated weather data
                    $(".weather-info").empty();
                    //converts temp from K to F
                    var K = response.main.temp;
                    F = (K - 273.15) * 1.80 + 32;
                    F = Math.floor(F);
                    //creates and adds data to corresponding elements in the weather-info div
                    var cityEl = $("<h3>").attr("class", "mb-3").text(response.name);
                    var windEl = $("<p>").text("Speed: " + response.wind.speed + " MPH");
                    var humidityEl = $("<p>").text("Humidity: " + response.main.humidity);
                    var tempEl = $("<p>").text("Temperature: " + F + " F");
                    //gathers data to be used to query another url 
                    lat  = response.coord.lat;
                    long = response.coord.lon;
                    time = response.dt;
                    //appends elements to weather-info div
                    $(".weather-info").append(cityEl, windEl, humidityEl, tempEl)
                    
                    get5Day();
                })
            }
    }
}

//gets the 5Day forecast using info from the searchCity function 
function get5Day() {

    queryURL2 =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,minutely&appid=" + APIKey;
    
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        //removes previously generated elements
        $('.forecast').remove();
        //for loop to generate info for each 5day forecast element. similar to searchCity function, but in a loop.
        for (i = 1; i < 6; i++) {
            var currentDate= moment().add(i, 'days').format("L")
            var weather = response.daily[i].weather[0].main;
            weather.toUpperCase();
            var temperature = response.daily[i].temp.day
            F = (temperature - 273.15) * 1.80 + 32;
            F = Math.floor(F);
            var humidity = response.daily[i].humidity
            var dateInfo = ($("<h5>").attr("class", "pt-2")).text(currentDate);
            var weatherInfo = $("<p>").text(weather)
            var tempInfo = $("<p>").text("temp: " + F + "F")
            var humidInfo =$("<p>").text("humidity: " + humidity)
            var fiveDayRow = $("<div>").attr("class", "col-2 forecast").append(dateInfo, weatherInfo, tempInfo, humidInfo);
            $(".five-day").append(fiveDayRow);
        }
        //gets UV data, generates and element and appends to weather-info div.
        //if <3, the background of the span tag will be yellow. >3, but <7, it wioll be orange. above 7 will be red.
        UV = response.current.uvi
        if (UV < 3){
            uvEl = $("<p>").text("UV Index: ").append($("<span>").attr("class", "UV-safe").text(UV))
        } else if (UV < 7 ){
            uvEl = $("<p>").text("UV Index: ").append($("<span>").attr("class", "UV-warning").text(UV))
        } else {
            uvEl = $("<p>").text("UV Index: ").append($("<span>").attr("class", "UV-danger").text(UV))
        }
        $(".weather-info").append(uvEl);
    })
}

//capitalises the city name if not already capital
function capitalizeCity() {
    selectedCity = selectedCity[0].toUpperCase() + selectedCity.slice(1);
}

//adds city info and keys to retrieve to local storage.
function toLocalStorage() {
    city = selectedCity
    console.log(city);
    var numberKey = "numberKey";
    var numberOfCities = arrayOfCities.length;
    var key = arrayOfCities.length;
    localStorage.setItem(key, city);
    localStorage.setItem(numberKey, numberOfCities)
    }

//retrieves info from local storage to generate buttons.
function fromLocalStorage() {
    //retrieves the number of buttons needed from local Storage.
    var getCity = localStorage.getItem("numberKey");
    //had to add this because things got weird. Not sure what I did wrong, but if I do it without this I get empty buttons.
    if (getCity !== null) {
        //adds 1 to that number. so that < getCity will work in the loop.
        getCity = getCity += 1;
        $('.city-button').remove();
        //loop gets city from storage, and creates a button using that info, before appending it to the city-button-list div.
        for (i = 0; i < getCity || i === getCity; i++) {
            selectedCity = localStorage.getItem(i);
            if (selectedCity !== null) {
            var cityButton = ($("<button>").attr("class", "btn btn-link white border city-button p-3")).attr("id", "i city-button").text(selectedCity);
            $(".city-button-list").prepend(cityButton);
            arrayOfCities.push(selectedCity);
            console.log(selectedCity);
        }}
    }
}

//FUNCTION CALLS
fromLocalStorage();
selectedCity = "Atlanta";
searchCity();

//search button event listener
$(".search-button").on("click", function() {
    selectedCity = $(".citysearch").val();
    if (selectedCity !== "") {
        searchCity();
        selectedCity.toLowerCase();
        capitalizeCity();
        arrayOfCities.push(selectedCity);
        toLocalStorage();
        console.log(selectedCity);
        fromLocalStorage();
    } 
    console.log(arrayOfCities);
});
