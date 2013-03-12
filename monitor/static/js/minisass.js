    Ext.onReady(function() {

        var map = new OpenLayers.Map(
          "",
          {projection: new OpenLayers.Projection("EPSG:3857"),
           displayProjection: new OpenLayers.Projection("EPSG:4326"),
           units: "m"}
        );

        // Define the Google layers as base layers
        var layerGoogleSatellite = new OpenLayers.Layer.Google(
          "Google satellite",
          {type: google.maps.MapTypeId.SATELLITE,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleTerrain = new OpenLayers.Layer.Google(
          "Google terrain",
          {type: google.maps.MapTypeId.TERRAIN,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleRoadmap = new OpenLayers.Layer.Google(
          "Google road map",
          {type: google.maps.MapTypeId.ROADMAP,sphericalMercator:true,isBaseLayer:true}
        );

        // Add the base layers to the map
        map.addLayers([layerGoogleSatellite,layerGoogleTerrain,layerGoogleRoadmap]);

        // Setup the map panel
        var mapPanel = new GeoExt.MapPanel({
          renderTo: 'map',
          height: 700,
          width: 790,
          extent: new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500),
          map: map,
          title: 'miniSASS Sample Sites'
        });

        // Define list to manage the layers
        var baseLayers = new GeoExt.tree.BaseLayerContainer({
          text: 'Base Layers',
          layerStore: mapPanel.layers,
          leaf: false,
          expanded: true
        });

        // Define tree panel to control layer visibility
        var baselayerTree = new Ext.tree.TreePanel({
            title: 'Base Layers',
            renderTo: 'layertree',
            root: baseLayers,
            rootVisible: false
        });

    });

