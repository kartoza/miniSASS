      var mapExtent = new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500);
      var proj4326 = new OpenLayers.Projection('EPSG:4326');
      var proj3857 = new OpenLayers.Projection('EPSG:3857');
      var localhost = false;
      var geoserverURL;
      var geoserverCachedURL;
      var map;
      var mapClick;
      var infoClick;
      var inputWindow;
      var infoWindow;
      var siteWindow;
      var messagePanel;
      var userFunction = 'none';// Variable to determine which cursor to display
      var searchRadius = 1000;  // The search radius for locating nearby sites (metres)
      var clickCoords;          // Map click coordinates
      var storeSites;           // A store for holding sites data
      var storeNearbySites;     // A store for holding data for nearby sites
      var storeSchools;         // A store for holding data for schools
      var comboSites;           // A combobox containing a list of all sites
      var comboNearbySites;     // A combobox containing a list of nearby sites
      var comboZoomSites;       // A combobox for zooming to sites
      var comboZoomSchools;     // A combobox for zooming to schools
      var navMsg = 'Use the <i>mouse wheel</i> to <b>zoom in or out</b> on the map, or press <i>Shift</i> '
                 + 'and draw a rectangle to <b>zoom in</b>. <i>Click and hold</i> the mouse button '
                 + 'to <b>drag the map</b> around. ';

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

      function updateInputForm(clickedElement) {
      /* This function updates the species and total scores on the data
         input form. Site data editing is also enabled/disabled as needed.
      */

        var totalScore=0;
        var numGroups=0;
        var averageScore=0;
        var elementID='id_' + clickedElement;

        function updateSpecies(species,speciesScore) {
        /* This function is called once for each of the species.
           Function scope: Local to function unpdateInputform.
        */
          var elementID = 'id_' + species;
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

        // Only update scores if a river category has been selected
        if ((clickedElement != '') && (document.getElementById('id_river_cat').selectedIndex == 0)) {
          document.getElementById(elementID).checked = false;
          Ext.Msg.alert('River category', 'Please select a river category');
        } else {
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
          if (numGroups != 0) averageScore = (totalScore/numGroups);
          document.getElementById('id_average_score').innerHTML = averageScore.toFixed(1);
          
          // Update the crab icon
          var riverCat = document.getElementById('id_river_cat').value;
          if (averageScore == 0 || document.getElementById('id_river_cat').selectedIndex == 0){
            document.getElementById('id_crab').src = '/static/img/icon_crab_u_large.png';
          } else if (averageScore > 0 && averageScore <= 4.3 && riverCat == 'sandy'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_v_large.png';
          } else if (averageScore > 0 && averageScore <= 5.1 && riverCat == 'rocky'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_v_large.png';
          } else if (averageScore > 4.3 && averageScore <= 4.9 && riverCat == 'sandy'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_p_large.png';
          } else if (averageScore > 5.1 && averageScore <= 6.1 && riverCat == 'rocky'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_p_large.png';
          } else if (averageScore > 4.9 && averageScore <= 5.8 && riverCat == 'sandy'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_f_large.png';
          } else if (averageScore > 6.1 && averageScore <= 6.8 && riverCat == 'rocky'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_f_large.png';
          } else if (averageScore > 5.8 && averageScore <= 6.9 && riverCat == 'sandy'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_g_large.png';
          } else if (averageScore > 6.8 && averageScore <= 7.9 && riverCat == 'rocky'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_g_large.png';
          } else if (averageScore > 6.9 && riverCat == 'sandy'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_n_large.png';
          } else if (averageScore > 7.9 && riverCat == 'rocky'){
            document.getElementById('id_crab').src = '/static/img/icon_crab_n_large.png';
          }

        }

        // Enable/disable site editing as necessary
        if (document.getElementById('id_edit_site').value == 'true'){
          disableSiteEdit(false);
        } else {
          disableSiteEdit(true);
        }
      }

      function canSubmit(){
      /* This function ensures that all form variables are correctly set
         when the data input form is submitted.
      */

        if (document.getElementById('id_obs_date').value == '') {
          Ext.Msg.alert('Date Error', 'Please enter a valid date');
          return false;
        } else if (document.getElementById('id_site_name').value == '') {
          Ext.Msg.alert('Site Name Error', 'Please enter a site name');
          return false;
        } else if (document.getElementById('id_river_cat').selectedIndex == 0) {
          Ext.Msg.alert('River Category and Groups error',
                        'Please select a river category and indicate<br />which insect groups you found');
          return false;
        } else { // All the required fields are present
          if (document.getElementById('id_edit_site').value == 'true'){
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

          } else {
            disableSiteEdit(false);
          }

          // update the geometry field
          var theGeomString = document.getElementById('id_longitude').value + ' ' + document.getElementById('id_latitude').value;
          document.getElementById('id_the_geom').value = 'POINT(' + theGeomString + ')';

          // update the score value
          document.getElementById('id_score').value = document.getElementById('id_average_score').innerHTML;

          // set the observations flag to Dirty
          document.getElementById('id_flag').value = 'dirty';
 
          // update the map variables
          document.getElementById('id_zoom_level').value = map.getZoom();
          document.getElementById('id_centre_X').value = map.getCenter().lon;
          document.getElementById('id_centre_Y').value = map.getCenter().lat;
          var layerStr = '';
          for (var i=0; i < map.getNumLayers(); i++) {
            if (i>0) layerStr += ',';
            layerStr += map.layers[i].visibility;
          }
          document.getElementById('id_layers').value = layerStr;

          return true;
        }
      }

      function inputFromMap(){
      /* This function toggles the 'input from map' button image, changes the
         map cursor and then activates/deactivates the mapClick control
      */
        if (userFunction != 'mapclick') {
          document.getElementById('id_obs_map').src = '/static/img/button_obs_map_selected.png';
          document.getElementById('id_obs_info').src = '/static/img/button_obs_info.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'url(/static/img/target.cur),crosshair';
          var msg = 'Click the location of the observation on the map.<br />' + navMsg;
          messagePanel.update(msg);
          userFunction = 'mapclick';
          mapClick.activate();
          infoClick.deactivate();
          if (infoWindow.hidden == false) infoWindow.hide();
        } else {
          document.getElementById('id_obs_map').src = '/static/img/button_obs_map.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'auto';
          var msg = navMsg;
          messagePanel.update(msg);
          userFunction = 'none';
          mapClick.deactivate();
        }
      }

      function infoFromMap(){
      /* This function toggles the 'info from map' button image, changes the
         map cursor and then activates/deactivates the infoClick control
      */
        if (userFunction != 'infoclick') {
          document.getElementById('id_obs_info').src = '/static/img/button_obs_info_selected.png';
          document.getElementById('id_obs_map').src = '/static/img/button_obs_map.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'url(/static/img/info.cur),crosshair';
          var msg = 'Click a miniSASS crab symbol to display details of the observations at that site.<br />' + navMsg;
          messagePanel.update(msg);
          userFunction = 'infoclick';
          infoClick.activate();
          mapClick.deactivate();
        } else {
          document.getElementById('id_obs_info').src = '/static/img/button_obs_info.png';
          document.getElementById('OpenLayers.Map_2_OpenLayers_ViewPort').style.cursor = 'auto';
          var msg = navMsg;
          messagePanel.update(msg);
          userFunction = 'none';
          infoClick.deactivate();
          if (infoWindow.hidden == false) infoWindow.hide();
        }
      }

      function resetInputForm(){
      /* This function clears all the inputs on the data input form
         when the user clicks the Cancel button.
      */
        var divDataPanel = document.getElementById('data_panel');

        // Reset all the text and checkbox elements
        var inputArray = divDataPanel.getElementsByTagName('input');
        for (var i=0; i < inputArray.length; i++) {
          if (inputArray[i].getAttribute('type')=='text') inputArray[i].value='';
          if (inputArray[i].getAttribute('type')=='checkbox') inputArray[i].checked=false;
        }

        // Reset all the textarea elements
        var textArray = divDataPanel.getElementsByTagName('textarea');
        for (var j=0; j < textArray.length; j++) textArray[j].value='';

        // Reset all the select elements
        var selectArray = divDataPanel.getElementsByTagName('select');
        for (var k=0; k < selectArray.length; k++) selectArray[k].selectedIndex=0;

        // Reset the totals and score
        updateInputForm('');

        // Enable the controls for site input variables
        disableSiteEdit(false)
        document.getElementById('id_edit_site').value = 'true';

        // Erase the observation link to the site id
        document.getElementById('id_site').value = '1';

      }

      function disableSiteEdit(disable){
        document.getElementById('id_site_name').disabled = disable;
        document.getElementById('id_description').disabled = disable;
        document.getElementById('id_river_cat').disabled = disable;
        document.getElementById('id_latitude').disabled = disable;
        document.getElementById('id_lat_d').disabled = disable;
        document.getElementById('id_lat_m').disabled = disable;
        document.getElementById('id_lat_s').disabled = disable;
        document.getElementById('id_longitude').disabled = disable;
        document.getElementById('id_lon_d').disabled = disable;
        document.getElementById('id_lon_m').disabled = disable;
        document.getElementById('id_lon_s').disabled = disable;
      }

      function loadSelectedSite(combo,store){

        var selectedSite = combo.getValue();
        if (selectedSite != '') {
          resetInputForm();
          var siteRecord = store.getAt(store.find('site_gid',selectedSite));

          // Add the site data to the Data Input form
          document.getElementById('id_site_name').value = siteRecord.get('site_name');
          document.getElementById('id_description').value = siteRecord.get('description');
          if (siteRecord.get('river_cat') == 'rocky'){
            document.getElementById('id_river_cat').selectedIndex = 1;
          } else if (siteRecord.get('river_cat') == 'sandy'){
            document.getElementById('id_river_cat').selectedIndex = 2;
          } else document.getElementById('id_river_cat').selectedIndex = 0;
          document.getElementById('id_latitude').value = siteRecord.get('latitude');
          document.getElementById('id_longitude').value = siteRecord.get('longitude');

          // Link the observation to the site id
          document.getElementById('id_site').value = siteRecord.get('site_gid');

          // Disable the site input controls and variables
          disableSiteEdit(true);
          document.getElementById('id_edit_site').value = 'false';

          // Zoom the map to the selected site
          var xyCoords = new OpenLayers.LonLat(
            siteRecord.get('longitude'),
            siteRecord.get('latitude')
          );
          map.setCenter(xyCoords.transform(proj4326, proj3857),15);
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
          url:'sites/-9/-9/-9/',
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
            url: 'schools',
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

        // Define a store for holding data for nearby sites
        storeNearbySites = new Ext.data.ArrayStore({
          fields:['site_gid','site_name','description','river_cat','longitude','latitude']
        });

        // Setup up a combo box for displaying a list of nearby sites
        comboNearbySites = new Ext.form.ComboBox({
          store:storeNearbySites,
          displayField:'site_name',
          valueField:'site_gid',
          typeAhead:true,
          mode:'local',
          emptyText:'Nearby sites...',
        });

        // Define a handler for processing coordinates from a map click
        OpenLayers.Control.MapClick = OpenLayers.Class(OpenLayers.Control, {                
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

            // Get the click coordinates and convert them to lon/lat
            clickCoords = map.getLonLatFromPixel(e.xy);

            // Look for existing sites close to the click point
            var jsonData;
            function requestSites(callback){
              Ext.Ajax.request({
                url:'sites/'+clickCoords.lon+'/'+clickCoords.lat+'/' + searchRadius + '/',
                success: function(response,opts){
                  jsonData = Ext.decode(response.responseText);
                  callback.call();
                },
                failure: function(response,opts){
                  callback.call();  // Fail silently
                }
              });
            };

            var afterRequestSites = function(){
              // If nearby sites have been found, add them to the combo box
              storeNearbySites.removeAll();
              comboNearbySites.reset();
              if (jsonData){
                for (var i=0; i<jsonData.features.length; i++){
                  storeNearbySites.add(new storeNearbySites.recordType({
                    'site_gid':jsonData.features[i].properties.gid,
                    'site_name':jsonData.features[i].properties.site_name,
                    'description':jsonData.features[i].properties.description,
                    'river_cat':jsonData.features[i].properties.river_cat,
                    'longitude':jsonData.features[i].geometry.coordinates[0],
                    'latitude':jsonData.features[i].geometry.coordinates[1]
                  }));
                };
              };

              clickCoords.transform(proj3857, proj4326);
              var lat = convertDDtoDMS(clickCoords.lat.toFixed(5));
              var lon = convertDDtoDMS(clickCoords.lon.toFixed(5));
              var msg = 'You clicked at:<br />&nbsp;&nbsp;'
                + lat[0] + '&deg; ' + lat[1] + '&apos; ' + lat[2] + '&quot; S<br />&nbsp;&nbsp;'
                + lon[0] + '&deg; ' + lon[1] + '&apos; ' + lon[2] + '&quot; E<br />'
                + 'Do you want to create a new site and miniSASS observation at this location?';

              Ext.getCmp('id_clicked_coords').body.update(msg);
              mapClickWindow.show();
            };

            // Request nearby sites and then callback to afterRequestSites after the Ajax response
            requestSites(afterRequestSites);
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
              url:'wms/~'+geoserverURL.replace('http://','')+'~'+WMSParams+'~',
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
            eventListeners: {'changebaselayer':mapBaseLayerChanged,'zoomend':mapZoomEnd},
            controls: [
              new OpenLayers.Control.Navigation(),
              new OpenLayers.Control.ZoomPanel()
            ]
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
          if (map.zoom>=14 && map.getLayersByName('Google terrain')[0].visibility==true) {
            Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in any further on Google terrain.<br />Switching to Google road map.');
            map.setBaseLayer(layerGoogleRoadmap);
          }
          if (map.zoom>=18 && map.getLayersByName('Google satellite')[0].visibility==true) {
            Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in any further on Google satellite.<br />Switching to Google road map.');
            map.setBaseLayer(layerGoogleRoadmap);
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
          geoserverURL,
          {layers:'miniSASS:provinces',transparent:true,format:'image/png'},
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

        // Add the map click controller
        mapClick = new OpenLayers.Control.MapClick();
        map.addControl(mapClick);

        // Add the info click controller
        infoClick = new OpenLayers.Control.InfoClick();
        map.addControl(infoClick);

        // Set map panning restrictions
        map.setOptions({restrictedExtent:mapExtent});
    
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

        // Define the popup Data Input window
        inputWindow = new Ext.Window({
          applyTo:'data_window',
          width:610,
          height:430,
          closeAction:'hide',
          modal:true,
          constrain: true,
          draggable:false,  // workaround to the postioning problem caused by the CMS
          items: new Ext.Panel({
            applyTo: 'data_panel',
            border:false
          }),
          buttons: [{
            text:'Save',
            tooltip:'Save this observation and return to the map',
            handler: function(){
              if (canSubmit()) document.forms['dataform'].submit();
            }
          },{
            text: 'Close',
            tooltip:'Close this window but keep any data that has been entered',
            handler: function(){inputWindow.hide();}
          },{
            text: 'Cancel',
            tooltip:'Close this window and erase any data that has been entered',
            handler: function(){resetInputForm();inputWindow.hide();}
          }]
        });
        updateInputForm('');

        // Define a datepick widget
        var today = new Date();
        var todayString = today.getFullYear() + '-'
          + ('0' + (today.getMonth()+1)).slice(-2) + '-'
          + ('0' + today.getDate()).slice(-2);
        var obsDate = new Ext.form.DateField({
          applyTo:'id_obs_date',
          editable:false,
          format:'Y-m-d',
          maxValue:todayString,
        });

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

        // Define the popup Site Selection window
        siteWindow = new Ext.Window({
          title:'Existing observation sites',
          width:300,
          height:200,
          closeAction:'hide',
          modal:true,
          constrain: true,
          items: new Ext.Panel({
            border:false,
            bodyStyle:'padding:5px;background:#dfe8f6;',
            items:comboSites
          }),
          buttons: [{
            text:'Use selected site',
            tooltip:'Enter an observation at the selected site',
            handler: function(){
              resetInputForm();
              siteWindow.hide();
              loadSelectedSite(comboSites,storeSites);
              inputWindow.show(this);
            }
          },{
            text:'Add a new site',
            tooltip:'Enter an observation at a new site',
            handler: function(){
              resetInputForm();
              siteWindow.hide();
              inputWindow.show(this);
            }
          },{
            text: 'Cancel',
            tooltip:'Cancel this window and return to the map',
            handler: function(){siteWindow.hide();}
          }]
        });

        // Define the popup Map Click window
        mapClickWindow = new Ext.Window({
          width:300,
          height:300,
          closeAction:'hide',
          modal:true,
          constrain: true,
          items: [
            new Ext.Panel({
              id:'id_clicked_coords',
              border:false,
              title:'Map click position',
              bodyStyle:'padding:5px;background:#dfe8f6;',
              buttonAlign:'left',
              buttons: [{
                text:'Yes, create new site',
                tooltip:'Create a new observation site',
                handler: function(){
                  resetInputForm();
                  document.getElementById('id_latitude').value = clickCoords.lat.toFixed(5);
                  document.getElementById('id_longitude').value = clickCoords.lon.toFixed(5);
                  map.setCenter(clickCoords.transform(proj4326, proj3857),15);
                  mapClickWindow.hide();
                  inputWindow.show(this);
                }
              }]
            }),
            new Ext.Panel({
              id:'id_nearby_sites',
              border:false,
              title:'Nearby sites (within '+searchRadius+' metres)',
              bodyStyle:'padding:5px;background:#dfe8f6;',
              items:comboNearbySites,
              buttonAlign:'left',
              buttons: [{
                text:'Use nearby site',
                tooltip:'Enter an observation at the selected nearby site',
                handler: function(){
                  resetInputForm();
                  mapClickWindow.hide();
                  loadSelectedSite(comboNearbySites,storeNearbySites);
                  inputWindow.show(this);
                }
              }]
            })
          ],
          buttons: [{
            text: 'Cancel',
            tooltip:'Cancel this window and return to the map',
            handler: function(){mapClickWindow.hide();}
          }]
        });
        mapClickWindow.show();
        mapClickWindow.hide();

        // Link the Observation Info button
        var buttonInfo = Ext.get('id_obs_info');
        buttonInfo.on('click', infoFromMap);

        // Link the Data Input button
        var buttonAdd = Ext.get('id_obs_add');
        buttonAdd.on('click', function(){inputWindow.show(this);});

        // Link the Map Click input button
        var buttonMap = Ext.get('id_obs_map');
        buttonMap.on('click', inputFromMap);

        // Link the Site List input button
        var buttonList = Ext.get('id_obs_list');
        buttonList.on('click', function(){siteWindow.show(this);});

        // Re-open the Data Input window if an error has been returned
        if (document.getElementById('id_error').value == 'true'){
          document.getElementById('id_error').value = 'false';
          inputWindow.show(this);
        }

  });


