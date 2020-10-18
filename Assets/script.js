$( document ).ready(function() {
    
    let searchCity = $("#search-city");
    let searchZipcode = $("#search-zipcode");
    let searchHistoryEl = $("#search-history");
    let historyArr = [];
    
    var appID = "cac4580de451da1962896497423d0dd0";

     function renderSearchHistory () {
            $(".history").empty();

            for (let i = 0; i < historyArr.length; i++) {
              let newBtn  = $("<button>").text(historyArr[i]);
              let newDiv = $("<div>");
              newBtn.attr("class", "history-btn");
              newDiv.append(newBtn);
              $(".history").prepend(newDiv);
              $("input").val('');

            }

          };



    function runQuery (){

        var query_param = $(this).prev().val();
        historyArr.push(query_param);


        if ($(this).prev().attr("placeholder") == "City") {
            var weather = "http://api.openweathermap.org/data/2.5/weather?q=" + query_param + "&APPID=" + appID;
        } else if ($(this).prev().attr("placeholder") == "Zip Code") {
            var weather = "http://api.openweathermap.org/data/2.5/weather?zip=" + query_param + "&APPID=" + appID;

        }

        $.ajax({
            url: weather,
            method: "GET"
        }).then(function(json){
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

        let uvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + appID;

        $.ajax({
            url: uvIndex,
            method: "GET"
        }).then(function(response){
            $("#uv-index").html(response.value);
            console.log(response);
        });

        let fiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + "current,minute,hourly,alerts&appid=" + appID;

        $.ajax({
            url: fiveDay,
            method: "GET"
        }).then(function(result){
            console.log(result);
            let results = result.daily;

           // $("#five-day").text(results);
           

           for (let i = 0; i < 5; i++){
               let temp = $("<p>" + "Temp: " + Math.floor((results[i].temp.day - 273.15) * 1.80 + 32) + "<p>");
               let humidity = $("<p>" + "Humidity: " + results[i].humidity + "<p>")
              let date = $("<p>" + "Date: "  + "<p>");
               let icon = $("<img>");
               icon.attr("src", "http://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png");
              // day.text(results[i].main.temp, results[i].main.humidity, results[i].weather[0].icon);
               $("#five-day").append(temp, icon, humidity, date);
               
           }
        

        });



        });


        renderSearchHistory();
    };

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

    $(".query_btn").on("click", runQuery);
   $(".history").on("click", function(){
       let thisEl = $(this).attr("class", "history-btn");
       console.log(thisEl);
   });
});