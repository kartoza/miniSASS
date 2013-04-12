      var proj4326 = new OpenLayers.Projection('EPSG:4326');
      var proj3857 = new OpenLayers.Projection('EPSG:3857');
//      var mapExtent = new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500);
//      var geoserverURL = 'http://localhost:8080/geoserver/miniSASS';
      var geoserverURL = 'http://opengeo.afrispatial.co.za/geoserver';
      var lonlat;
      var map;
      var mapClick;
      var inputWindow;
      var mapCursor = 'pan';

      /*===================================
      Functions for the data input template
      ===================================*/

      function convertDDtoDMS(D) {
      /* Function to convert Decimal Degrees to Degrees Minutes Seconds.
         Assumption: It is assumed that coordinates are in southern Africa so
                     latitudes are negative and longitudes are positive.
      */
        var DMS=new Array();
        DMS[0] = 0|(D<0?D=-D:D);
        DMS[1] = 0|D%1*60;
        DMS[2] = (0|D*60%1*600)/10;
        return DMS;
      }

      function convertDMStoDD(latOrLon) {
      /* Function to convert Degrees Minutes Seconds to Decimal Degrees.
         Assumption: It is assumed that coordinates are in southern Africa so
                     latitudes are negative and longitudes are positive.
      */
        var DD;
        var D = parseInt(document.getElementById('id_'+latOrLon+'_d').value);
        var M = parseInt(document.getElementById('id_'+latOrLon+'_m').value);
        var S = parseFloat(document.getElementById('id_'+latOrLon+'_s').value);
        if (D != NaN) {
          DD = D;
          if (DD < 0) {DD = -1 * DD}
          if ((M != NaN) && (M >= 0) && (M <= 60)) {
            DD = DD + M/60;
            if ((S != NaN) && (S >= 0) && (S <= 60)) {
              DD = DD + S/3600;
              if ((latOrLon.toUpperCase()=='S') || (latOrLon.toUpperCase()=='W')) {
                if (DD > 0) {DD = -1 * DD};
              }
            }
          }
        } else DD = '';
        return DD;
      }

      function coords(format) {
        if (format == 'DMS') {
          document.getElementById('id_latitude').style.display = 'none';
          document.getElementById('id_lat_d').style.display = '';
          document.getElementById('id_lat_m').style.display = '';
          document.getElementById('id_lat_s').style.display = '';
          document.getElementById('id_longitude').style.display = 'none';
          document.getElementById('id_lon_d').style.display = '';
          document.getElementById('id_lon_m').style.display = '';
          document.getElementById('id_lon_s').style.display = '';
          var latDMS = convertDDtoDMS(document.getElementById('id_latitude').value,'lat');
          document.getElementById('id_lat_d').value = latDMS[0];
          document.getElementById('id_lat_m').value = latDMS[1];
          document.getElementById('id_lat_s').value = latDMS[2];
          var lonDMS = convertDDtoDMS(document.getElementById('id_longitude').value,'lon');
          document.getElementById('id_lon_d').value = lonDMS[0];
          document.getElementById('id_lon_m').value = lonDMS[1];
          document.getElementById('id_lon_s').value = lonDMS[2];
        }
        if (format == 'Decimal') {
          document.getElementById('id_latitude').style.display = '';
          document.getElementById('id_lat_d').style.display = 'none';
          document.getElementById('id_lat_m').style.display = 'none';
          document.getElementById('id_lat_s').style.display = 'none';
          document.getElementById('id_longitude').style.display = '';
          document.getElementById('id_lon_d').style.display = 'none';
          document.getElementById('id_lon_m').style.display = 'none';
          document.getElementById('id_lon_s').style.display = 'none';
          document.getElementById('id_latitude').value = convertDMStoDD('lat').toFixed(5);
          document.getElementById('id_longitude').value = convertDMStoDD('lon').toFixed(5);
        }
      }

      function updateScore() {
      /* This function updates the species and total scores on the data
         input form
      */

        var totalScore=0;
        var numGroups=0;
        var averageScore=0;

        function updateSpecies(species,speciesScore) {
          var elementID = 'id_observation-0-' + species;
          if (document.getElementById(elementID).checked==true) {
            totalScore = totalScore +speciesScore;
            numGroups+=1;
            document.getElementById(species).style.color='red';
            document.getElementById(species).style.fontWeight='bold';
          } else {
            document.getElementById(species).style.color='darkgray';
            document.getElementById(species).style.fontWeight='normal';
          }
        }

        updateSpecies('flatworms',3);
        updateSpecies('worms',2);
        updateSpecies('leeches',2);
        updateSpecies('crabs_shrimps',6);
        updateSpecies('stoneflies',17);
        updateSpecies('minnow_mayflies',5);
        updateSpecies('other_mayflies',11);
        updateSpecies('damselflies',4);
        updateSpecies('dragonflies',6);
        updateSpecies('bugs_beetles',5);
        updateSpecies('caddisflies',9);
        updateSpecies('true_flies',2);
        updateSpecies('snails',4);
        document.getElementById('id_total_score').innerHTML = totalScore;
        document.getElementById('id_groups').innerHTML = numGroups;
        if (numGroups!=0) averageScore = (totalScore/numGroups);
        document.getElementById('id_average_score').innerHTML = averageScore.toFixed(1);
      }

      function canSubmit() {
      /* This function ensures that all form variables are correctly set
         when the data input form is submitted.
      */

        // convert coordinates to DD if they've been entered as DMS
        if (DMS.checked==true) {
          document.getElementById('id_latitude').value = convertDMStoDD('lat');
          document.getElementById('id_longitude').value = convertDMStoDD('lon');
        }

        // make sure the coordinates have the correct sign
        if (document.getElementById('id_latitude').value > 0) {
          document.getElementById('id_latitude').value = -1 * document.getElementById('id_latitude').value;
        }
        if (document.getElementById('id_longitude').value < 0) {
          document.getElementById('id_longitude').value = -1 * document.getElementById('id_longitude').value;
        }

        // update the score value
        document.getElementById('id_observation-0-score').value = document.getElementById('id_average_score').innerHTML;

        // update the geometry field
        var theGeomString = document.getElementById('id_longitude').value + ' ' + document.getElementById('id_latitude').value;
        document.getElementById('id_the_geom').value = 'POINT(' + theGeomString + ')';

        // set the observations flag to Dirty
        document.getElementById('id_observation-0-flag').value = 'dirty';
 
        // update the map variables
        document.getElementById('id_zoom_level').value = map.getZoom();
        document.getElementById('id_centre_X').value = map.getCenter().lon;
        document.getElementById('id_centre_Y').value = map.getCenter().lat;
        return true;
      }

      function inputFromMap () {
      /* This function toggles the 'input from map' button image, changes the
         map cursor and then activates/deactivates the mapClick control
      */
        if (mapCursor == 'pan') {
          document.getElementById('id_obs_map').src = '/static/img/icon_obs_map_pressed.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'crosshair';
          var msg = 'Click the location of the observation<br />on the map.';
          msg = msg + '<br /><br />You can use the mouse wheel to<br />zoom in or out on the map. ';
          msg = msg + 'Click and<br />hold the mouse button to drag<br />the map around.';
          Ext.Msg.alert('Add observation from map', msg);
          document.getElementById('messages').innerHTML = msg;
          mapCursor = 'crosshair';
          mapClick.activate();
        } else {
          document.getElementById('id_obs_map').src = '/static/img/icon_obs_map.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'move';
          document.getElementById('messages').innerHTML = '';
          mapCursor = 'pan';
          mapClick.deactivate();
        }
      }

    Ext.onReady(function() {
    /*This function fires when the document is ready, before onload and
      before any images are loaded.
    */

        Ext.QuickTips.init();

        // Define a handler for extracting and submitting coordinates from a click on the map
        OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
          defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
          },
          initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
              {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
              this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
              this, {
                'click': this.trigger
              }, this.handlerOptions
            );
          }, 
          trigger: function(e) {
            lonlat = map.getLonLatFromPixel(e.xy);
            lonlat.transform(proj3857, proj4326);
            document.getElementById('id_latitude').value = lonlat.lat.toFixed(5);
            document.getElementById('id_longitude').value = lonlat.lon.toFixed(5);
            var msg = 'You clicked at ' +  lonlat.lat.toFixed(5) + 'S ' + lonlat.lon.toFixed(5) + 'E.';
            msg = msg + '<br />Do you want to enter a miniSASS observation at this location?';
            Ext.MessageBox.confirm('Confirm', msg,function(btn,text){
              if (btn=='yes') {inputWindow.show(this);}
            });
          }
        });

        // Define a new map
        map = new OpenLayers.Map(
          'miniSASS Map',{
            projection: proj3857,
            displayProjection: proj4326,
            units: 'm',
            eventListeners: {'changebaselayer':mapBaseLayerChanged}
          }
         );

        function mapBaseLayerChanged(event) {
        // This functions toggles the Provinces layer on/off with the Google satellite layer
          if (event.layer.name=='Google satellite') {
            map.getLayersByName('Provinces')[0].setVisibility(true);
          } else {
            map.getLayersByName('Provinces')[0].setVisibility(false);
          }
        }

        // Define the Google layers as base layers
        var layerGoogleSatellite = new OpenLayers.Layer.Google(
          'Google satellite',
          {type: google.maps.MapTypeId.SATELLITE,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleTerrain = new OpenLayers.Layer.Google(
          'Google terrain',
          {type: google.maps.MapTypeId.TERRAIN,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleRoadmap = new OpenLayers.Layer.Google(
          'Google road map',
          {type: google.maps.MapTypeId.ROADMAP,sphericalMercator:true,isBaseLayer:true}
        );

        // Define the miniSASS composite layer as a base layer
        var layerMiniSASSBase = new OpenLayers.Layer.WMS(
          'miniSASS base layer',
          geoserverURL+'/wms',
          {layers:'miniSASS:miniSASS_base',format:'image/png'},
          {isbaseLayer:true}
        );

        // Define the provinces layer
        var layerProvinces = new OpenLayers.Layer.WMS(
          'Provinces',
          geoserverURL+'/wms',
          {layers:'miniSASS:provinces',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:true,displayInLayerSwitcher:false}
        );

        // Define the schools layer as an overlay
        var layerSchools = new OpenLayers.Layer.WMS(
          'Schools',
          geoserverURL+'/wms',
          {layers:'miniSASS:schools',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:false}
        );

        // Define the miniSASS observations as an overlay
        var layerMiniSASSObs = new OpenLayers.Layer.WMS(
          'miniSASS Observations',
          geoserverURL+'/wms',
          {layers:'miniSASS:sample',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:true}
        );

        // Add the layers to the map
        map.addLayers([layerProvinces,layerGoogleSatellite,layerGoogleTerrain,layerGoogleRoadmap]);
        map.addLayers([layerMiniSASSBase,layerSchools,layerMiniSASSObs]);

        // Add the map click controller
        mapClick = new OpenLayers.Control.Click();
        map.addControl(mapClick);

        // Setup the menu for inputting miniSASS observations
        var obsMenu = new Ext.menu.Menu({
          id: 'obsMenu',
          items: [{
            text:'Observation at new site',
            icon:'/static/img/icon_obs_add.png',
            handler:function(){inputWindow.show(this);}
          },{
            text:'Click site location on map',
            icon:'/static/img/icon_obs_target.png',
            handler:inputFromMap
          },{
            text:'Select site from list',
            icon:'/static/img/icon_obs_list.png',
            disabled:true
          }]
        });

        // Link the observations menu to a toolbar
        var mapTb = new Ext.Toolbar({
          items:[{
            icon:'/static/img/icon_crab_n.png',
            text:'Enter miniSASS observations',
            menu:obsMenu
          }]
        });

        // Setup the map panel
        var zoom_level = document.getElementById('id_zoom_level').value;
        var centreX = document.getElementById('id_centre_X').value;
        var centreY = document.getElementById('id_centre_Y').value;
        var mapPanel = new GeoExt.MapPanel({
          renderTo: 'map',
          height: 700,
          width: 790,
          center: [centreX,centreY],
          zoom: zoom_level,
          map: map,
          tbar: mapTb // Place the map toolbar at the top
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
            title:'Base Layers',
            renderTo:'layertree',
            root: baseLayers,
            rootVisible:false
        });

        var overlaylayerTree = new Ext.tree.TreePanel({
            title:'Overlays',
            renderTo:'layertree',
            root: overlayLayers,
            rootVisible:false
        });

        // Define the legend panel
        var legendPanel = new Ext.Panel({
          title:'Legend',
          renderTo:'legend',
          contentEl:'legend_table'
        });

        // Define the input buttons panel
        var inputPanel = new Ext.Panel({
          title:'Enter miniSASS observations',
          renderTo:'input_obs',
          contentEl:'input_buttons'
        });

        // Define the popup Data Input window
        inputWindow = new Ext.Window({
          applyTo:'data_window',
          width:600,
          height:420,
          closeAction:'hide',
          modal:true,
          items: new Ext.Panel({
            applyTo: 'data_panel',
            border:false
          }),
          buttons: [{
            text:'Submit',
            handler: function(){
              if (canSubmit()) document.forms['dataform'].submit();
            }
          },{
            text: 'Close',
            handler: function(){inputWindow.hide();}
          }]
        });

        // Link the button for opening the popup Data Input window
        var inputButton = Ext.get('id_obs_direct');
        inputButton.on('click', function(){inputWindow.show(this);});

  });


