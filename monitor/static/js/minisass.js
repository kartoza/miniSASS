      /*===================================
      Functions for the data input template
      ===================================*/
      
      function convertDDtoDMS(D,latOrLon) {
        var DMS=new Array();
        DMS[0] = D<0?(latOrLon=='lat'?'S':'W'):(latOrLon=='lon'?'E':'N');
        DMS[1] = 0|(D<0?D=-D:D);
        DMS[2] = 0|D%1*60;
        DMS[3] = (0|D*60%1*60000)/1000;
        return DMS;
      }

      function convertDMStoDD(latOrLon) {
        var DD;
        var D = parseInt(document.getElementById('id_'+latOrLon+'_d').value);
        var M = parseInt(document.getElementById('id_'+latOrLon+'_m').value);
        var S = parseFloat(document.getElementById('id_'+latOrLon+'_s').value);
        var H = document.getElementById('id_'+latOrLon+'_h').value;
        if ((D != NaN) && (D >= 0) && (D <= 90)) {
          DD = D;
          if ((M != NaN) && (M >= 0) && (M <= 60)) {
            DD = DD + M/60;
            if ((S != NaN) && (S >= 0) && (S <= 60)) {
              DD = DD + S/3600;
              if ((H=='S') || (H=='s') || (H=='W') || (H=='w')) {DD = -1 * DD};
            }
          }
        } else DD = '';
        return DD;
      }

      function coords(format) {
        if (format == "DMS") {
          document.getElementById('id_latitude').style.display = 'none';
          document.getElementById('id_lat_d').style.display = '';
          document.getElementById('id_lat_m').style.display = '';
          document.getElementById('id_lat_s').style.display = '';
          document.getElementById('id_lat_h').style.display = '';
          document.getElementById('id_longitude').style.display = 'none';
          document.getElementById('id_lon_d').style.display = '';
          document.getElementById('id_lon_m').style.display = '';
          document.getElementById('id_lon_s').style.display = '';
          document.getElementById('id_lon_h').style.display = '';
          var latDMS = convertDDtoDMS(document.getElementById('id_latitude').value,'lat');
          document.getElementById('id_lat_d').value = latDMS[1];
          document.getElementById('id_lat_m').value = latDMS[2];
          document.getElementById('id_lat_s').value = latDMS[3];
          document.getElementById('id_lat_h').value = latDMS[0];
          var lonDMS = convertDDtoDMS(document.getElementById('id_longitude').value,'lon');
          document.getElementById('id_lon_d').value = lonDMS[1];
          document.getElementById('id_lon_m').value = lonDMS[2];
          document.getElementById('id_lon_s').value = lonDMS[3];
          document.getElementById('id_lon_h').value = lonDMS[0];
        }
        if (format == "Decimal") {
          document.getElementById('id_latitude').style.display = '';
          document.getElementById('id_lat_d').style.display = 'none';
          document.getElementById('id_lat_m').style.display = 'none';
          document.getElementById('id_lat_s').style.display = 'none';
          document.getElementById('id_lat_h').style.display = 'none';
          document.getElementById('id_longitude').style.display = '';
          document.getElementById('id_lon_d').style.display = 'none';
          document.getElementById('id_lon_m').style.display = 'none';
          document.getElementById('id_lon_s').style.display = 'none';
          document.getElementById('id_lon_h').style.display = 'none';
          document.getElementById('id_latitude').value = convertDMStoDD('lat');
          document.getElementById('id_longitude').value = convertDMStoDD('lon');
        }
      }

      function updateScore() {
        var totalScore=0;
        var numGroups=0;
        var averageScore=0;
        if (document.getElementById('id_observations-0-flatworms').checked==true) {totalScore+=3;numGroups+=1;}
        if (document.getElementById('id_observations-0-worms').checked==true) {totalScore+=2;numGroups+=1;}
        if (document.getElementById('id_observations-0-leeches').checked==true) {totalScore+=2;numGroups+=1;}
        if (document.getElementById('id_observations-0-crabs_shrimps').checked==true) {totalScore+=6;numGroups+=1;}
        if (document.getElementById('id_observations-0-stoneflies').checked==true) {totalScore+=17;numGroups+=1;}
        if (document.getElementById('id_observations-0-minnow_mayflies').checked==true) {totalScore+=5;numGroups+=1;}
        if (document.getElementById('id_observations-0-other_mayflies').checked==true) {totalScore+=11;numGroups+=1;}
        if (document.getElementById('id_observations-0-damselflies').checked==true) {totalScore+=4;numGroups+=1;}
        if (document.getElementById('id_observations-0-dragonflies').checked==true) {totalScore+=6;numGroups+=1;}
        if (document.getElementById('id_observations-0-bugs_beetles').checked==true) {totalScore+=5;numGroups+=1;}
        if (document.getElementById('id_observations-0-caddisflies').checked==true) {totalScore+=9;numGroups+=1;}
        if (document.getElementById('id_observations-0-true_flies').checked==true) {totalScore+=2;numGroups+=1;}
        if (document.getElementById('id_observations-0-snails').checked==true) {totalScore+=4;numGroups+=1;}
        document.getElementById('id_total_score').innerHTML = totalScore;
        document.getElementById('id_groups').innerHTML = numGroups;
        if (numGroups!=0) averageScore = (totalScore/numGroups).toFixed(1);
        document.getElementById('id_average_score').innerHTML = averageScore;
      }

      function validateForm(inputform) {
        with (inputform) {
          // convert coordinates to DD if they've been entered as DMS
          if (DMS.checked==true) {
            document.getElementById('id_latitude').value = convertDMStoDD('lat');
            document.getElementById('id_longitude').value = convertDMStoDD('lon');
          }
          // update the score value
          document.getElementById('id_observations-0-score').value = document.getElementById('id_average_score').innerHTML;
          // update the geometry field
          var theGeomString = document.getElementById('id_latitude').value + ' ' + document.getElementById('id_longitude').value;
          document.getElementById('id_the_geom').value = 'POINT(' + theGeomString + ')';
          // set the flag to Dirty
          document.getElementById('id_observations-0-flag').value = 'dirty';
        }
        return true;
      }



    Ext.onReady(function() {

        var map = new OpenLayers.Map(
          "",
          {projection: new OpenLayers.Projection("EPSG:3857"),
           displayProjection: new OpenLayers.Projection("EPSG:4326"),
           units: "m"});

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

        // Define the miniSASS composite layer as a base layer
        var layerMiniSASS = new OpenLayers.Layer.WMS(
          "miniSASS base layer",
          "http://localhost:8080/geoserver/miniSASS/wms",
          {layers:'miniSASS:miniSASS_base',format:'image/png'},
          {isbaseLayer:true}
        );

        // Add the base layers to the map
        map.addLayers([layerGoogleSatellite,layerGoogleTerrain,layerGoogleRoadmap,layerMiniSASS]);

        // Add the provinces as an overlay
        var layerProvinces = new OpenLayers.Layer.WMS(
          "Provinces",
          "http://localhost:8080/geoserver/miniSASS/wms",
          {layers:'miniSASS:provinces2011',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:true}
        );
        map.addLayer(layerProvinces);

        // Add the schools as an overlay
        var layerSchools = new OpenLayers.Layer.WMS(
          "Schools",
          "http://localhost:8080/geoserver/miniSASS/wms",
          {layers:'miniSASS:schools',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:false}
        );
        map.addLayer(layerSchools);

        // Setup the map panel
        var mapPanel = new GeoExt.MapPanel({
          renderTo: 'map',
          height: 700,
          width: 790,
          extent: new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500),
          map: map,
          title: 'miniSASS Sample Sites'
        });

        // Define lists to manage the layers
        var baseLayers = new GeoExt.tree.BaseLayerContainer({
          text: 'Base Layers',
          layerStore: mapPanel.layers,
          leaf: false,
          expanded: true
        });

        var overlayLayers = new GeoExt.tree.OverlayLayerContainer({
          text: 'Overlay Layers',
          layerStore: mapPanel.layers,
          leaf: false,
          expanded: true
        });

        // Define tree panels to control layer visibility
        var baselayerTree = new Ext.tree.TreePanel({
            title: 'Base Layers',
            renderTo: 'layertree',
            root: baseLayers,
            rootVisible: false
        });

        var overlaylayerTree = new Ext.tree.TreePanel({
            title: 'Overlays',
            renderTo: 'layertree',
            root: overlayLayers,
            rootVisible: false
        });

    });


