(function($) {
    // Wait for both DOM and Leaflet to be ready
    function waitForLeaflet(callback) {
        if (typeof L !== 'undefined') {
            callback();
        } else {
            setTimeout(function() {
                waitForLeaflet(callback);
            }, 100);
        }
    }

    $(document).ready(function() {
        waitForLeaflet(function() {
            initializeMapHandlers();
        });
    });

    function initializeMapHandlers() {
        var map = window['leafletmapid_the_geom-map'];
        var currentMarker;
        var mapInitialized = false;

        console.log('Leaflet is ready, initializing map handlers');

        // Function to update lat/lng fields
        function updateLatLngFields(lat, lng) {
            $('#id_latitude').val(lat.toFixed(6));
            $('#id_longitude').val(lng.toFixed(6));
        }

        // Function to update geometry field
        function updateGeometryField(lng, lat) {
            $('#id_the_geom').val('POINT(' + lng + ' ' + lat + ')');
        }

        // Function to add/update marker
        function updateMarker(lat, lng) {
            if (!map) return;

            // Remove existing marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            // Add new marker
            currentMarker = L.marker([lat, lng], {draggable: true}).addTo(map);

            // Handle marker drag
            currentMarker.on('dragend', function(e) {
                var position = e.target.getLatLng();
                updateLatLngFields(position.lat, position.lng);
                updateGeometryField(position.lng, position.lat);
            });
        }

        // Function to update map from lat/lng fields
        function updateMapFromFields() {
            var lat = parseFloat($('#id_latitude').val());
            var lng = parseFloat($('#id_longitude').val());

            if (!isNaN(lat) && !isNaN(lng) && map) {
                map.setView([lat, lng], map.getZoom());
                updateMarker(lat, lng);
                updateGeometryField(lng, lat);
            }
        }

        // Listen for lat/lng field changes
        var timeout;
        $('#id_latitude, #id_longitude').on('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(updateMapFromFields, 300);
        });

        // Hook into Django Leaflet's map initialization
        $(document).on('map:init', function(e) {
            var detail = e.originalEvent ? e.originalEvent.detail : e.detail;

            // Check if this is our geometry field's map
            if (detail && detail.id === 'id_the_geom') {
                map = detail.map;
                mapInitialized = true;

                console.log('Map initialized successfully via map:init event');

                setupMapHandlers();
            }
        });

        function setupMapHandlers() {
            if (!map) return;

            // Set up map click handler
            map.on('click', function(e) {
                var lat = e.latlng.lat;
                var lng = e.latlng.lng;

                updateLatLngFields(lat, lng);
                updateGeometryField(lng, lat);
                updateMarker(lat, lng);
            });

            // Initialize marker if lat/lng already exist
            var existingLat = $('#id_latitude').val();
            var existingLng = $('#id_longitude').val();

            if (existingLat && existingLng) {
                var lat = parseFloat(existingLat);
                var lng = parseFloat(existingLng);
                if (!isNaN(lat) && !isNaN(lng)) {
                    updateMarker(lat, lng);
                    map.setView([lat, lng], 10);
                }
            }
        }

        // Fallback method - try to find map after a delay
        function tryFallbackInit() {
            if (mapInitialized) return;

            var mapContainer = document.getElementById('id_the_geom-map');
            if (mapContainer && mapContainer._leaflet_map) {
                map = mapContainer._leaflet_map;
                mapInitialized = true;
                console.log('Map initialized via fallback method');
                setupMapHandlers();
            } else {
                // Try again after a delay
                setTimeout(tryFallbackInit, 500);
            }
        }

        // Start fallback after a delay
        setTimeout(tryFallbackInit, 1000);
    }

})(django.jQuery || jQuery || $);
