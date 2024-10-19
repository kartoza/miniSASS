(function($) {
    $(document).ready(function() {
        var $latField = $('#id_latitude');
        var $lonField = $('#id_longitude');
        var mapWidget = window.geodjango_the_geom.map;
        
        if (!mapWidget) {
            return;
        }

        // Helper function to find the vector layer containing the point
        function getVectorLayer() {
            var vectorLayer = null;

            // Loop through all layers in the map to find a vector layer
            for (var i = 0; i < mapWidget.layers.length; i++) {
                var layer = mapWidget.layers[i];
                if (layer.CLASS_NAME === 'OpenLayers.Layer.Vector') {
                    vectorLayer = layer;
                    break;
                }
            }

            return vectorLayer;
        }

        var vectorLayer = getVectorLayer();

        // If the vector layer exists, attach event listeners to it
        if (vectorLayer) {
            // Listen for changes to features (points) on the vector layer
            vectorLayer.events.on({
                'featuremodified': function(event) {
                    var geometry = event.feature.geometry;
                    var lonLat = new OpenLayers.LonLat(geometry.x, geometry.y).transform(
                        mapWidget.getProjectionObject(),
                        new OpenLayers.Projection("EPSG:4326")  // To WGS84
                    );

                    // Update lat/lon fields based on new point location
                    $latField.val(lonLat.lat.toFixed(8));
                    $lonField.val(lonLat.lon.toFixed(8));
                },
                'featureadded': function(event) {
                    var geometry = event.feature.geometry;
                    var lonLat = new OpenLayers.LonLat(geometry.x, geometry.y).transform(
                        mapWidget.getProjectionObject(),
                        new OpenLayers.Projection("EPSG:4326")  // To WGS84
                    );

                    // Update lat/lon fields when a new point is added
                    $latField.val(lonLat.lat.toFixed(8));
                    $lonField.val(lonLat.lon.toFixed(8));
                }
            });
        }

        // Update the map based on lat/lon fields when they are changed
        function updateMapFromFields() {
            vectorLayer.removeAllFeatures();
            var lat = parseFloat($latField.val());
            var lon = parseFloat($lonField.val());

            if (!isNaN(lat) && !isNaN(lon)) {
                var lonLat = new OpenLayers.LonLat(lon, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"),  // From WGS84
                    mapWidget.getProjectionObject()  // To map projection
                );

                var pointGeometry = new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat);

                // Update the existing feature with new geometry
                if (vectorLayer.features.length > 0) {
                    vectorLayer.features[0].geometry = pointGeometry;
                    vectorLayer.drawFeature(vectorLayer.features[0]);
                } else {
                    // Add a new feature if none exist
                    var feature = new OpenLayers.Feature.Vector(pointGeometry);
                    vectorLayer.addFeatures([feature]);
                }

                // Recenter the map to the new location
                mapWidget.setCenter(lonLat, mapWidget.getZoom());
            }
        }

        // Debounce function: delays execution until user stops typing
        function debounce(func, delay) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    func.apply(context, args);
                }, delay);
            };
        }

        // Attach debounced event listeners to the lat/lon fields
        var debouncedUpdateMap = debounce(updateMapFromFields, 500);  // 500ms delay

        // Attach event listeners to the lat/lon fields to update the map when they change
        $latField.on('input', debouncedUpdateMap);
        $lonField.on('input', debouncedUpdateMap);

    });
})(django.jQuery);
