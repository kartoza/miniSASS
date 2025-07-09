(function($) {
    let map;
    let currentMarker;
    let mapInitialized = false;

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
        map = window['leafletmapid_the_geom-map'];

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
            map = window['leafletmapid_the_geom-map'];
            if (!map) return;

            // Remove existing marker
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            for (const [layerId, layer] of Object.entries(map._layers)) {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            }

            // Add new marker
            currentMarker = L.marker([lat, lng], {draggable: true});
            currentMarker.addTo(map);

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
            map = window['leafletmapid_the_geom-map'];

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

        // Set up map click handler
        map.on('draw:edited', function(e) {
            console.log('draw:edited event received');
            var lat = e.layers.getLayers()[0]._latlng.lat;
            var lng = e.layers.getLayers()[0]._latlng.lng;

            updateLatLngFields(lat, lng);
            updateGeometryField(lng, lat);
            updateMarker(lat, lng);
        });

        map.on('draw:drawstop ', function(e) {
           console.log('draw:drawstop event received');
        });
    }

})(django.jQuery || jQuery || $);
