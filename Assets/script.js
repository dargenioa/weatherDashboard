$( document ).ready(function() {
    
    let searchCity = $("#search-city");
    let searchZipcode = $("search-zipcode");
    let searchHistoryEl = $("search-history");
    let historyArr = [];
    
    var appID = "cac4580de451da1962896497423d0dd0";

    function renderSearchHistory () {
            $(".history").empty();

            for (let i = 0; i < historyArr.length; i++) {
              let newBtn  = $("<button>").text(historyArr[i]);
              let newDiv = $("<div>");
              newDiv.append(newBtn);
              $(".history").prepend(newDiv);

            }
          };


    $(".query_btn").click(function(){

        var query_param = $(this).prev().val();
        historyArr.push(query_param);


        if ($(this).prev().attr("placeholder") == "City") {
            var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
            let fiveDay = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + query_param + "&cnt=5&appid=" + appID;
        } else if ($(this).prev().attr("placeholder") == "Zip Code") {
            var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;
            let fiveDay = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + query_param + "&cnt=5&appid=" + appID;

        }

        $.ajax({
            url: weather,
            method: "GET"
        }).then(function(json){
            $("#city").html(json.name);
           // $("#main_weather").html(json.weather[0].main);
           // $("#description_weather").html(json.weather[0].description);
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temperature").html((json.main.temp - 273.15) * 1.80 + 32);
            $("#wind").html(json.wind.speed);
            $("#humidity").html(json.main.humidity);
            let lat = json.coord.lat;
            let lon = json.coord.lon;
            console.log(json);

        let uvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appID;

        $.ajax({
            url: uvIndex,
            method: "GET"
        }).then(function(response){
            $("#uv-index").html(response.value);
            console.log(response);
        });

        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(function(response){
            console.log(response);

        });




        });


        renderSearchHistory();
    })

    // Optional Code for temperature conversion
    var fahrenheit = true;

    $("#convertToCelsius").click(function() {
        if (fahrenheit) {
            $("#temperature").text(((($("#temperature").text() - 32) * 5) / 9));
        }
        fahrenheit = false;
    });

    $("#convertToFahrenheit").click(function() {
        if (fahrenheit == false) {
            $("#temperature").text((($("#temperature").text() * (9/5)) + 32));
        }
        fahrenheit = true;
    });


});