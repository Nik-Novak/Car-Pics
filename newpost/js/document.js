//global vars
var mapObj = null

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

var GMap = {
    markers: []
    ,
    map: null
    ,
    init: function () {
        var self = this;
        //##### MAP DISPLAY #####
        var uluru = {
            lat: 43.256767,
            lng: -79.843940
        };
        this.map = new google.maps.Map(document.getElementsByClassName("map").item(0), {
            zoom: 15,
            center: uluru
        });
        
        var map = this.map;

        //##### MARKERS #####
        google.maps.event.addListener(map, 'click', function (event) {
            
            self.deleteMarkers();
            self.addMarker(event.latLng);
        });

        //##### SEARCH BOX STUFF #####
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function () {
            searchBox.setBounds(map.getBounds());
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
            this.markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                this.markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }
    ,
    addMarker: function(location){
        var marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: 'Photo Location'
        });
        this.markers.push(marker);
    }
    ,
    setMapOnAll: function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    }
    ,
    clearMarkers: function () {
        this.setMapOnAll(null);
    }
    ,
    // Shows any markers currently in the array.
    showMarkers: function () {
        this.setMapOnAll(map);
    }
    ,
    // Deletes all markers in the array by removing references to them.
    deleteMarkers: function () {
        this.clearMarkers();
        this.markers = [];
    }
    ,
    getMarker: function(){
        if(this.markers.length>1)
            throw new Error("Map Object has more than one marker");
        return this.markers[0];
    }
    ,
    getMarkerLat: function(){
        if(this.getMarker())
            return this.getMarker().position.lat();
    }
    ,
    getMarkerLng: function(){
        if(this.getMarker())
            return this.getMarker().position.lng();
    }
}

function initMap(){
    mapObj = Object.create(GMap);
    mapObj.init();
}

function test(){
    console.log(mapObj.getMarkerLat() + " -- " + mapObj.getMarkerLng())
}

//Disable form submit on enter key of maps input box
$("#pac-input").keypress(function (e) {
    //Enter key
    if (e.which == 13) {
        return false;
    }
});