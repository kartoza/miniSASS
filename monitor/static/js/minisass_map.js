      var mapExtent = new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500);
      var proj4326 = new OpenLayers.Projection('EPSG:4326');
      var proj3857 = new OpenLayers.Projection('EPSG:3857');
      var localhost = false;
      var geoserverURL;
      var geoserverCachedURL;
      var map;
      var infoClick;
      var infoWindow;
      var messagePanel;
      var userFunction = 'none';// Variable to determine which cursor to display
      var storeSites;           // A store for holding sites data
      var storeSchools;         // A store for holding data for schools
      var comboSites;           // A combobox containing a list of all sites
      var comboZoomSites;       // A combobox for zooming to sites
      var comboZoomSchools;     // A combobox for zooming to schools
      var exceededZoom = '';    // Keep track of base layers zoomed beyond their limit
      var navMsg = 'Use the <b>+</b> and <b>–</b> buttons or the <i>mouse wheel</i> to '
                 + '<b>zoom in or out</b> on the map. To <b>zoom in</b> <i>double-click</i> '
                 + 'on the map or press <i>Shift</i> and <i>draw a rectangle</i>. <i>Click '
                 + 'and hold</i> the mouse button to <b>drag the map</b> around.';

      function infoFromMap(){
      /* This function toggles the 'info from map' button image, changes the
         map cursor and then activates/deactivates the infoClick control
      */
        if (userFunction != 'infoclick') {
          document.getElementById('id_obs_info').src = '/static/img/button_obs_info_selected.png';
          var mapViewPort = document.getElementsByClassName('olMapViewport');
          mapViewPort[0].style.cursor = 'url(/static/img/info.cur),crosshair';
          var msg = 'Click a miniSASS crab symbol to display details of the observations at that site.<br />' + navMsg;
          messagePanel.update(msg);
          userFunction = 'infoclick';
          infoClick.activate();
        } else {
          document.getElementById('id_obs_info').src = '/static/img/button_obs_info.png';
          var mapViewPort = document.getElementsByClassName('olMapViewport');
          mapViewPort[0].style.cursor = 'auto';
          var msg = navMsg;
          messagePanel.update(msg);
          userFunction = 'none';
          infoClick.deactivate();
          if (infoWindow.hidden == false) infoWindow.hide();
        }
      }

      function getFeatureInfoParams(x,y,infoFormat){
      /* This function returns a string containing parameters for a 
         WMSGetFeatureInfo request of the minisass_observations layer.
      */
        var params = 'REQUEST=GetFeatureInfo'
          + '&SERVICE=WMS'
          + '&VERSION=1.1.1' 
          + '&EXCEPTIONS=application/vnd.ogc.se_xml'
          + '&BBOX=' + map.getExtent().toBBOX()
          + '&X=' + Math.round(x)
          + '&Y=' + Math.round(y)
          + '&INFO_FORMAT=' + infoFormat
          + '&QUERY_LAYERS=miniSASS:minisass_observations'
          + '&LAYERS=miniSASS:minisass_observations'
          + '&FEATURE_COUNT=50'
          + '&SRS=EPSG:3857'
          + '&STYLES='
          + '&WIDTH=' + map.size.w
          + '&HEIGHT=' + map.size.h;
        return params;
      }

    Ext.onReady(function() {
    /* This function fires when the document is ready, before onload and
       before any images are loaded.
    */

        Ext.QuickTips.init();

        if (localhost == true) {
          geoserverURL = 'http://localhost:8080/geoserver/miniSASS/wms';
          geoserverCachedURL = 'http://localhost:8080/geoserver/miniSASS/wms';
        } else {
          geoserverURL = 'http://opengeo.afrispatial.co.za/geoserver/wms';
          geoserverCachedURL = 'http://opengeo.afrispatial.co.za/geoserver/gwc/service/wms?TILED=true';
        };

        // Define a store for holding data for sites
        storeSites = new Ext.data.ArrayStore({
          fields:['site_gid','site_name','description','river_cat','longitude','latitude']
        });

        // Request a list of all sites
        Ext.Ajax.request({
          url:'/map/sites/-9/-9/-9/',
          success: function(response,opts){
            var jsonData = Ext.decode(response.responseText);
            if (jsonData){
              for (var i=0; i<jsonData.features.length; i++){
                storeSites.add(new storeSites.recordType({
                  'site_gid':jsonData.features[i].properties.gid,
                  'site_name':jsonData.features[i].properties.site_name,
                  'description':jsonData.features[i].properties.description,
                  'river_cat':jsonData.features[i].properties.river_cat,
                  'longitude':jsonData.features[i].geometry.coordinates[0],
                  'latitude':jsonData.features[i].geometry.coordinates[1]
                }));
              };
            };
          },
          failure: function(response,opts){
            // Fail silently
          }
        });

        // Setup up a combo box for displaying a list of all sites
        comboSites = new Ext.form.ComboBox({
          store:storeSites,
          displayField:'site_name',
          valueField:'site_gid',
          typeAhead:true,
          mode:'local',
          emptyText:'Select a site...',
        });

        // Setup up a combo box for zooming to sites
        comboZoomSites = new Ext.form.ComboBox({
          store:storeSites,
          displayField:'site_name',
          valueField:'site_gid',
          typeAhead:true,
          mode:'local',
          emptyText:'Select a site...',
          onSelect: function(record){
            // Zoom the map to the selected site
            var xyCoords = new OpenLayers.LonLat(
              record.get('longitude'),
              record.get('latitude')
            );
            map.setCenter(xyCoords.transform(proj4326, proj3857),15);
            this.collapse();
            this.setValue(record.get('site_name'));
          }
        });

        // Define a store for holding schools
        storeSchools = new Ext.data.Store({
          proxy:new Ext.data.HttpProxy({
            method: 'GET',
            prettyUrls: false,
            url: '/map/schools',
            }),
          reader: new Ext.data.JsonReader({
            root: 'schools',
            id: 'school_gid'
          }, ['school_gid','school_name','longitude','latitude'])
        });

        // Setup up a combo box for schools
        comboZoomSchools = new Ext.form.ComboBox({
          hideTrigger: true,
          minChars:3,
          emptyText:'Type a school name...',
          store:storeSchools,
          displayField:'school_name',
          onSelect: function(record){
            // Zoom the map to the selected school
            var xyCoords = new OpenLayers.LonLat(
              record.get('longitude'),
              record.get('latitude')
            );
            map.setCenter(xyCoords.transform(proj4326, proj3857),15);
            map.getLayersByName('Schools')[0].setVisibility(true);
            this.collapse();
            this.setValue(record.get('school_name'));
          }
        });

        // Define a handler to display Feature Info from a map click
        OpenLayers.Control.InfoClick = OpenLayers.Class(OpenLayers.Control, {                
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
          trigger: function (e) {
            infoWindow.update('Querying...');
            infoWindow.show();
            var WMSParams = getFeatureInfoParams(e.xy.x,e.xy.y,'text/html');
            Ext.Ajax.request({
              url:'/map/wms/~'+geoserverURL.replace('http://','')+'~'+WMSParams+'~',
              success: function(response,opts){
                infoWindow.update(response.responseText);
              },
              failure: function(response,opts){
                infoWindow.update('Error: Could not request site information');
              }
            });
          }
        });

        // Define a new map
        map = new OpenLayers.Map(
          'map',{
            projection: proj3857,
            displayProjection: proj4326,
            units: 'm',
//            restrictedExtent:mapExtent,
            eventListeners: {'changebaselayer':mapBaseLayerChanged,'zoomend':mapZoomEnd},
//            controls: [
//              new OpenLayers.Control.Navigation(),
//              new OpenLayers.Control.ZoomPanel()
//            ]
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

        function mapZoomEnd(event) {
          // Switch from Google terrain to Google road map if zoomed too close
          if (map.zoom>=16 && map.getLayersByName('Google terrain')[0].visibility==true) {
            Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in this close on Google terrain.<br />Automatically switching to Google road map.');
            map.setBaseLayer(layerGoogleRoadmap);
            exceededZoom='Google terrain';
          }
          // Switch from Google satellite to Google road map if zoomed too close
          if (map.zoom>=20 && map.getLayersByName('Google satellite')[0].visibility==true) {
            Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in this close on Google satellite.<br />Automatically switching to Google road map.');
            map.setBaseLayer(layerGoogleRoadmap);
            exceededZoom='Google satellite';
          }
          // Switch back to Google terrain if within zoom range
          if (map.zoom<16 && exceededZoom=='Google terrain') {
            map.setBaseLayer(layerGoogleTerrain);
            exceededZoom='';
          }
          // Switch back to Google satellite if within zoom range
          if (map.zoom<20 && exceededZoom=='Google satellite') {
            map.setBaseLayer(layerGoogleSatellite);
            exceededZoom='';
          }
        }

        // Define the Google layers as base layers
        var layerGoogleSatellite = new OpenLayers.Layer.Google(
          'Google satellite',
          {type: google.maps.MapTypeId.SATELLITE,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleTerrain = new OpenLayers.Layer.Google(
          'Google terrain',
          {type: google.maps.MapTypeId.TERRAIN,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
        );
        var layerGoogleRoadmap = new OpenLayers.Layer.Google(
          'Google road map',
          {type: google.maps.MapTypeId.ROADMAP,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
        );

        // Define the miniSASS composite layer as a base layer
        var layerMiniSASSBase = new OpenLayers.Layer.WMS(
          'Rivers and Catchments',
          geoserverCachedURL,
          {layers:'miniSASS:miniSASS_base',format:'image/png'},
          {isbaseLayer:true}
        );

        // Define the provinces layer
        var layerProvinces = new OpenLayers.Layer.WMS(
          'Provinces',
          geoserverCachedURL,
          {layers:'miniSASS:miniSASS_admin',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:true,displayInLayerSwitcher:false}
        );

        // Define the schools layer as an overlay
        var layerSchools = new OpenLayers.Layer.WMS(
          'Schools',
          geoserverURL,
          {layers:'miniSASS:schools',transparent:true,format:'image/png'},
          {minScale:400000,isbaseLayer:false,visibility:false}
        );

        // Define the miniSASS observations as an overlay
        var layerMiniSASSObs = new OpenLayers.Layer.WMS(
          'miniSASS Observations',
          geoserverURL,
          {layers:'miniSASS:minisass_observations',transparent:true,format:'image/png'},
          {isbaseLayer:false,visibility:true}
        );

        // Add the layers to the map
        map.addLayers([layerMiniSASSObs,layerSchools]);
        if (localhost == true) {
          map.addLayers([layerProvinces,layerMiniSASSBase,layerGoogleSatellite,layerGoogleTerrain,layerGoogleRoadmap]);
        } else {
          map.addLayers([layerProvinces,layerGoogleTerrain,layerGoogleSatellite,layerGoogleRoadmap,layerMiniSASSBase]);
        }

        // If necessary, restore layer visibility saved from a previous state
        var layerStr = document.getElementById('id_layers').value;
        if (layerStr != ''){
          var layerArr = layerStr.split(',');
          for (var i=0; i < layerArr.length; i++) {
            if (layerArr[i]=='false') {map.layers[i].visibility = false;}
            else {map.layers[i].visibility = true;}
          }
        }

        // Add a layerswitcher
        map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));

        // Add the info click controller
        infoClick = new OpenLayers.Control.InfoClick();
        map.addControl(infoClick);

        // Setup the map panel
        var zoom_level = document.getElementById('id_zoom_level').value;
        var centreX = document.getElementById('id_centre_X').value;
        var centreY = document.getElementById('id_centre_Y').value;
        var mapPanel = new GeoExt.MapPanel({
          renderTo: 'map',
          height: 700,
          width: 804,
          center: [centreX,centreY],
          zoom: zoom_level,
          map: map
        });

        // Define the layers panel
        var layersPanel = new Ext.Panel({
          title:'Layers',
          renderTo:'layers',
          collapsible:true,
          collapsed:true,
          width:220,
          contentEl:'layerswitcher',
          bodyStyle:'padding:5px;',
        });

        // Define the legend panel
        var legendPanel = new Ext.Panel({
          title:'Legend',
          renderTo:'legend',
          collapsible:true,
          collapsed:true,
          width:220,
          contentEl:'legend_table'
        });

        // Define the zoom panel
        var zoomPanel = new Ext.Panel({
          title:'Zoom to School or Site',
          renderTo:'zoompanel',
          collapsible:true,
          collapsed:true,
          width:220,
          items: [
            new Ext.Panel({
              border:false,
              bodyStyle:'padding:5px;background:#dfe8f6;',
              items:comboZoomSchools
            }),
            new Ext.Panel({
              border:false,
              bodyStyle:'padding:5px;background:#dfe8f6;',
              items:comboZoomSites
            })
          ]
        });

        // Define the miniSASS buttons panel
        var inputPanel = new Ext.Panel({
          title:'miniSASS observations',
          renderTo:'input_obs',
          collapsible:true,
          width:220,
          contentEl:'input_buttons'
        });

        // Define the message panel
        messagePanel = new Ext.Panel({
          renderTo:'messages',
          width:220,
          bodyStyle:'padding:5px;'
        });
        messagePanel.update(navMsg);

        // Define a window to display miniSASS observation information
        infoWindow = new Ext.Window({
          title:'miniSASS observation details',
          width:600,
          height:250,
          bodyStyle:'padding:5px;',
          autoScroll:true,
          closeAction:'hide',
          modal:false,
          constrain: true,
        });
        infoWindow.show();
        infoWindow.hide();

        // Link the Observation Info button
        var buttonInfo = Ext.get('id_obs_info');
        buttonInfo.on('click', infoFromMap);

        // Define tooltips for the layer switcher
        document.querySelector('div.baseLayersDiv').id='id_baseLayersDiv';
        new Ext.ToolTip({
          target:'id_baseLayersDiv',
          html:'Only one base layer can be shown at a time'
        });
        document.querySelector('div.dataLayersDiv').id='id_dataLayersDiv';
        new Ext.ToolTip({
          target:'id_dataLayersDiv',
          html:'Layers not within scale are greyed out'
        });

  });
