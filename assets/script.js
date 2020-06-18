var APIKey = "4a5de0ef81ad062d6730642be9cf3b8e";

// Here we are building the URL we need to query the database
var queryURL = "";
var arrayOfCities = [];
var selectedCity = "Atlanta";
var city = "";

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

                var K = response.main.temp;
                var F = (K - 273.15) * 1.80 + 32


                var cityEl = $("<h3>").attr("class", "mb-3").text(response.name);
                var windEl = $("<p>").text("Speed: " + response.wind.speed + " MPH");
                var humidityEl = $("<p>").text("Humidity " + response.main.humidity);
                var tempEl = $("<p>").text("Temperature: " + F);

                weather = $(".weather-info").append(cityEl, windEl, humidityEl, tempEl)
                })
            }
    }
}
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
        console.log(getCity)
        $('.city-button').remove();

        for (i = 0; i < getCity || i === getCity; i++) {
            selectedCity = localStorage.getItem(i);
            if (selectedCity !== null) {
            var cityButton = ($("<button>").attr("class", "btn btn-link white border city-button")).attr("id", "i").text(selectedCity);
            $(".city-button-list").prepend(cityButton);
            arrayOfCities.push(selectedCity);
        }}
    }
    console.log(selectedCity);
}


fromLocalStorage();
searchCity();

$(".search-button").on("click", function() {
    selectedCity = $(".citysearch").val();
    console.log('you clicked a button!');
    // clearWeatherInfo();
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