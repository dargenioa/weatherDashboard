// Questions for office hours
// Fix search history buttons and how to have the last search term displayed in the page
// 

$(document).ready(function () {

    // Get search history and save to localstorage
    let historyArr = JSON.parse(localStorage.getItem("history")) || [];

    // API Key
    var appID = "cac4580de451da1962896497423d0dd0";

    // Function to render search history buttons
    function renderSearchHistory() {

        // Empties history before running
        $(".history").empty();

        // Loops through the history array to create buttons, adds a class and search type

        for (let i = 0; i < historyArr.length; i++) {
            let newBtn = $("<button>").text(historyArr[i]);
            let newDiv = $("<div>");
            newBtn.addClass("history-btn btn btn-outline-secondary btn-lg btn-block");
            if (isNaN(historyArr[i]) == true) {
                newBtn.attr("searchType", "City");
            }

            // Appends buttons to div, prepends to .history to have the newest ontop
            // Clears the input field to an empty string after clicking search

            newDiv.append(newBtn);
            $(".history").prepend(newDiv);
            $("input").val('');

        }

        // Sets local storage

        localStorage.setItem("history", JSON.stringify(historyArr));

    };

    // Run original search

    function handleSearch() {
        // Gets the value to which search button is clicked 
        var query_param = $(this).prev().val();

        // Pushes the value into the history array
        historyArr.push(query_param);

        var query_type = $(this).prev().attr("placeholder");

        runQuery(query_param, query_type)
    }

    function runQuery(query_param, query_type) {
        var weather;
        // If the button that was clicked is a city set weather to the correct URL else set it to the zipcode URL
        if (query_type === "City") {
            weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
        } else {
            weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
        }

        // First ajax call
        $.ajax({
            url: weather,
            method: "GET"
        }).then(function (json) {
            $("#date").html(moment().format("dddd, " + "MMMM Do YYYY"));
            $("#city").html(json.name);
            // $("#main_weather").html(json.weather[0].main);
            // $("#description_weather").html(json.weather[0].description);
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").html(Math.floor(json.main.temp - 273.15) * 1.80 + 32);
            $("#wind").html(json.wind.speed);
            $("#humidity").html(json.main.humidity);
            let lat = json.coord.lat;
            let lon = json.coord.lon;
            console.log(json);


            // UV index ajax call

            let uvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appID;

            $.ajax({
                url: uvIndex,
                method: "GET"
            }).then(function (response) {
                $("#uv-index").html(response.value);
                console.log(response);

                let indexColor = response.value;
                let indexDiv = $("#uv-index");
                console.log(indexColor, indexDiv);
    
                 if (indexColor <= 2){
                     indexDiv.attr("style", "background-color: green");
                 } else if (indexColor > 2 && indexColor <= 5) {
                    indexDiv.attr("style", "background-color: yellow");
                 } else if (indexColor > 5 && indexColor < 8) {
                    indexDiv.attr("style", "background-color: orange"); 
                 } else if (indexColor >= 8 && indexColor < 11) {
                    indexDiv.attr("style", "background-color: red");
                } else {
                    indexDiv.attr("style", "background-color: pink");
                };
            });

            // Five day forecast ajax call

            let fiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + "current,minute,hourly,alerts&appid=" + appID;

            $.ajax({
                url: fiveDay,
                method: "GET"
            }).then(function (result) {
                console.log(result);
                let results = result.daily;

                // Empties the previous 5 day forcast and creates a new one

                $("#five-day").empty();
                for (let i = 0; i < 5; i++) {
                    let divHolder = $("<div></div>").addClass("col-sm-2");
                    // Converts unix date
                    let dateConvert = new Date(results[i].dt * 1000).toDateString();
                    let date = $("<p>" + dateConvert + "<p>");
                    let temp = $("<p>" + "Temp: " + Math.floor((results[i].temp.day - 273.15) * 1.80 + 32) + "<p>");
                    let humidity = $("<p>" + "Humidity: " + results[i].humidity + "<p>");
                    let icon = $("<img>");
                    icon.attr("src", "http://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png");
                    $(divHolder).append(temp, icon, humidity, date);
                    $("#five-day").append(divHolder);

                }
                // This creates the buttons
                renderSearchHistory();


            });


        });


    };

    // This keeps them rendered to the page
    renderSearchHistory();

    var last = historyArr.length - 1;
    var query_type = "zip";
    if (isNaN(historyArr[last])) {
        query_type = "City"
    }

    runQuery(historyArr[last], query_type);

    // Optional Code for temperature conversion
    var fahrenheit = true;

    $("#convertToCelsius").click(function () {
        if (fahrenheit) {
            $("#temperature").text(Math.floor(((($("#temperature").text() - 32) * 5) / 9)));
        }
        fahrenheit = false;
    });

    $("#convertToFahrenheit").click(function () {
        if (fahrenheit == false) {
            $("#temperature").text(Math.floor((($("#temperature").text() * (9 / 5)) + 32)));
        }
        fahrenheit = true;
    });

    // Search button click event
    $(".query_btn").on("click", handleSearch);

    // History button click event
    $(document).on("click", ".history-btn", function () {
        let searchItem = $(this).text();
        let btnAttr = $(this).attr("searchType");
        runQuery(searchItem, btnAttr)
    });


});