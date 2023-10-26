let myLayer;
let map;
let com_latitude;
let com_longitude;
var overlayMaps = {};
//get country codes from countryBorders.geo.json
getCountryNamesAndCodes();

//get country codes and names from getCountryCode.json and add to drop down selector
function getCountryNamesAndCodes() {
  $.ajax({
    url: "assets/php/getCountry.php?",
    type: "GET",
    success: function (countries) {

      let option = "";
      for (let country of countries) {
        option += '<option value="' + country[1] + '">' + country[0] + "</option>";
      }
      $("#countrySelect").append(option);
      // getAirports();

    },
  });
}


function getCountryNamesAndCodesex() {
  $.ajax({
    url: "assets/php/getCountry.php?",
    type: "GET",
    success: function (countries) {

      let option = "";
      for (let country of countries) {
        option += '<option value="' + country[1] + '">' + country[0] + "</option>";
      }

      $("#countrySelectex").append(option);

    },
  });
}

getCurrentMapLocation();
//get user's coordinates using geolocation
function getCurrentMapLocation() {
  if (navigator.geolocation) {
    // Geolocation is available in this browser

    // Define a success callback function
    function successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Do something with the latitude and longitude values
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      //get more information about current location
      getCurrentLocationDetails(latitude, longitude);
    }

    // Define an error callback function
    function errorCallback(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("User denied the request for geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          console.error("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          console.error("An unknown error occurred.");
          break;
      }
    }

    // Request the user's current location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    // Geolocation is not available in this browser
    console.error("Geolocation is not supported in this browser.");
  }
};
//get country code from from lat lon and intialise map
function getCurrentLocationDetails(latitude, longitude) {
  userLatitude = latitude;
  userLongitude = longitude;

  com_latitude = latitude;
  com_longitude = longitude;

  $.ajax({
    url: "assets/php/getCountryPositionCodeFromLatlon.php",
    data: {
      lat: userLatitude,
      lng: userLongitude,
      username: "skwembeproff",
    },
    type: "GET",
    success: function (jsonObject) {
      console.log("Current Geo Location :", jsonObject);
      countryCode = jsonObject.countryCode;
      console.log(countryCode);
      getCountryInfo(countryCode)
      initializeMap(userLatitude, userLongitude, countryCode);
    },
  });
};

//initialize map , layers and markers 
function initializeMap(userLatitude, userLongitude, countryCode) {
  var streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
  );
  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );
  // var city = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   'attribution': 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'

  // });
  // var airport = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  //   maxZoom: 18,
  // });
  var LeafIcon = L.Icon.extend({
    options: {
      shadowUrl: '',
      iconSize: [36, 36],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]
    }
  });



  var airportIcon = new LeafIcon({ iconUrl: 'airport.png' })

  // var airports1 = L.marker([39.819527, -84.067406], { icon: airportIcon }).bindPopup('Wright-Patterson Air Force Base, OH, USA'),
  //   airports2 = L.marker([40.641766, -73.780968], { icon: airportIcon }).bindPopup('John F. Kennedy International Airport, NY, USA');
  // airports3 = L.marker([35.213890, -80.943054], { icon: airportIcon }).bindPopup('Charlotte Douglas International Airport, Charlotte, NC, USA');
  // airports4 = L.marker([41.978611, -87.904724], { icon: airportIcon }).bindPopup('O’Hare International Airport, Chicago, IL, USA');
  // airports5 = L.marker([32.116112, -110.941109], { icon: airportIcon }).bindPopup('Tucson International Airport, Tuscon, Arizona, US');
  // airports6 = L.marker([34.903271, -108.514519], { icon: airportIcon }).bindPopup('Candy Kitchen Ranch Airport, Ramah, NM, USA');
  // airports7 = L.marker([42.907768, -77.318970], { icon: airportIcon }).bindPopup('Canandaigua Airport - KIUA, Canandaigua, NY, USA');
  // airports8 = L.marker([32.848152, -96.851349], { icon: airportIcon }).bindPopup('Asheville Regional Airport, Fletcher, NC, USA');
  // airports9 = L.marker([40.822773, -72.748634], { icon: airportIcon }).bindPopup('Fly Bart\'s, East Moriches, NY, the USA');
  // airports10 = L.marker([27.979168, -82.539337], { icon: airportIcon }).bindPopup('Tampa International Airport, Tampa, FL, USA');

  // var airportsdata = L.layerGroup([airports1, airports2, airports3, airports4, airports5, airports6, airports7, airports8, airports9, airports10]);



  //City


  var greenIcon = new LeafIcon({ iconUrl: 'town-hall.png' });


  var littleton = L.marker([39.61, -105.02], { icon: greenIcon }).bindPopup('This is Littleton, CO.'),
    denver = L.marker([39.74, -104.99], { icon: greenIcon }).bindPopup('This is Denver, CO.'),
    aurora = L.marker([39.73, -104.8], { icon: greenIcon }).bindPopup('This is Aurora, CO.'),
    golden = L.marker([39.77, -105.23], { icon: greenIcon }).bindPopup('This is Golden, CO.');
  var cities = L.layerGroup([littleton, denver, aurora, golden]);

  //declare base maps with the tile variables 
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite,
  };

  // Create overlay object to hold our overlay layer
  overlayMaps = {
    // "Airports": airportsdata,
    "Cities": cities
  };

  //initialise map
  map = L.map("map", {
    layers: [streets]
  }).setView([userLatitude, userLongitude], 6);


  //add maps to layers control 
  var layerControl = L.control.layers(basemaps, overlayMaps).addTo(map);
  myLayer = new L.geoJson().addTo(map);


  // // Creating map object
  // var myMap = L.map("map", {
  //   center: [39.0522, -110.2437],
  //   zoom: 5,
  //   layers: [darkmap, earthquakeLayer, plates]
  // });

  // // Create a layer control
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

  // // Create a legend to display information about our map
  // var info = L.control({
  //   position: "bottomright"
  // });



  //add border polygon
  getBorder(countryCode);

  //add easy buttons

  //Information button

  L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
  }).addTo(map);

  //weather button
  L.easyButton("fa-solid fa-cloud-sun", function (btn, map) {
    $("#exampleModal1").modal("show");
    getweather();
  }).addTo(map);

  //news button
  L.easyButton("fa-solid fa-newspaper", function (btn, map) {
    $("#exampleModal2").modal("show");
    getnews()
  }).addTo(map);


  //exchangerate button
  L.easyButton("fa-solid fa-dollar-sign", function (btn, map) {
    $("#exampleModal3").modal("show");
    //getexchange()
    getCountryNamesAndCodesex()
  }).addTo(map);

  //wikipedia button
  L.easyButton("fa-brands fa-wikipedia-w", function (btn, map) {

    $("#exampleModal4").modal("show");
    getwikipedia();
  }).addTo(map);


}



//handle onchange event
$('#countrySelect').change(function () {

  var countryCode = $(this).val(); // Get the selected value
  console.log('Selected country code: ' + countryCode);

  // Use the country code to select the corresponding option and retrieve its text
  var countryName = $("#countrySelect option[value='" + countryCode + "']").text();
  console.log("Selected country name is:", countryName);

  //get coordinates using open cage and full country name
  getSelectedCountryCoords(countryName, countryCode);
  getAirports();


});

//
var airports = [];
function getAirports() {
  var countryName = $("#countrySelect option:selected").val();
  // var url = 'https://newsapi.org/v2/top-headlines?country=' + countryName + '&apiKey=27d2e20867b84e9eaeb4331e51931f55';
  $.ajax({
    url: "assets/php/getAirports.php",
    type: 'POST',
    dataType: 'json',
    data: {

      country: countryName,

    },
    success: function (result) {
      debugger
      // console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        airports9 = L.marker([40.822773, -72.748634], { icon: 'airport.png' }).bindPopup('Fly Bart\'s, East Moriches, NY, the USA');
        airports10 = L.marker([27.979168, -82.539337], { icon: 'airport.png' }).bindPopup('Tampa International Airport, Tampa, FL, USA');

        var airportsdata = L.layerGroup([airports9, airports10]);
        // var overlayMaps = {
        //   "Airports": airportsdata
        // };
        // var overlayMaps = {
        //   "Airports": airportsdata
        // };
        // // Create the control layer with base and overlay maps
        // //  L.control.layers(baseMaps, overlayMaps).addTo(map);
        // // Create a Leaflet map object
   
        // // Create the control layer with base and overlay maps
        // var controlLayers = L.control.layers('', overlayMaps);

        // // Add the control layer to the map
        // controlLayers.addTo(map);
      }

    },

    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }

  });


}

//get coordinates using open cage and full country name
function getSelectedCountryCoords(countryName, countryCode, countrynews, countryexchangeRates) {
  $.ajax({
    url: "assets/php/getCountryCoords.php",
    data: {
      countryName: countryName,
    },
    type: "GET",
    success: function (result) {
      console.log("country coordinates")
      console.log(result);
      com_latitude = result.data.lat;
      com_longitude = result.data.lng;

      //make the mai api calls
      //+udating map focus
      updateMapView(result.data.lat, result.data.lng, countryCode)
      //+get country info
      getCountryInfo(countryCode)
      getweather(result.data.lat, result.data.lng)//using lat and long  because weather API reqwuires them not countryWearther

      /// news(countrynews)
      // exchangeRates(countryexchangeRates)

    },
  });

};

// this is where the magic happens, you will need 5 functions like the one below
//e.g getWeatherInfo  , getCurrencyInfo  , getNewsInfo
function getCountryInfo(countryCode) {
  //make ajax call to get getcountryInfo.php
  $.ajax({
    url: "assets/php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (result) {

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        //linking the results with , appropriate modal IDs in the HTML File
        $('#continent').html(result['data'][0]['continent']);
        $('#capital').html(result['data'][0]['capital']);
        $('#languages').html(result['data'][0]['languages']);
        $('#geonameId').html(result['data'][0]['geonameId']);

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }
  });
}

function getweather() {//this is what is need by API lat&lng
  //make ajax call to get weather.php

  $.ajax({
    url: "assets/php/weather.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: com_latitude,
      lng: com_longitude,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      debugger
      // Display current weather's temperature
      if (result.status.name == "ok" && result.data.current) {
        // console.log(result.data.current); // Log the structure to inspect
        $('#todayweather').html(result.data.current.temp_c + '°C');
      }

      // Display forecasted temperatures for the next three days
      if (result.data.forecast && result.data.forecast.forecastday && result.data.forecast.forecastday.length >= 3) {
        $('#forcastDay1').html(result.data.forecast.forecastday[0].day.avgtemp_c + '°C');
        $('#forcastDay2').html(result.data.forecast.forecastday[1].day.avgtemp_c + '°C');
        $('#forcastDay3').html(result.data.forecast.forecastday[2].day.avgtemp_c + '°C');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }
  });

}

//make ajax call to getAirports.php


//make ajax call to getnews.php
function getnews() {
  var countryName = $("#countrySelect option:selected").val();
  var url = 'https://newsapi.org/v2/top-headlines?country=' + countryName + '&apiKey=27d2e20867b84e9eaeb4331e51931f55';
  $.ajax({
    url: "assets/php/getnews.php",
    type: 'POST',
    dataType: 'json',
    data: {

      country: countryName,
      url: url,
    },
    success: function (result) {
      debugger
      // console.log(JSON.stringify(result));

      if (result.status.name == "ok") {

        var news = result.data.results; // Assuming the news data is in the "data" property of the response
        var itemstorenew = '';
        $.each(news, function (i, item) {

          var img = item.image_url ? item.image_url : "";
          var title = item.title ? item.title : "";
          var description = item.description ? item.description : "";
          var link = item.link ? item.link : "";

          var imgdata = item.image_url ? '<img style="width: 90px; margin: 0 auto; margin-top: 10px;" src="' + img + '" class="card-img-top" alt="...">' : '';



          itemstorenew += '<div class="card my-4 mx-2" style="width: 27rem;">' + imgdata + ' <div class="card-body"> <h5 class="card-title">' + title + '</h5>  <h4 class="card-title">' + description + '</h4> <p class="card-text">' + description + '</p><a style="margin-top: 10px; background: #321fd1;" href="' + link + '" target="_blank" class="btn btn-primary">Read More</a></div> </div>';
        });

        $('#newsmyid').html(itemstorenew);
      }

    },

    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }

  });


}


//make ajax call to getwikipedia.php


function getwikipedia() {
  var countryName = $("#countrySelect option:selected").text();

  $.ajax({
    url: "assets/php/getwikipedia.php",
    type: 'GET',
    // dataType: 'json',
    data: {
      country: countryName,
    },

    success: function (result) {
      debugger
      console.log('getwikipedia', JSON.stringify(result));

      if (result.status.name == "ok") {


        var itemstore = '';
        $.each(result.data.pages, function (i, item) {
          //  let badgeitem = item.badge.split('.')[0].replace(/^\w/, (badge) => badge.toUpperCase());
          // itemstore += '<li data-id="' + item.id + '" data-name="' + item.description + '"></li>';

          var img = item.thumbnail ? item.thumbnail.url : "";
          var title = item.title ? item.title : "";
          var description = item.description ? item.description : "";


          //console.log(item.thumbnail.url)
          //debugger
          // let badgeitem = item.badge.split('.')[0].replace(/^\w/, (badge) => badge.toUpperCase());
          // itemstore += '<li data-id="' + item.id + '" data-name="' + item.badge + '"><img title="' + item.descr + '" style="width:65px;height:65px" src="/images/newsfeed/badges/' + item.badge + '" />' + badgeitem + '</li>';


          itemstore += '<div class="card my-4 mx-2" style="width: 27rem;"> <img style="width: 90px; margin: 0 auto; margin-top: 10px;" src="' +
            img + '" class="card-img-top" alt="..."> <div class="card-body"> <h5 class="card-title">' + title + '</h5>  <h4 class="card-title">' + description + '</h4> <p class="card-text">' + item.excerpt + '</p></div> </div>';
        });

        $('#wekidata').html(itemstore);


        console.log(itemstore);


        // if (result.query.pages) {
        //   var pages = result.query.pages;
        //   var pageId = Object.keys(pages)[0];
        //   var extract = pages[pageId].extract;
        //   // Perform actions with the extracted data
        //   console.log(extract);
        // }

      }




    },

    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }

  });
}


//handled click

$('#exchangebtn').click(function () {
  countrySelectex
  var countrycode = $("#countrySelectex option:selected").val();
  var examt = $("#examt").val();
  getCountryInfocurrencyCode(countrycode, examt)
  debugger
})

function getCountryInfocurrencyCode(countryCode, examt) {
  //make ajax call to get getcountryInfo.php
  $.ajax({
    url: "assets/php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      countryCode: countryCode,
    },
    success: function (result) {

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        var ccode = result['data'][0]['currencyCode'];
        if (ccode) {
          getexchange(ccode, examt)
        }


        //linking the results with , appropriate modal IDs in the HTML File
        // $('#continent').html(result['data'][0]['continent']);
        // $('#capital').html(result['data'][0]['capital']);
        // $('#languages').html(result['data'][0]['languages']);
        // $('#geonameId').html(result['data'][0]['geonameId']);

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }
  });
}
//make ajax call exchange rete
function getexchange(countrycode, examt) {

  $.ajax({
    url: "assets/php/exchangeRates.php",
    type: 'GET',
    dataType: 'json',
    data: {
      countrycode: countrycode,
      examt: examt,
    },

    success: function (result) {

      console.log('exchangeRates', JSON.stringify(result));
      var res = JSON.stringify(result)
      debugger
      if (result.status.name == "ok") {


        var itemstore = ' <h3>' + examt + ' USD = ' + result.data.currentRate + ' ' + countrycode + ' </h3>';

        $('#exrate').html(itemstore);
        // $.each(result.data.pages, function (i, item) {


        //   var img = item.thumbnail ? item.thumbnail.url : "";
        //   var title = item.title ? item.title : "";
        //   var description = item.description ? item.description : "";

        //   itemstore += '<div class="card my-4 mx-2" style="width: 27rem;"> <img style="width: 90px; margin: 0 auto; margin-top: 10px;" src="' +
        //     img + '" class="card-img-top" alt="..."> <div class="card-body"> <h5 class="card-title">' + title + '</h5>  <h4 class="card-title">' + description + '</h4> <p class="card-text">' + item.excerpt + '</p></div> </div>';
        // });

        // $('#wekidata').html(itemstore);


        // console.log(itemstore);


        // if (result.query.pages) {
        //   var pages = result.query.pages;
        //   var pageId = Object.keys(pages)[0];
        //   var extract = pages[pageId].extract;
        //   // Perform actions with the extracted data
        //   console.log(extract);
        // }

      }




    },

    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    }

  });
}



// Function to update map view based on new coordinates
function updateMapView(latitude, longitude, countryCode) {

  map.setView([latitude, longitude], 6);
  //add border polygon
  getBorder(countryCode);

}


//display border
function getBorder(countryCode) {

  $.ajax({
    url: "assets/php/getBorder.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },
    success: function (polygon) {

      console.log(polygon);
      // Clear existing layers if needed (optional)
      myLayer.clearLayers();

      // Add the new polygon data and set its style
      myLayer.addData(polygon).setStyle(polyStyle);

      // Fit the map to the bounds of the polygon
      const bounds = myLayer.getBounds();
      map.fitBounds(bounds);

      // Optionally, you can extract the bounding coordinates
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();
    }
  });
};

//polygon styling
function polyStyle() {
  return {
    "color": "#994444",
    "weight": 5,
    "opacity": 1.0,
    "fillColor": "#fcb6b6",
    "fillOpacity": 0.45
  };
}


