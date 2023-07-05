document.addEventListener('DOMContentLoaded', function() {
    const username = 'YOUR_GEO_NAMES_USERNAME';
  
    const nearbyArticlesButton = document.getElementById('nearbyArticlesButton');
    nearbyArticlesButton.addEventListener('click', function() {
      const latitude = document.getElementById('latitude').value;
      const longitude = document.getElementById('longitude').value;
  
      const data = {
        latitude: latitude,
        longitude: longitude,
        username: username
      };
  
      sendDataToPHP('findNearbyWikipediaArticles.php', data, handleResponse);
    });
  
    const earthquakesButton = document.getElementById('earthquakesButton');
    earthquakesButton.addEventListener('click', function() {
      const north = document.getElementById('north').value;
      const south = document.getElementById('south').value;
      const east = document.getElementById('east').value;
      const west = document.getElementById('west').value;
  
      const data = {
        north: north,
        south: south,
        east: east,
        west: west,
        username: username
      };
  
      sendDataToPHP('getEarthquakes.php', data, handleResponse);
    });
  
    const nearestAddressButton = document.getElementById('nearestAddressButton');
    nearestAddressButton.addEventListener('click', function() {
      const latitude = document.getElementById('addressLatitude').value;
      const longitude = document.getElementById('addressLongitude').value;
  
      const data = {
        latitude: latitude,
        longitude: longitude,
        username: username
      };
  
      sendDataToPHP('findNearestAddress.php', data, handleResponse);
    });
  
    function sendDataToPHP(url, data, callback) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);
          } else {
            console.error('Error:', xhr.status);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  
    function handleResponse(response) {
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = JSON.stringify(response, null, 2);
    }
  });
  
