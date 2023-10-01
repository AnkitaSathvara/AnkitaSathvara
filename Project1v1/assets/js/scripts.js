let myLayer;
let map;

let bounds;
let countryName;
let border;
let currentCountry;
let currentCurrency;

let currencyCode;
let currencyName;
let currencySymbol;

let capitalCityName;

let cityMarkersCluster;
let wikiCluster;
let largeCityCluster;

let borderCountryCode;

let capitalLat;
let capitalLng;

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

  $.ajax({
    url: "assets/php/getCountryPositionCodeFromLatlon.php",
    data: {
      lat: userLatitude,
      lng: userLongitude,
      username: "flightltd",
    },
    type: "GET",
    success: function (jsonObject) {
      console.log("Current Geo Location :", jsonObject);
      countryCode = jsonObject.countryCode;
      console.log(countryCode);
      getCountryInfo(countryCode)
      initializeMap(userLatitude,userLongitude,countryCode);
    },
  });
};

//initialize map , layers and markers 
function initializeMap(userLatitude,userLongitude,countryCode) {
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

  //declare base maps with the tile variables 
  var basemaps = {
    "Streets": streets,
    "Satellite": satellite
  };

  //initialise map
  map= L.map("map", {
    layers: [streets]
  }).setView([userLatitude, userLongitude], 6);

  //add maps to layers control 
  var layerControl = L.control.layers(basemaps).addTo(map);
  myLayer = new L.geoJson().addTo(map);

  //add border polygon
  getBorder(countryCode);

  //add easy buttons
  L.easyButton("fa-info", function (btn, map) {
    $("#exampleModal").modal("show");
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

  

});

//get coordinates using open cage and full country name
function getSelectedCountryCoords(countryName, countryCode){
  $.ajax({
    url: "assets/php/getCountryCoords.php",
    data: {
      countryName:countryName,
    },
    type: "GET",
    success: function (result) {
      console.log("country coordinates")
      console.log(result);

      //make the mai api calls
      //+udating map focus
      updateMapView(result.data.lat, result.data.lng,countryCode)
      //+get country info
      getCountryInfo(countryCode)

    },
  });

};

// this is where the magic happens, you will need 5 functions like the one below
//e.g getWeatherInfo  , getCurrencyInfo  , getNewsInfo
function getCountryInfo(countryCode){
  //make ajax call to get getcountryInfo.php
		$.ajax({
			url: "assets/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				countryCode: countryCode,
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {
          //linking the results with , appropriate modal IDs in the HTML File
					$('#continent').html(result['data'][0]['continent']);
					$('#capital').html(result['data'][0]['capital']);
					$('#languages').html(result['data'][0]['languages']);
					$('#geonameId').html(result['data'][0]['geonameId']);
				
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
      
		}); 

}



//Country Information Easy Button
L.easyButton('<i class="fas fa-info"></i>', function(){
  $.ajax({
      url: "assets/php/wikiCountryExcerpts.php",
      type: 'GET',
      dataType: "json",
      data: {
          countryName: countryName
      },
      success: function(result) {
          $("#txtWikiImg").html("&nbsp;");
          $("#txtWiki").html("&nbsp;");

          $('#txtWikiImg').html(`<img id='flag' src='${result.data.wikiCountryExcerpt.thumbnail.source}'><br>`);
          $('#txtWiki').html('<br>Wikipedia: ' + result.data.wikiCountryExcerpt.extract_html +'<br>');
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log('CountryExcerpt Data Error',textStatus, errorThrown);
      }
  });
  $('#wikiModal').modal('show');
}, 'Country Infomation').addTo(map);

//Weather Easy Button
document.getElementById('weatherButton').addEventListener('click', function() {
  $.ajax({
      url: "assets/php/weather.php",
      type: 'GET',
      dataType: "json",
      data: {
          capitalLat: capitalLat,
          capitalLng: capitalLng
      },
      success: function(result) {
          // Update the weather modal with the received data
          // Show the modal
          $('#weatherModal').modal('show');
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log('Weather Data Error',textStatus, errorThrown);
      }
  });
});

//Exchange Rates Easy Button


L.easyButton('<i class="fas fa-money-bill-wave"></i>', function(){
  $.ajax({
      url: "assets/php/exchangeRates.php",
      type: 'GET',
      dataType: "json",
      data: {
          currentCurrency: currentCurrency
      },
      success: function(result) {
          //console.log(result);
          $("#currencyTable currenctTBody currencyRow .currencyTD").html("&nbsp;");

          let exchangeRate = result.data.currentRate;
          $('#txtCurrencySymbol').html(currencySymbol);
          $('#txtCurrency').html(currencyName);
          $('#txtCurrencyCode').html(currencyCode);
          if (isNaN(exchangeRate)) {
              $('#txtRate').html( 'Exchange Rate Not Found');
          } else {
              $('#txtRate').html( exchangeRate.toFixed(2) + ' ' + currencyCode + ' to 1 EURO.');
          };
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log('ExchangeRate Data Error',textStatus, errorThrown);
      }
  });
  $('#currencyModal').modal('show');
}, 'Currency Information').addTo(map);


//Covid Easy Button
L.easyButton('<i class="fas fa-virus"></i>', function(){
  $.ajax({
      url: "assets/php/covid.php",
      type: 'GET',
      dataType: "json",
      data: {
          countryCodeA2: borderCountryCode
      },
      success: function(result) {
          $("#covidTable tbody tr td").html("&nbsp;");

          let covidDeaths = result.data.covidData.data.latest_data.deaths;
          let covidConfirmed = result.data.covidData.data.latest_data.confirmed;
          let covidcritical = result.data.covidData.data.latest_data.recovered;
          let covidPerMil = result.data.covidData.data.latest_data.calculated.cases_per_million_population;
          
          $('#covidModalLabel').html('Latest Covid data for: ' + countryName);
          $('#txtCovidDeaths').html(numberWithCommas(covidDeaths));
          $('#txtCovidCases').html(numberWithCommas(covidConfirmed));
          $('#txtCovidRecovered').html(numberWithCommas(covidcritical));
          $('#txtCovidPerMillion').html(numberWithCommas(covidPerMil));
          $('#txtCovidDeathRate').html( Math.round(result.data.covidData.data.latest_data.calculated.death_rate) +'&#37');
          $('#txtCovidRecoveryRate').html( Math.round(result.data.covidData.data.latest_data.calculated.recovery_rate) +'&#37');

      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log('Covid Data Error',textStatus, errorThrown);
      }
  });

  $('#covidModal').modal('show');
}, 'Covid-19 Information').addTo(map);


      
      
      



$(document).ready(function () { 
//populate select options
  $.ajax({
      url: "assets/php/geoJson.php",
      type: 'GET',
      dataType: "json",
      success: function(result) {
          //console.log('populate options' , result);
          if (result.status.name == "ok") {
              for (var i=0; i<result.data.border.features.length; i++) {
                          $('#selCountry').append($('<option>', {
                              value: result.data.border.features[i].properties.iso_a2,
                              text: result.data.border.features[i].properties.name,
                          }));
              }
          }

          //sort options alphabetically
          $("#selCountry").html($("#selCountry option").sort(function (a, b) {
              return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
              }));

          
//User's Location info
  const successCallback = (position) => {
      $.ajax({
          url: "assets/php/openCage.php",
          type: 'GET',
          dataType: 'json',
          data: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
          },

          success: function(result) {
              
              //console.log('openCage User Location',result);
              currentLat = result.data[0].geometry.lat;
              currentLng = result.data[0].geometry.lng;

              $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-2"]);
              
              currentCountry = result.data[0].components["ISO_3166-1_alpha-2"];
              $("#selCountry").val(currentCountry).change();
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
          }
      }); 
      }

  const errorCallback = (error) => {
          console.error(error);
}
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

      },    
  });
//end document. ready
});

//Main Ajax Call
$('#selCountry').on('change', function() {
  borderCountryCode = $("#selCountry").val();
  if (map.hasLayer(unescoLayerGroup)) {
              map.removeLayer(unescoLayerGroup);
              toggle.state('add-markers');
          }
  
  $.ajax({
      url: "assets/php/ajaxCalls.php",
      type: 'GET',
      dataType: 'json',
      data: {
              countryCode: borderCountryCode
          },
      beforeSend: function() {
          $('#loading').show();
      },
      success: function(result) {
          $('#loading').hide();
          //console.log(borderCountryCode, 'Results', result);
          
          //adds borders
          if (map.hasLayer(border)) {
              map.removeLayer(border);
          }
          
          border = L.geoJSON(result.data.border, {
                  color: '#ff7800',
                  weight: 2,
                  opacity: 0.65
              });

          bounds = border.getBounds();
          map.flyToBounds(bounds, {
                  padding: [0, 35], 
                  duration: 2
              });

          border.addTo(map); 
          
          if (result.status.name == "ok") {
              $("#countryInfoTable tbody tr td").html("&nbsp;");
              //set variables to reuse
              countryName = result.data.border.properties.name;
              capitalCityName = result.data.restCountries.capital;
              currentCurrency = result.data.restCountries.currencies[0].code;
              capitalLat = result.data.restCountries.latlng[0];
              capitalLng = result.data.restCountries.latlng[1];
              currencyCode = result.data.restCountries.currencies[0].code;
              currencyName = result.data.restCountries.currencies[0].name;
              currencySymbol = result.data.restCountries.currencies[0].symbol;
              
              //wiki country summary
              let popoulation =  numberWithCommas(result.data.restCountries.population);
              let area;
              if (result.data.restCountries.area === null) {
                  area = 'Area Data Unavailable'
                  $('#txtArea').html(area);
              } else {
                  area = numberWithCommas(result.data.restCountries.area);
                  $('#txtArea').html(area +'km<sup>2</sup>');
              }
              
              let callingCode = result.data.restCountries.callingCodes[0];
              let demonym =  result.data.restCountries.demonym;
              let domain = result.data.restCountries.topLevelDomain[0];
              let languages = "";
                  if (result.data.restCountries.languages.length === 1) {
                      languages = result.data.restCountries.languages[0].name;
                  } else if (result.data.restCountries.languages.length ===2 ) {
                      languages = result.data.restCountries.languages[0].name +" and " + result.data.restCountries.languages[1].name
                  } else if (result.data.restCountries.languages.length === 3) {
                      languages = result.data.restCountries.languages[0].name +" , " + result.data.restCountries.languages[1].name + " and " +  result.data.restCountries.languages[2].name
                  } else { result.data.restCountries.languages.forEach(language => {
                      languages += language.name + " ";
                          }) 
                      }

              $('#wikiModalLabel').html(result.data.restCountries.name);
              $('#txtPopulation').html(popoulation);
              $('#txtCapital').html(capitalCityName);
              $('#txtLanguages').html(languages);
              
              $('#txtIso2').html(result.data.border.properties.iso_a2);
              $('#txtIso3').html(result.data.border.properties.iso_a3)
              $('#txtCallingCode').html("+" + callingCode);
              $('#txtDemonym').html(demonym);
              $('#txtDomain').html(domain);
              
          //capital city cluster
          if (map.hasLayer(cityMarkersCluster)) {
              map.removeLayer(cityMarkersCluster);
          }

          cityMarkersCluster = new L.markerClusterGroup();
          map.addLayer(cityMarkersCluster);

          //cities markers with wiki summary
          if (map.hasLayer(largeCityCluster)) {
              map.removeLayer(largeCityCluster);
          }
          largeCityCluster = new L.layerGroup();
          map.addLayer(largeCityCluster);

          result.data.largeCities.forEach(largeCity => {
              let cityName = largeCity.fields.name;
              let cityLat =  largeCity.geometry.coordinates[1];
              let cityLng =  largeCity.geometry.coordinates[0];
              let cityInfo = null;
              let cityThumbnailImg;
              let cityUrl;
              let cityText;
              
              result.data.wikiCitiesTextData.forEach(city => {
                      for (let i = 0; i < city.geonames.length; i++) {
                          //console.log(city.geonames[i].title);
                          // if (city.geonames[i].countryCode === borderCountryCode && city.geonames[i].title.includes(cityName) ) {

                          if (city.geonames[i].title == cityName && (city.geonames[i].countryCode === borderCountryCode || city.geonames[i].summary.includes(countryName))) {    
                          //console.log('Code', city.geonames[i].countryCode, 'city', city.geonames[i].title);
                          cityInfo = city.geonames[i].summary;
                          cityThumbnailImg = city.geonames[i].thumbnailImg;
                          cityUrl = city.geonames[i].wikipediaUrl;
                          cityText = 'Read more';
                          };

                          
                      }
                      

                      if (cityInfo === null) {
                          cityInfo = " ";
                          cityThumbnailImg = " ";
                          cityUrl = " ";
                          cityText = " "
                          
                      };

                  

                  var cityIcon;

                  var cityOptions =
                                  {
                                  'maxWidth': '300',
                                  'className' : 'custom'
                                  };        
                  
                  if (cityName.trim() === capitalCityName.trim()) {
                          cityIcon = L.icon({
                          iconUrl: 'assets/img/icons/capital.svg',
                          iconSize: [40, 40],
                          popupAnchor: [0,-15],
                          className: 'cityIcon'
                          });
                  } else {
                          cityIcon = L.icon({
                          iconUrl: 'assets/img/icons/cityscape.svg',
                          iconSize: [40, 40],
                          popupAnchor: [0,-15],
                          className: 'cityIcon'
                          });
                  }

                  var largeCityMarker = L.marker(new L.LatLng(cityLat, cityLng), ({icon: cityIcon})).bindPopup(`<div class="markerContainer"><h3>${cityName}</h3><img class="markerThumbnail" src='${cityThumbnailImg}' onerror="this.style.display='none'"><p class="markerTxtDescription">${cityInfo}</p><div id="city-link"><a href="//${cityUrl}" target="_blank">${cityText}</a></div></div>`, cityOptions).on('click', function(e) {
                      map.flyTo(e.latlng, 10);
                      $.ajax({
                          url: "assets/php/cityMarkers.php",
                          type: 'GET',
                          dataType: 'json',
                          data: {
                              lat: this.getLatLng().lat,
                              lng: this.getLatLng().lng,
                              countryCodeA3: result.data.border.properties.iso_a3
                          },
                      
                          success: function(result) {
                              //console.log('cityMarkers',result);
                              //capital hospital markers
                              result.data.capCityHospitals.items.forEach(hospital => {
                                  var hospitalIcon = L.icon({
                                      iconUrl: 'assets/img/icons/hospital.png',
                                      iconSize: [50, 50],
                                      popupAnchor: [0,-15]
                                      });
                                  hospitalLabel = hospital.address.label;
                                  hospitalLat = hospital.position.lat;
                                  hospitalLng = hospital.position.lng;
                                  
                                  var alreadyExists = false;

                                  var latlng = new L.LatLng(hospitalLat, hospitalLng);

                                  cityMarkersCluster.getLayers().forEach((layer)=>{
                                      if(!alreadyExists && layer instanceof L.Marker && layer.getLatLng().equals(latlng)){
                                      alreadyExists = true;
                                      }
                                  });

                                  if(!alreadyExists){
                                      var hospitalMarker = L.marker(latlng, {
                                      icon: hospitalIcon
                                      }).bindPopup(hospitalLabel);

                                      cityMarkersCluster.addLayer(hospitalMarker);
                                  }

                              });
                              //capital airport markers
                              result.data.capCityAirports.items.forEach(airport => {
                                  var airportIcon = L.icon({
                                      iconUrl: 'assets/img/icons/airport.png',
                                      iconSize: [50, 50],
                                      popupAnchor: [0,-15]
                                      });
                                  airportName = airport.title;
                                  airportLat = airport.position.lat;
                                  airportLng = airport.position.lng;
                                  
                                  var alreadyExists = false;

                                  var latlng = new L.LatLng(airportLat, airportLng);

                                  cityMarkersCluster.getLayers().forEach((layer)=>{
                                      if(!alreadyExists && layer instanceof L.Marker && layer.getLatLng().equals(latlng)){
                                      alreadyExists = true;
                                      }
                                  });

                                  if(!alreadyExists){
                                      var airportMarker = L.marker(latlng, {
                                      icon: airportIcon
                                      }).bindPopup(airportName);

                                      cityMarkersCluster.addLayer(airportMarker);
                                  }


                              });
                              //capital parks markers
                              result.data.capCityParks.items.forEach(park => {
                                  var parkIcon = L.icon({
                                      iconUrl: 'assets/img/icons/park.png',
                                      iconSize: [50, 50],
                                      popupAnchor: [0,-15]
                                      });
                                  parkLabel = park.address.label;
                                  parkLat = park.position.lat;
                                  parkLng = park.position.lng;
                                  
                                  var alreadyExists = false;

                                  var latlng = new L.LatLng(parkLat, parkLng);
                                  
                                  cityMarkersCluster.getLayers().forEach((layer)=>{
                                      if(!alreadyExists && layer instanceof L.Marker && layer.getLatLng().equals(latlng)){
                                      alreadyExists = true;
                                      }
                                  });

                                  if(!alreadyExists){
                                      var parkMarker = L.marker(latlng, {
                                      icon: parkIcon
                                      }).bindPopup(parkLabel);

                                      cityMarkersCluster.addLayer(parkMarker);
                                  }

                              });
                              //capital Museums markers
                              result.data.capCityMuseums.items.forEach(museum => {
                                  var museumIcon = L.icon({
                                      iconUrl: 'assets/img/icons/museum.png',
                                      iconSize: [50, 50],
                                      popupAnchor: [0,-15]
                                      });
                                  museumLabel = museum.address.label;
                                  museumLat = museum.position.lat;
                                  museumLng = museum.position.lng;
                                  
                                  var alreadyExists = false;

                                  var latlng = new L.LatLng(museumLat, museumLng);
                                  
                                  cityMarkersCluster.getLayers().forEach((layer)=>{
                                      if(!alreadyExists && layer instanceof L.Marker && layer.getLatLng().equals(latlng)){
                                      alreadyExists = true;
                                      }
                                  });

                                  // if alreadyExists is true, it is a duplicate
                                  if(!alreadyExists){
                                      var museumMarker = L.marker(latlng, {
                                      icon: museumIcon
                                      }).bindPopup(museumLabel);

                                      cityMarkersCluster.addLayer(museumMarker);
                                  }

                                  
                              });
                              
                              
                              
                          },
                          error: function(jqXHR, textStatus, errorThrown) {
                              console.log("cityMarkers",textStatus, errorThrown);
                          }
                      }); //end ajax call
                      $.ajax({
                          url: "assets/php/wikiMarkers.php",
                          type: 'GET',
                          dataType: 'json',
                          data: {
                              lat: this.getLatLng().lat,
                              lng: this.getLatLng().lng,
                              countryCodeA2: borderCountryCode,
                          },
                      
                          success: function(result) {
                              //console.log('wikiMarkers',result);

                              if (result.data.wikiCitiesData.hasOwnProperty("status") ) {
                                  console.log('API Server Error, Please click again:', result.data.wikiCitiesData.status.message)
                              } else {
                                  //wiki Find Nearby Places for cities
                                  wikiCluster = new L.markerClusterGroup();
                                                                  
                                  result.data.wikiCitiesData.geonames.forEach(place => {
                                      
                                      var wikiPlaceIcon = L.icon({
                                          iconUrl: 'assets/img/icons/wikipedia.png',
                                          iconSize: [50, 50], // size of the icon
                                          popupAnchor: [0,-15]
                                          });
                                      var customOptions =
                                          {
                                          'maxWidth': '300',
                                          'className' : 'custom'
                                          };
                                          
                                      wikiPlaceName = place.title;
                                      wikiPlaceLat = place.lat;
                                      wikiPlaceLng = place.lng;
                                      wikiSummary = place.summary;
                                      wikiUrl = place.wikipediaUrl;
                                      wikiThumbnail = place.thumbnailImg;
                                      
                                      var customPopup = `<div class="card" style="width: 18rem;"><div class="card-body"><h5 class="card-title">${wikiPlaceName}</h5><img class="img-thumbnail float-right" style="max-width: 100px" src="${wikiThumbnail}" onerror="this.style.display='none'"><p class="card-text" id="wiki-sum">${wikiSummary}</p><a href="//${wikiUrl}" target="_blank"class="card-link">Read more</a><a href="#" class="card-link"></a></div></div>`;
                                      
                                      var alreadyExists = false;

                                      var latlng = new L.LatLng(wikiPlaceLat, wikiPlaceLng);

                                      cityMarkersCluster.getLayers().forEach((layer)=>{
                                          if(!alreadyExists && layer instanceof L.Marker && layer.getLatLng().equals(latlng)){
                                          alreadyExists = true;
                                          }
                                      });

                                      if(!alreadyExists){
                                          var wikiPlaceMarker = L.marker(latlng, {
                                          icon: wikiPlaceIcon
                                          }).bindPopup(customPopup,customOptions);

                                          cityMarkersCluster.addLayer(wikiPlaceMarker);
                                      };

                                  });
                              };

                              
                              
                              
                              
                          },
                          error: function(jqXHR, textStatus, errorThrown) {
                              console.log("wikiMarkers",textStatus, errorThrown);
                          }
                      }); //end ajax call

                   }); // end on click
  
                  largeCityCluster.addLayer(largeCityMarker);
                  
                  });

              });
              
          }
      
      },

      error: function(jqXHR, textStatus, errorThrown) {
          console.log('Main Call Error',textStatus, errorThrown);
      }

  });
      
//end on change code
});






// Function to update map view based on new coordinates
function updateMapView(latitude, longitude,countryCode ) {

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

