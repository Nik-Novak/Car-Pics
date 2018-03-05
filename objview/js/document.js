function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    alert("Latitude: " + position.coords.latitude + 
    " -- Longitude: " + position.coords.longitude); 
}

function initMap() {
    var uluru = {lat: 43.256767, lng: -79.843940};
    var map = new google.maps.Map(document.getElementsByClassName("map").item(0), {
      zoom: 15,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
}

