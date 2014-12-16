var mapExtent = new OpenLayers.Bounds(1833200,-4141400,3661500,-2526500);
var mapExtentX = 2747350;
var mapExtentY = -3333950;
var mapExtentZoom = 6;
var proj4326 = new OpenLayers.Projection('EPSG:4326');
var proj3857 = new OpenLayers.Projection('EPSG:3857');
var localhost = false;
var geoserverURL;
var geoserverCachedURL;
var map;
var layerGoogleSatellite;
var layerGoogleTerrain;
var layerGoogleRoadmap;
var layerMiniSASSBase;
var layerProvinces;
var layerSchools;
var layerMiniSASSObs;
var layerMarker;
var infoClick;
var infoWindow;
var dataWindow;
var siteDataSelectWindow;
var redirectWindow;
var filterWindow;
var filtered = false;
var cqlFilter = '';
var messagePanel;
var markerPoint;
var userFunction = 'none';// Variable to determine which cursor to display
var searchRadius = 1000;  // The search radius for locating nearby sites (metres)
var storeSites;           // A store for holding sites data
var storeSchools;         // A store for holding data for schools
var storeRiverNames;      // A store for holding unique river names
var storeSiteNames;       // A store for holding unique site names
var storeUserNames;       // A store for holding unique user names
var comboSitesData;       // A list of all sites (for displaying site data and graphs)
var comboZoomSites;       // A combobox for zooming to sites
var comboZoomSchools;     // A combobox for zooming to schools
var dataTabPanel;         // A tab panel for showing site details, observations and graphs
var exceededZoom = '';    // Keep track of base layers zoomed beyond their limit
var navMsg = 'Use the <b>+</b> and <b>–</b> buttons or the <i>mouse wheel</i> to '
           + '<b>zoom in or out</b> on the map. To <b>zoom in</b> <i>double-click</i> '
           + 'on the map or press <i>Shift</i> and <i>draw a rectangle</i>. <i>Click '
           + 'and hold</i> the mouse button to <b>drag the map</b> around.';

function hideMarker() {
/* This function hides the marker showing the location of the site coordinates
 * on the map.
 */
  if (layerMarker) {
    OpenLayers.Feature.Vector.style['default']['pointRadius'] = '0';
    OpenLayers.Feature.Vector.style['select']['pointRadius'] = '0';
    layerMarker.redraw();
  }
}

function showMarker(longitude,latitude) {
/* This function shows the marker at the location of the coordinates
 * passed as variables.
 */
  OpenLayers.Feature.Vector.style['default']['pointRadius'] = '12';
  OpenLayers.Feature.Vector.style['select']['pointRadius'] = '12';
  markerPoint.x = longitude;
  markerPoint.y = latitude;
  markerPoint.transform(proj4326, proj3857);
  layerMarker.redraw();
}

function infoFromMap(){
/* This function toggles the 'info from map' button image, changes the
   map cursor and then activates/deactivates the infoClick control.
*/
  if (userFunction != 'infoclick') {
    document.getElementById('id_obs_info').src = '/static/img/button_obs_info_selected.png';
    document.getElementById('id_site_map').src = '/static/img/button_site_map.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'url(/static/img/info.cur),crosshair';
    var msg = 'Click a miniSASS crab symbol to display details of the observations at that site.<br />' + navMsg;
    messagePanel.update(msg);
    userFunction = 'infoclick';
    infoClick.activate();
    dataClick.deactivate();
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

function dataFromMap(){
/* This function toggles the 'data and graphs from map' button image, changes the
   map cursor and then activates/deactivates the mapClick control.
*/
  if (userFunction != 'dataclick') {
    document.getElementById('id_site_map').src = '/static/img/button_site_map_selected.png';
    document.getElementById('id_obs_info').src = '/static/img/button_obs_info.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'url(/static/img/target.cur),crosshair';
    var msg = 'Click a site on the map.<br />' + navMsg;
    messagePanel.update(msg);
    userFunction = 'dataclick';
    dataClick.activate();
    infoClick.deactivate();
    if (infoWindow.hidden == false) infoWindow.hide();
  } else {
    document.getElementById('id_site_map').src = '/static/img/button_site_map.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'auto';
    var msg = navMsg;
    messagePanel.update(msg);
    userFunction = 'none';
    dataClick.deactivate();
  }
}

function loadSelectedObs(selectedSite,store){
/* This function loads the site details and observations from the selected site
   into the data window.
*/
  if (selectedSite != '') {
    var siteRecord = store.getAt(store.find('site_gid',selectedSite));

    // Define a store for holding a site's observation data
    storeSiteObs = new Ext.data.ArrayStore({
      fields:['obs_gid','user','flatworms','worms','leeches','crabs_shrimps','stoneflies','minnow_mayflies','other_mayflies','damselflies','dragonflies','bugs_beetles','caddisflies','true_flies','snails','score','obs_date','flag','water_clarity','water_temp','ph','diss_oxygen','diss_oxygen_unit','elec_cond','elec_cond_unit',]
    });

    // Request all the site's observations
    Ext.Ajax.request({
      url:'/map/observations/'+siteRecord.get('site_gid'),
      success:function(response,opts){
        var jsonData = Ext.decode(escape(response.responseText));
        if (jsonData){
          for (var i=0; i<jsonData.features.length; i++){
            storeSiteObs.add(new storeSiteObs.recordType({
              'obs_gid':jsonData.features[i].properties.obs_gid,
              'user':jsonData.features[i].properties.user,
              'flatworms':jsonData.features[i].properties.flatworms,
              'worms':jsonData.features[i].properties.worms,
              'leeches':jsonData.features[i].properties.leeches,
              'crabs_shrimps':jsonData.features[i].properties.crabs_shrimps,
              'stoneflies':jsonData.features[i].properties.stoneflies,
              'minnow_mayflies':jsonData.features[i].properties.minnow_mayflies,
              'other_mayflies':jsonData.features[i].properties.other_mayflies,
              'damselflies':jsonData.features[i].properties.damselflies,
              'dragonflies':jsonData.features[i].properties.dragonflies,
              'bugs_beetles':jsonData.features[i].properties.bugs_beetles,
              'caddisflies':jsonData.features[i].properties.caddisflies,
              'true_flies':jsonData.features[i].properties.true_flies,
              'snails':jsonData.features[i].properties.snails,
              'score':jsonData.features[i].properties.score,
              'obs_date':jsonData.features[i].properties.obs_date,
              'flag':jsonData.features[i].properties.flag,
              'water_clarity':jsonData.features[i].properties.water_clarity,
              'water_temp':jsonData.features[i].properties.water_temp,
              'ph':jsonData.features[i].properties.ph,
              'diss_oxygen':jsonData.features[i].properties.diss_oxygen,
              'elec_cond':jsonData.features[i].properties.elec_cond,
            }));
          };
          storeSiteObs.sort('obs_date','ASC');

          // Remove any existing data in the tab panel
          var activeTab = dataTabPanel.items.indexOf(dataTabPanel.getActiveTab());
          dataTabPanel.removeAll();

          // Add the site details to tab 1
          var tab1Content  = '<p><b>Site name:</b> ' + siteRecord.get('site_name'); + '</p>';
          tab1Content += '<p><b>River name:</b> ' + siteRecord.get('river_name'); + '</p>';
          tab1Content += '<p><b>River category:</b> ' + siteRecord.get('river_cat'); + '</p>';
          tab1Content += '<p><b>Latitude:</b> ' + siteRecord.get('latitude'); + '</p>';
          tab1Content += '<p><b>Longitude:</b> ' + siteRecord.get('longitude'); + '</p>';
          tab1Content += '<p><b>Unique site name:</b> ' + siteRecord.get('combo_name'); + '</p>';
          tab1Content += '<p><b>Description:</b> ' + siteRecord.get('description'); + '</p>';
          tab1Content += '<p><b>Observations:</b> ' + storeSiteObs.getCount() + '</p>';

          dataTabPanel.add({
            title:'Site Details',
            html:tab1Content,
            padding:'5px',
            autoScroll:true,
          });

          // Add the table to tab 2
          if (storeSiteObs.getCount() >= 1) {

            // Create a grid panel to hold the data table
            var tablePanel = new Ext.grid.GridPanel({
              title:'Observations',
              store:storeSiteObs,
              columns:[
                {header:'Date (Obs ID)',dataIndex:'obs_date',align:'left',},
                {header:'User name',dataIndex:'user',align:'left',},
                {header:'Flat worms',dataIndex:'flatworms',width:90,align:'center',},
                {header:'Worms',dataIndex:'worms',width:90,align:'center',},
                {header:'Leeches',dataIndex:'leeches',width:90,align:'center',},
                {header:'Crabs/Shrimps',dataIndex:'crabs_shrimps',width:90,align:'center',},
                {header:'Stoneflies',dataIndex:'stoneflies',width:90,align:'center',},
                {header:'Minnow mayflies',dataIndex:'minnow_mayflies',width:90,align:'center',},
                {header:'Other mayflies',dataIndex:'other_mayflies',width:90,align:'center',},
                {header:'Damselflies',dataIndex:'damselflies',width:90,align:'center',},
                {header:'Dragonflies',dataIndex:'dragonflies',width:90,align:'center',},
                {header:'Bugs/beetles',dataIndex:'bugs_beetles',width:90,align:'center',},
                {header:'Caddisflies',dataIndex:'caddisflies',width:90,align:'center',},
                {header:'True flies',dataIndex:'true_flies',width:90,align:'center',},
                {header:'Snails',dataIndex:'snails',width:90,align:'center',},
                {header:'Score',dataIndex:'score',width:60,align:'right',},
                {header:'Status',dataIndex:'flag',width:65,align:'center',},
                {header:'Water clarity',dataIndex:'water_clarity',align:'right',},
                {header:'Water temp',dataIndex:'water_temp',align:'right',},
                {header:'pH',dataIndex:'ph',align:'right',},
                {header:'DO',dataIndex:'diss_oxygen',align:'right',},
                {header:'EC',dataIndex:'elec_cond',align:'right',},
              ],
            });
            dataTabPanel.add(tablePanel);
          }

          // Add the graph to tab 3
          if (storeSiteObs.getCount() >= 1) {
            // Create a panel to hold the graph
            var graphPanel = new Ext.Panel({
              title: 'River Health Graph',
              width:500,
              height:300,
              layout:'fit',
              items:{
                xtype:'columnchart',
                store:storeSiteObs,
                xField:'obs_date',
                yField:'score',
                xAxis:new Ext.chart.CategoryAxis({
                  title:'Date (Observation ID)',
                }),
                yAxis:new Ext.chart.NumericAxis({
                  title:'Score',
                  minimum:1,
                  maximum:10,
                  majorUnit:1,
                }),
                extraStyle:{
                  xAxis:{labelRotation:-45},
                  yAxis:{titleRotation:-90},
                  font:{name:'Verdana',size:10,},
                },
              },
            });
            dataTabPanel.add(graphPanel);
          }

          // Configure the Downloads button with the site id
          Ext.getCmp('id_download').handler = function(event,toolEl,panel){
            document.location.href = '/map/observations/download/' + selectedSite;
          };

          // Show the popup window
          if (activeTab == -1) activeTab = 0;
          dataTabPanel.setActiveTab(activeTab);
          dataWindow.show(this);

          // Zoom the map to the selected site
          var xyCoords = new OpenLayers.LonLat(
            siteRecord.get('longitude'),
            siteRecord.get('latitude')
          );
          map.setCenter(xyCoords.transform(proj4326, proj3857),15);

          // Show the marker
          showMarker(siteRecord.get('longitude'),siteRecord.get('latitude'))

        };
      },
      failure:function(response,opts){
        // Fail silently
      }
    });

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
    if (cqlFilter != '') params += '&CQL_FILTER=' + cqlFilter;
  return params;
}

function filterApply(){
/* This function applies a user-defined filter to the observations and then
 * updates the map.
*/
  // Get the values entered by the user
  var river_name = Ext.getCmp('id_filter_river').getValue();
  var sitename = Ext.getCmp('id_filter_sitename').getValue();
  var river_cat = Ext.getCmp('id_filter_category').getValue();
  var username = Ext.getCmp('id_filter_username').getValue();
  var organisation_name = Ext.getCmp('id_filter_organisation').getValue();
  var healthClass = Ext.getCmp('id_filter_class').getValue();
  var datestart = Ext.getCmp('id_filter_datestart').getRawValue();
  var dateend = Ext.getCmp('id_filter_dateend').getRawValue();
  var flag = Ext.getCmp('id_filter_flag').getValue();
  var flatworms = Ext.getCmp('id_filter_flatworms').getValue();
  var worms = Ext.getCmp('id_filter_worms').getValue();
  var leeches = Ext.getCmp('id_filter_leeches').getValue();
  var crabs_shrimps = Ext.getCmp('id_filter_crabsshrimps').getValue();
  var stoneflies = Ext.getCmp('id_filter_stoneflies').getValue();
  var minnow_mayflies = Ext.getCmp('id_filter_minnowmayflies').getValue();
  var other_mayflies = Ext.getCmp('id_filter_othermayflies').getValue();
  var damselflies = Ext.getCmp('id_filter_damselflies').getValue();
  var dragonflies = Ext.getCmp('id_filter_dragonflies').getValue();
  var bugs_beetles = Ext.getCmp('id_filter_bugsbeetles').getValue();
  var caddisflies = Ext.getCmp('id_filter_caddisflies').getValue();
  var true_flies = Ext.getCmp('id_filter_trueflies').getValue();
  var snails = Ext.getCmp('id_filter_snails').getValue();

  // Build the filter string
  cqlFilter = '';
  if (river_name != '') cqlFilter += "river_name ILIKE '%" + river_name + "%' AND ";
  if (sitename != '') cqlFilter += "site_name ILIKE '%" + sitename + "%' AND ";
  if (river_cat == 'Rocky' || river_cat == 'Sandy') cqlFilter += "river_cat ILIKE '%" + river_cat + "%' AND ";
  if (username != '') cqlFilter += "username ILIKE '%" + username + "%' AND ";
  if (organisation_name != '') cqlFilter += "organisation_name ILIKE '%" + organisation_name + "%' AND ";
  if (healthClass =='Very Poor'){
   cqlFilter += "((score > 0 AND score <= 4.3 AND river_cat = 'sandy')"
              + " OR (score > 0 AND score <= 5.1 AND river_cat = 'rocky')) AND ";
  } else if (healthClass =='Poor'){
   cqlFilter += "((score > 4.3 AND score <= 4.9 AND river_cat = 'sandy')"
              + " OR (score > 5.1 AND score <= 6.1 AND river_cat = 'rocky')) AND ";
  } else if (healthClass =='Fair'){
   cqlFilter += "((score > 4.9 AND score <= 5.8 AND river_cat = 'sandy')"
              + " OR (score > 6.1 AND score <= 6.8 AND river_cat = 'rocky')) AND ";
  } else if (healthClass =='Good'){
   cqlFilter += "((score > 5.8 AND score <= 6.9 AND river_cat = 'sandy')"
              + " OR (score > 6.8 AND score <= 7.9 AND river_cat = 'rocky')) AND ";
  } else if (healthClass =='Natural'){
   cqlFilter += "((score > 6.9 AND river_cat = 'sandy')"
              + " OR (score > 7.9 AND river_cat = 'rocky')) AND ";
  }
  if (datestart != '') cqlFilter += "obs_date>='" + datestart + "' AND ";
  if (dateend != '') cqlFilter += "obs_date<='" + dateend + "' AND ";
  if (flag == 'Verified') cqlFilter += "flag='clean' AND ";
  if (flag == 'Unverified') cqlFilter += "flag='dirty' AND ";
  if (flatworms != '') cqlFilter += "flatworms=" + flatworms + " AND ";
  if (worms != '') cqlFilter += "worms=" + worms + " AND ";
  if (leeches != '') cqlFilter += "leeches=" + leeches + " AND ";
  if (crabs_shrimps != '') cqlFilter += "crabs_shrimps=" + crabs_shrimps + " AND ";
  if (stoneflies != '') cqlFilter += "stoneflies=" + stoneflies + " AND ";
  if (minnow_mayflies != '') cqlFilter += "minnow_mayflies=" + minnow_mayflies + " AND ";
  if (other_mayflies != '') cqlFilter += "other_mayflies=" + other_mayflies + " AND ";
  if (damselflies != '') cqlFilter += "damselflies=" + damselflies + " AND ";
  if (dragonflies != '') cqlFilter += "dragonflies=" + dragonflies + " AND ";
  if (bugs_beetles != '') cqlFilter += "bugs_beetles=" + bugs_beetles + " AND ";
  if (caddisflies != '') cqlFilter += "caddisflies=" + caddisflies + " AND ";
  if (true_flies != '') cqlFilter += "true_flies=" + true_flies + " AND ";
  if (snails != '') cqlFilter += "snails=" + snails + " AND ";
console.log(cqlFilter);
  // Apply the filter
  if (cqlFilter != '') {
    cqlFilter = cqlFilter.replace(/ AND $/,'');
    layerMiniSASSObs.mergeNewParams({'CQL_FILTER':cqlFilter});
    document.getElementById('id_obs_filter_clear').src = '/static/img/button_obs_filter_clear.png';
    document.getElementById('id_legend_header').innerHTML = 'miniSASS Observations (Filtered)';
    filtered = true;
    Ext.getCmp('id_download_filtered').enable();
  } else {
    filterRemove();
    Ext.getCmp('id_download_filtered').disable();
  }
}

function filterRemove(){
/* This function removes the user-defined filter from the observations and then
 * updates the map to show all the observations. The filter form is also cleared.
*/
  // Remove the filter and redraw the layer
  delete layerMiniSASSObs.params.CQL_FILTER;
  layerMiniSASSObs.redraw();

  // Clear the filter form
  Ext.getCmp('id_filter_river').setValue();
  Ext.getCmp('id_filter_sitename').setValue();
  Ext.getCmp('id_filter_category').setValue('All');
  Ext.getCmp('id_filter_username').setValue();
  Ext.getCmp('id_filter_organisation').setValue();
  Ext.getCmp('id_filter_class').setValue('All');
  Ext.getCmp('id_filter_datestart').setRawValue();
  Ext.getCmp('id_filter_dateend').setRawValue();
  Ext.getCmp('id_filter_flag').setValue('All');
  Ext.getCmp('id_filter_flatworms').setValue();
  Ext.getCmp('id_filter_worms').setValue();
  Ext.getCmp('id_filter_leeches').setValue();
  Ext.getCmp('id_filter_crabsshrimps').setValue();
  Ext.getCmp('id_filter_stoneflies').setValue();
  Ext.getCmp('id_filter_minnowmayflies').setValue();
  Ext.getCmp('id_filter_othermayflies').setValue();
  Ext.getCmp('id_filter_damselflies').setValue();
  Ext.getCmp('id_filter_dragonflies').setValue();
  Ext.getCmp('id_filter_bugsbeetles').setValue();
  Ext.getCmp('id_filter_caddisflies').setValue();
  Ext.getCmp('id_filter_trueflies').setValue();
  Ext.getCmp('id_filter_snails').setValue();

  // Disable the clear filter button
  document.getElementById('id_obs_filter_clear').src = '/static/img/button_obs_filter_clear_disabled.png';
  document.getElementById('id_legend_header').innerHTML = 'miniSASS Observations';

  // Clean up
  filtered = false;
  cqlFilter = '';
  Ext.getCmp('id_download_filtered').disable();
}

function zoomFull() {
/* This function zooms the map to its full extent.
*/
  map.setCenter(new OpenLayers.LonLat(mapExtentX,mapExtentY),mapExtentZoom);
  hideMarker();
}

function escape(str) {
/* This function removes newline characters from a string.
*/
  return str
    .replace(/[\n]/g," ")
    .replace(/[\r]/g," ");
}

Ext.onReady(function() {
/* This function fires when the document is ready, before onload and
   before any images are loaded.
*/

  Ext.QuickTips.init();
  Ext.chart.Chart.CHART_URL = '/static/js/ext-3.4.0/resources/charts.swf';

  if (localhost == true) {
    geoserverURL = 'http://localhost:8080/geoserver/miniSASS/wms';
    geoserverCachedURL = 'http://localhost:8080/geoserver/miniSASS/wms';
  } else {
    geoserverURL = 'http://orasecom.org:8080/geoserver/wms';
    geoserverCachedURL = 'http://orasecom.org:8080/geoserver/gwc/service/wms?TILED=true';
  };

  // Define a store for holding data for sites
  storeSites = new Ext.data.ArrayStore({
    fields:['site_gid','river_name','site_name','combo_name','description','river_cat','longitude','latitude']
  });

  // Request a list of all sites
  Ext.Ajax.request({
    url:'/map/sites/-9/-9/-9/',
    success:function(response,opts){
      var jsonData = Ext.decode(escape(response.responseText));
      if (jsonData){
        for (var i=0; i<jsonData.features.length; i++){
          storeSites.add(new storeSites.recordType({
            'site_gid':jsonData.features[i].properties.gid,
            'river_name':jsonData.features[i].properties.river_name,
            'site_name':jsonData.features[i].properties.site_name,
            'combo_name':jsonData.features[i].properties.combo_name,
            'description':jsonData.features[i].properties.description,
            'river_cat':jsonData.features[i].properties.river_cat,
            'longitude':jsonData.features[i].geometry.coordinates[0],
            'latitude':jsonData.features[i].geometry.coordinates[1]
          }));
        };
      };
    },
    failure:function(response,opts){
      // Fail silently
    }
  });

  // Define a store for holding unique river names
  storeRiverNames = new Ext.data.ArrayStore({
    fields:['river_name']
  });

  // Request a list of all river names
  Ext.Ajax.request({
    url:'/map/unique/river_name/',
    success:function(response,opts){
      var jsonData = Ext.decode(escape(response.responseText));
      if (jsonData){
        for (var i=0; i<jsonData.features.length; i++){
          storeRiverNames.add(new storeRiverNames.recordType({
            'river_name':jsonData.features[i].properties.river_name,
          }));
        };
        storeRiverNames.sort('river_name','ASC');
      };
    },
    failure:function(response,opts){
      // Fail silently
    }
  });

  // Define a store for holding unique site names
  storeSiteNames = new Ext.data.ArrayStore({
    fields:['site_name']
  });

  // Request a list of all site names
  Ext.Ajax.request({
    url:'/map/unique/site_name/',
    success:function(response,opts){
      var jsonData = Ext.decode(escape(response.responseText));
      if (jsonData){
        for (var i=0; i<jsonData.features.length; i++){
          storeSiteNames.add(new storeSiteNames.recordType({
            'site_name':jsonData.features[i].properties.site_name,
          }));
        };
        storeSiteNames.sort('site_name','ASC');
      };
    },
    failure:function(response,opts){
      // Fail silently
    }
  });

  // Define a store for holding unique user names
  storeUserNames = new Ext.data.ArrayStore({
    fields:['user_name']
  });

  // Request a list of all user names
  Ext.Ajax.request({
    url:'/map/unique/user/',
    success:function(response,opts){
      var jsonData = Ext.decode(escape(response.responseText));
      if (jsonData){
        for (var i=0; i<jsonData.features.length; i++){
          storeUserNames.add(new storeUserNames.recordType({
            'user_name':jsonData.features[i].properties.user_name,
          }));
        };
        storeUserNames.sort('user_name','ASC');
     };
    },
    failure:function(response,opts){
      // Fail silently
    }
  });

  // Setup up combo boxes for displaying a list of all sites
  comboSitesData = new Ext.form.ComboBox({
    store:storeSites,
    width:220,
    listWidth:290,
    displayField:'combo_name',
    valueField:'site_gid',
    typeAhead:true,
    mode:'local',
    emptyText:'Select a site...',
  });

  // Setup up a combo box for zooming to sites
  comboZoomSites = new Ext.form.ComboBox({
    store:storeSites,
    listWidth:290,
    displayField:'combo_name',
    valueField:'site_gid',
    typeAhead:true,
    mode:'local',
    emptyText:'Select a site...',
    onSelect:function(record){
      // Zoom the map to the selected site
      var xyCoords = new OpenLayers.LonLat(
        record.get('longitude'),
        record.get('latitude')
      );
      map.setCenter(xyCoords.transform(proj4326, proj3857),15);

      // Show the marker
      showMarker(record.get('longitude'),record.get('latitude'))

      this.collapse();
      this.setValue(record.get('combo_name'));
    }
  });

  // Define a store for holding schools
  storeSchools = new Ext.data.Store({
    proxy:new Ext.data.HttpProxy({
      method:'GET',
      prettyUrls:false,
      url:'/map/schools',
      }),
    reader:new Ext.data.JsonReader({
      root:'schools',
      id:'school_gid'
    }, ['school_gid','school_name','longitude','latitude'])
  });

  // Setup up a combo box for schools
  comboZoomSchools = new Ext.form.ComboBox({
    hideTrigger:true,
    minChars:3,
    emptyText:'Type a school name...',
    store:storeSchools,
    displayField:'school_name',
    onSelect:function(record){
      // Zoom the map to the selected school
      var xyCoords = new OpenLayers.LonLat(
        record.get('longitude'),
        record.get('latitude')
      );
      map.setCenter(xyCoords.transform(proj4326, proj3857),15);

      // Show the marker
      showMarker(record.get('longitude'),record.get('latitude'))

      map.getLayersByName('Schools')[0].setVisibility(true);
      this.collapse();
      this.setValue(record.get('school_name'));
    }
  });

  // Define a handler to display Feature Info from a map click
  OpenLayers.Control.InfoClick = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions:{
      'single':true,
      'double':false,
      'pixelTolerance':0,
      'stopSingle':false,
      'stopDouble':false
    },
    initialize:function(options) {
      this.handlerOptions = OpenLayers.Util.extend(
        {}, this.defaultHandlerOptions
      );
      OpenLayers.Control.prototype.initialize.apply(
        this, arguments
      );
      this.handler = new OpenLayers.Handler.Click(
        this, {
          'click':this.trigger
        }, this.handlerOptions
      );
    },
    trigger:function (e) {
      obsTabPanel.removeAll();
      infoWindow.show();
      var WMSParams = getFeatureInfoParams(e.xy.x,e.xy.y,'text/html');
      Ext.Ajax.request({
        url:'/map/wms/~'+geoserverURL.replace('http://','')+'~'+WMSParams+'~',
        success:function(response,opts){
          if (response.responseText.length > 1) {
            // Split the observations into tabs and extract the dates
            var obsInfoCount = parseInt(response.responseText.substr(0,response.responseText.indexOf('#')));
            var obsInfoText = response.responseText.slice(response.responseText.indexOf('#')+1)
            var obsInfoDates = obsInfoText.split('<tr><td class="tdlabel">Date:</td><td class="tddata">');
            obsTabPanel.update(obsInfoText);
            // Display the dates in descending date order
            for (var i=obsInfoCount; i >= 1; i--) {
              var obsInfoDate = obsInfoDates[i].substring(0,obsInfoDates[i].indexOf('<'));
              if (!obsInfoDate) {obsInfoDate = 'No Observation';}
              obsTabPanel.add({contentEl:'id_obs_'+i, title:obsInfoDate});
            }
            obsTabPanel.setActiveTab(0);
          } else { // No observations were found
            var obsInfoText = '<p>No observations were found at the point you clicked.</p><p>Please click on a crab icon.</p>'
            obsTabPanel.update(obsInfoText);
            obsTabPanel.setActiveTab(0);
          }
        },
        failure:function(response,opts){
          infoWindow.update('Error: Could not request site information');
        }
      });
    }
  });

  // Define a handler for finding the site closest to a map click
  OpenLayers.Control.DataClick = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions:{
      'single':true,
      'double':false,
      'pixelTolerance':0,
      'stopSingle':false,
      'stopDouble':false
    },
    initialize:function(options) {
      this.handlerOptions = OpenLayers.Util.extend(
        {}, this.defaultHandlerOptions
      );
      OpenLayers.Control.prototype.initialize.apply(
        this, arguments
      );
      this.handler = new OpenLayers.Handler.Click(
        this, {
          'click':this.trigger
        }, this.handlerOptions
      );
    },
    trigger:function(e) {

      // Get the click coordinates and convert them to lon/lat
      clickCoords = map.getLonLatFromPixel(e.xy);

      // Look for the site closest to the click point
      var jsonData;
      function requestSite(callback){
        Ext.Ajax.request({
          url:'/map/closest_site/'+clickCoords.lon+'/'+clickCoords.lat+'/' + searchRadius + '/',
          success:function(response,opts){
            jsonData = Ext.decode(response.responseText);
            callback.call();
          },
          failure:function(response,opts){
            callback.call();  // Fail silently
          }
        });
      };

      var afterRequestSite = function(){
        // If nearby sites have been found, add them to the combo box
        if (jsonData && (jsonData.features.length > 0)){
          for (var i=0; i<jsonData.features.length; i++){
            var site_id = jsonData.features[i].properties.gid;
            var site_distance = jsonData.features[i].properties.distance;
            loadSelectedObs(site_id,storeSites);
          };
        };

      };

      // Request the closest sites and then callback to afterRequestSite after the Ajax response
      requestSite(afterRequestSite);
    }
  });

  // Define a new map
  map = new OpenLayers.Map(
    'map',{
      projection:proj3857,
      displayProjection:proj4326,
      units:'m',
      eventListeners:{'changebaselayer':mapBaseLayerChanged,'zoomend':mapZoomEnd}
    }
  );

  function mapBaseLayerChanged(event) {
  // This functions toggles the Provinces layer on/off with the Google satellite layer
    if (event.layer.name=='Google satellite') {
      map.getLayersByName('Provinces')[0].setVisibility(true);
    } else {
      map.getLayersByName('Provinces')[0].setVisibility(false);
    }
  };

  function mapZoomEnd(event) {

    if (map.zoom >= 16 && map.zoom < 20 && map.getLayersByName('Google terrain')[0].visibility == true) {
      // Switch from Google terrain to Google satellite if zoomed too close
      Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in this close on Google terrain.<br />Automatically switching to Google satellite.');
      map.setBaseLayer(layerGoogleSatellite);
      exceededZoom = 'Google terrain';
    }
    else if (map.zoom >= 20 && map.getLayersByName('Google satellite')[0].visibility == true) {
      // Switch from Google satellite to Google road map if zoomed too close
      Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in this close on Google satellite.<br />Automatically switching to Google road map.');
      map.setBaseLayer(layerGoogleRoadmap);
      exceededZoom = 'Google satellite';
    }
    else if (map.zoom >= 20 && map.getLayersByName('Google terrain')[0].visibility == true) {
      // Switch from Google terrain to Google road map if zoomed too close
      Ext.Msg.alert('Maximum Zoom', 'Cannot zoom in this close on Google terrain.<br />Automatically switching to Google road map.');
      map.setBaseLayer(layerGoogleRoadmap);
      exceededZoom = 'Google terrain';
    }

    // Switch back to Google terrain if within zoom range
    if (map.zoom < 16 && exceededZoom == 'Google terrain') {
      map.setBaseLayer(layerGoogleTerrain);
      exceededZoom = '';
    }
    // Switch back to Google satellite if within zoom range
    if (map.zoom < 20 && exceededZoom == 'Google satellite') {
      map.setBaseLayer(layerGoogleSatellite);
      exceededZoom = '';
    }
  };

  // Define the Google layers as base layers
  layerGoogleSatellite = new OpenLayers.Layer.Google(
    'Google satellite',
    {type:google.maps.MapTypeId.SATELLITE,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
  );
  layerGoogleTerrain = new OpenLayers.Layer.Google(
    'Google terrain',
    {type:google.maps.MapTypeId.TERRAIN,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
  );
  layerGoogleRoadmap = new OpenLayers.Layer.Google(
    'Google road map',
    {type:google.maps.MapTypeId.ROADMAP,maxZoomLevel:21,sphericalMercator:true,isBaseLayer:true}
  );

  // Define the miniSASS composite layer as a base layer
  layerMiniSASSBase = new OpenLayers.Layer.WMS(
    'Rivers and Catchments',
    geoserverCachedURL,
    {layers:'miniSASS:miniSASS_base',format:'image/png'},
    {isbaseLayer:true,numZoomLevels:22}
  );

  // Define the provinces layer
  layerProvinces = new OpenLayers.Layer.WMS(
    'Provinces',
    geoserverCachedURL,
    {layers:'miniSASS:miniSASS_admin',transparent:true,format:'image/png'},
    {isbaseLayer:false,visibility:true,displayInLayerSwitcher:false}
  );

  // Define the schools layer as an overlay
  layerSchools = new OpenLayers.Layer.WMS(
    'Schools',
    geoserverURL,
    {layers:'miniSASS:schools',transparent:true,format:'image/png'},
    {minScale:400000,isbaseLayer:false,visibility:false}
  );

  // Define the miniSASS observations as an overlay
  layerMiniSASSObs = new OpenLayers.Layer.WMS(
    'miniSASS Observations',
    geoserverURL,
    {layers:'miniSASS:minisass_observations',transparent:true,format:'image/png'},
    {isbaseLayer:false,visibility:true}
  );

  // Add the layers to the map
  map.addLayers([layerMiniSASSObs,layerSchools,layerProvinces,layerGoogleTerrain,layerGoogleSatellite,layerGoogleRoadmap,layerMiniSASSBase]);

  // If necessary, restore layer visibility saved from a previous state
  var layerStr = document.getElementById('id_layers').value;
  if (layerStr != ''){
    var layerArr = layerStr.split(',');
    for (var i=0; i < layerArr.length; i++) {
      if (layerArr[i]=='false') {map.layers[i].visibility = false;}
      else {map.layers[i].visibility = true;}
    }
  };

  // Add a layerswitcher
  map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));

  // Setup the coordinate display
  map.addControl(new OpenLayers.Control.MousePosition({
    numDigits:4,
    emptyString:'',
    formatOutput:function(coords){
      if (coords.lat < 0) var hemNS = 'S'
      else var hemNS = 'N';
      if (coords.lon < 0) var hemEW = 'W'
      else var hemEW = 'E';
      var markup = coords.lat.toFixed(4) + '&deg;' + hemNS + ' ';
      markup += coords.lon.toFixed(4) + '&deg;' + hemEW;
      return markup;
    },
  }));

  // Add the info click controller
  infoClick = new OpenLayers.Control.InfoClick();
  map.addControl(infoClick);

  // Add the data click controller
  dataClick = new OpenLayers.Control.DataClick();
  map.addControl(dataClick);

  // Setup the map panel
  var zoom_level = document.getElementById('id_zoom_level').value;
  var centreX = document.getElementById('id_centre_X').value;
  var centreY = document.getElementById('id_centre_Y').value;
  var mapPanel = new GeoExt.MapPanel({
    renderTo:'map',
    height:700,
    width:804,
    center:[centreX,centreY],
    zoom:zoom_level,
    map:map
  });

  /** Add the marker layer now that the map has been created **/
  // Define the marker layer
  var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
  layerMarker = new OpenLayers.Layer.Vector(
    "Site Location",
    {projection:proj3857,displayInLayerSwitcher:false,renderers:renderer}
  );

  // Set a default marker style
  OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '5';
  OpenLayers.Feature.Vector.style['default']['pointRadius'] = '12';
  OpenLayers.Feature.Vector.style['default']['strokeColor'] = '#ff0000';
  OpenLayers.Feature.Vector.style['default']['fillColor'] = '#ff0000';
  OpenLayers.Feature.Vector.style['default']['fillOpacity'] = 0.1;
  OpenLayers.Feature.Vector.style['select']['strokeWidth'] = '5';
  OpenLayers.Feature.Vector.style['select']['pointRadius'] = '12';
  OpenLayers.Feature.Vector.style['select']['strokeColor'] = '#ff0000';
  OpenLayers.Feature.Vector.style['select']['fillColor'] = '#ff0000';
  OpenLayers.Feature.Vector.style['select']['fillOpacity'] = 0.1;

  // Create a marker and add it to the marker layer
  markerPoint = new OpenLayers.Geometry.Point(0,-90);
  markerPoint.transform(proj4326, proj3857);
  layerMarker.addFeatures(new OpenLayers.Feature.Vector(markerPoint));
  map.addLayer(layerMarker);
  /** End of marker layer setup **/

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
    collapsed:false,
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
    items:[
      new Ext.Panel({
        border:false,
        bodyStyle:'padding:5px;background:#dfe8f6;',
        items:comboZoomSchools,
        html:'Start typing the name of the school you would like to zoom to.'
      }),
      new Ext.Panel({
        border:false,
        bodyStyle:'padding:5px;background:#dfe8f6;',
        items:comboZoomSites,
        html:'<br />Select a name from the drop-down list above. Names in this list are a combination of the river name, site name and the date the site was created.'
      })
    ]
  });

  // Define the miniSASS Site Data and Graphs panel
  var siteDataPanel = new Ext.Panel({
    title:'Site Data and Graphs',
    renderTo:'site_data',
    collapsible:true,
    collapsed:true,
    width:220,
    contentEl:'site_data_buttons'
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
    border:false,
    bodyStyle:'padding:2px;'
  });
  messagePanel.update(navMsg);

  // Define a tab panel for holding miniSASS observation information
  var obsTabPanel = new Ext.TabPanel({
    activeTab:0,
    frame:true,
    autoScroll:true,
    enableTabScroll:true,
    bbar:new Ext.Toolbar({
      items:[{
        xtype:'button',
        text:'New observation',
        tooltip:'Add a new observation to this site',
        ctCls:'x-btn-over',
        handler:function(event,toolEl,panel){redirectWindow.show(this);},
      }],
    }),
  });

  // Define a tab panel for showing site details, observations and graphs
  dataTabPanel = new Ext.TabPanel({
    activeTab:0,
    frame:true,
    bbar:new Ext.Toolbar({
      items:[{
        xtype:'button',
        id:'id_download',
        text:'Download',
        tooltip:'Download the observation(s) in CSV format',
        ctCls:'x-btn-over',
      }],
    }),
  });

  // Define a window to display miniSASS observation information
  infoWindow = new Ext.Window({
    title:'miniSASS observation details',
    width:500,
    height:480,
    layout:'fit',
    bodyStyle:'padding:5px;',
    closeAction:'hide',
    modal:false,
    constrain:true,
    items:[obsTabPanel]
  });
  infoWindow.show();
  infoWindow.hide();

  // Define a window to display site details, observations and graphs
  dataWindow = new Ext.Window({
    title:'Site Data and Graphs',
    width:500,
    height:480,
    layout:'fit',
    bodyStyle:'padding:5px;',
    closeAction:'hide',
    modal:false,
    constrain:true,
    items:[dataTabPanel]
  });

  // Define a window for filtering miniSASS observations
  filterWindow = new Ext.Window({
    title:'Filter Observations',
    width:470,
    height:420,
    layout:'fit',
    bodyStyle:'padding:5px;',
    closeAction:'hide',
    modal:false,
    constrain:true,
    items:[
      {
        xtype:'form',
        layout:'column',
        defaults:{
          layout:'form',
          border:false,
          bodyStyle:'padding:5px'
        },
        items:[
          { // Column 1
            columnWidth:0.65,
            defaults:{
              width:120
            },
            items:[
              {
                xtype:'label',
                fieldLabel:'',
                html:'You can filter observations using one or more of the criteria on this form. For text fields you can enter part or all of the name.<br />&nbsp;',
              },{
                xtype:'combo',
                fieldLabel:'River name',
                id:'id_filter_river',
                store:storeRiverNames,
                displayField:'river_name',
                valueField:'river_name',
                typeAhead:true,
                mode:'local',
              },{
                xtype:'combo',
                fieldLabel:'Site name',
                id:'id_filter_sitename',
                store:storeSiteNames,
                displayField:'site_name',
                valueField:'site_name',
                typeAhead:true,
                mode:'local',
              },{
                xtype:'combo',
                fieldLabel:'River category',
                id:'id_filter_category',
                store:['All','Rocky','Sandy'],
                triggerAction:'all',
                value:'All',
              },{
                xtype:'combo',
                fieldLabel:'User name',
                id:'id_filter_username',
                store:storeUserNames,
                displayField:'user_name',
                valueField:'user_name',
                typeAhead:true,
                mode:'local',
              },{
                xtype:'textfield',
                fieldLabel:'Organisation',
                id:'id_filter_organisation',
              },{
                xtype:'combo',
                fieldLabel:'Health class',
                id:'id_filter_class',
                store:['All','Very Poor','Poor','Fair','Good','Natural'],
                triggerAction:'all',
                value:'All',
              },{
                xtype:'datefield',
                fieldLabel:'Start date',
                id:'id_filter_datestart',
                format:"Y-m-d",
              },{
                xtype:'datefield',
                fieldLabel:'End date',
                id:'id_filter_dateend',
                format:"Y-m-d",
              },{
                xtype:'combo',
                fieldLabel:'Status',
                id:'id_filter_flag',
                store:['All','Verified','Unverified'],
                triggerAction:'all',
                value:'All',
              },
            ]
          },{ // Column 2
            columnWidth:0.35,
            defaultType:'checkbox',
            items:[
              {
                fieldLabel:'Flat worms',
                id:'id_filter_flatworms',
              },{
                fieldLabel:'Worms',
                id:'id_filter_worms',
              },{
                fieldLabel:'Leeches',
                id:'id_filter_leeches',
              },{
                fieldLabel:'Crabs/Shimps',
                id:'id_filter_crabsshrimps',
              },{
                fieldLabel:'Stoneflies',
                id:'id_filter_stoneflies',
              },{
                fieldLabel:'Minnow mayflies',
                id:'id_filter_minnowmayflies',
              },{
                fieldLabel:'Other mayflies',
                id:'id_filter_othermayflies',
              },{
                fieldLabel:'Damselflies',
                id:'id_filter_damselflies',
              },{
                fieldLabel:'Dragonflies',
                id:'id_filter_dragonflies',
              },{
                fieldLabel:'Bugs/beetles',
                id:'id_filter_bugsbeetles',
              },{
                fieldLabel:'Caddisflies',
                id:'id_filter_caddisflies',
              },{
                fieldLabel:'True flies',
                id:'id_filter_trueflies',
              },{
                fieldLabel:'Snails',
                id:'id_filter_snails',
              },
            ],
          }
        ],
      },
    ],
    buttons:[
      {
        text:'Apply Filter',
        tooltip:'Apply the filter',
        handler:function(){filterApply();}
      },{
        text:'Remove Filter',
        tooltip:'Remove the filter',
        handler:function(){filterRemove();}
      },{
        text:'Download',
        tooltip:'Download the filtered observations',
        id:'id_download_filtered',
        disabled:true,
        handler:function(){
          // Substitute the % symbols with + symbols to avoid problems with Django placeholders
          var downloadFilter = cqlFilter.replace(/%/g,'+');
          document.location.href = '/map/observations/download/filtered/~' + downloadFilter + '~';
        }
      },{
        text:'Close',
        tooltip:'Apply the filter and close this window',
        handler:function(){filterApply();filterWindow.hide();}
      },{
        text:'Cancel',
        tooltip:'Remove the filter and close this window',
        handler:function(){filterRemove();filterWindow.hide();}
      },
    ],
  });

  // Define the popup Site Data Selection window
  siteDataSelectWindow = new Ext.Window({
    title:'Existing observation sites',
    width:280,
    height:200,
    closeAction:'hide',
    modal:false,
    x:20,
    constrain:true,
    items:new Ext.Panel({
      border:false,
      bodyStyle:'padding:5px;background:#dfe8f6;',
      items:comboSitesData,
      html:'<br />Select a name from the drop-down list above. Names in this list are a combination of the river name, site name and the date the site was created.'
    }),
    buttons:[
      {
        text:'Show data',
        tooltip:'Display observations and graphs for the selected site',
        handler:function(){loadSelectedObs(comboSitesData.getValue(),storeSites);}
      },{
        text:'Clear selection',
        tooltip:'Clear the selected value in the drop-down list',
        handler:function(){comboSitesData.clearValue();}
      },{
        text:'Cancel',
        tooltip:'Cancel this window and return to the map',
        handler:function(){siteDataSelectWindow.hide();}
      }
    ]
  });

  // Define a window redirecting users to the login or register views
  redirectWindow = new Ext.Window({
    title:'Not logged in',
    width:240,
    height:140,
    closeAction:'hide',
    modal:true,
    constrain:true,
    items:new Ext.Panel({
      border:false,
      bodyStyle:'padding:5px;background:#dfe8f6;',
      html:'This tool is not active as you are not logged in. Please log in or register by clicking one of the buttons below.'
    }),
    buttons:[{
      text:'Login',
      tooltip:'Go to the Login page',
      width:60,
      handler:function(){
        document.location.href = '/en/accounts/login/?next=/en/map/';
      }
    },{
      text:'Register',
      tooltip:'Go to the Register page',
      width:60,
      handler:function(){
        document.location.href = '/en/accounts/register/';
      }
    },{
      text:'Cancel',
      tooltip:'Close this window and return to the map',
      width:60,
      handler:function(){redirectWindow.hide();}
    }]
  });

  // Link the Site Data Map Click input button
  var buttonMap = Ext.get('id_site_map');
  buttonMap.on('click', dataFromMap);

  // Link the Site Data Site List input button
  var buttonList = Ext.get('id_site_list');
  buttonList.on('click', function(){siteDataSelectWindow.show(this);});

  // Link the Observation Info button and activate it
  var buttonInfo = Ext.get('id_obs_info');
  buttonInfo.on('click', infoFromMap);
  infoFromMap();

  // Link the Data Input button
  var buttonAdd = Ext.get('id_obs_add');
  buttonAdd.on('click', function(){redirectWindow.show(this);});

  // Link the Map Click input button
  var buttonMap = Ext.get('id_obs_map');
  buttonMap.on('click', function(){redirectWindow.show(this);});

  // Link the Site List input button
  var buttonList = Ext.get('id_obs_list');
  buttonList.on('click', function(){redirectWindow.show(this);});

  // Link the Filter Observations button
  var buttonFilter = Ext.get('id_obs_filter');
  buttonFilter.on('click', function(){filterWindow.show(this);});

  // Link the Clear Filter button
  var buttonFilterClear = Ext.get('id_obs_filter_clear');
  buttonFilterClear.on('click', function(){
    if (filtered){filterRemove();filterWindow.hide();}
  });

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
