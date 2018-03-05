//global vars
var mapObj = null

var GMap = {
    markers: [],
    impMarkers: [],
    map: null,
    init: function () {
        var self = this;
        //##### MAP DISPLAY #####
        var uluru = {
            lat: 43.256767,
            lng: -79.843940
        };
        this.map = new google.maps.Map(document.getElementsByClassName("map").item(0), {
            zoom: 11,
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
            if (self.markers.length > 0)
                self.markers.forEach(function (marker) {
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
                self.markers.push(new google.maps.Marker({
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

        //custom controls
        function CenterControl(controlDiv, map) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to recenter the map';
            controlDiv.appendChild(controlUI);
            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = ' Center On Me';
            var locationIcon = $('<img src="../img/icons/Location.png" alt="MyLocation Icon">');
            locationIcon.css('width', '11px');
            $(controlText).prepend(locationIcon);
            controlUI.appendChild(controlText);
            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener('click', function () {
                mapObj.deleteImpMarkers();
                    mapObj.pinMe();
            });

        }
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM].push(centerControlDiv);

        //by default get user's location and pin it on the map
        this.pinMe();
    },
    pinMe: function () {
        var self = this;
        this.getLocationThen(function (position) {
            var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.addImpMarker(geolocate);
            self.map.setCenter(geolocate);
        });
    },
    addMarker: function (location) {
        var marker = new google.maps.Marker({
            position: location,
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Photo Location'
        });
        this.markers.push(marker);
    },
    setMapOnAll: function (map, markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    },
    clearMarkers: function () {
        this.setMapOnAll(null, this.markers);
    },
    // Shows any markers currently in the array.
    showMarkers: function () {
        this.setMapOnAll(map, this.markers);
    },
    // Deletes all markers in the array by removing references to them.
    deleteMarkers: function () {
        this.clearMarkers();
        this.markers = [];
    },
    getMarker: function () {
        if (this.markers.length > 1)
            throw new Error("Map Object has more than one marker");
        return this.markers[0];
    },
    getMarkerLat: function () {
        if (this.getMarker())
            return this.getMarker().position.lat();
    },
    getMarkerLng: function () {
        if (this.getMarker())
            return this.getMarker().position.lng();
    },
    getLocationThen: function (positionCallBack) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(positionCallBack);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    addImpMarker: function (geolocate) {
        var icon = {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6
        };

        var marker = new google.maps.Marker({
            map: this.map,
            title: "My Location",
            clickable: false,
            icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                new google.maps.Size(22, 22),
                new google.maps.Point(0, 18),
                new google.maps.Point(11, 11)),
            shadow: null,
            zIndex: 999,
            position: geolocate,
            animation: google.maps.Animation.BOUNCE
        });

        this.impMarkers.push(marker);

        setTimeout(() => {
            marker.setAnimation(null);
        }, 3500);
    },
    deleteImpMarkers: function () {
        this.setMapOnAll(null, this.impMarkers);
        this.impMarkers = [];
    }
}

function initMap() {
    mapObj = Object.create(GMap);
    mapObj.init();
}

function test() {
    console.log(mapObj.getMarkerLat() + " -- " + mapObj.getMarkerLng())
}

//listeners


//Disable form submit on enter key of maps input box
$("#pac-input").keypress(function (e) {
    //Enter key
    if (e.which == 13) {
        return false;
    }
});