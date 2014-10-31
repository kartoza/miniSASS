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
var mapClick;
var infoClick;
var inputWindow;
var infoWindow;
var siteWindow;
var filterWindow;
var filtered = false;
var cqlFilter = '';
var messagePanel;
var modifyControl;
var markerPoint;
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
var exceededZoom = '';    // Keep track of base layers zoomed beyond their limit
var editSite = true;      // Keep track of whether site data can be edited or not
var navMsg = 'Use the <b>+</b> and <b>–</b> buttons or the <i>mouse wheel</i> to '
           + '<b>zoom in or out</b> on the map. To <b>zoom in</b> <i>double-click</i> '
           + 'on the map or press <i>Shift</i> and <i>draw a rectangle</i>. <i>Click '
           + 'and hold</i> the mouse button to <b>drag the map</b> around.';

function convertDDtoDMS() {
/* Function to convert Decimal Degrees to Degrees Minutes Seconds.
*/
  var latD = parseFloat(document.getElementById('id_latitude').value);
  var lonD = parseFloat(document.getElementById('id_longitude').value);
  var hemNS = document.getElementById('id_hem_s').checked;
  var hemEW = document.getElementById('id_hem_e').checked;
  var DMS = new Array();
  // Convert the latitude
  DMS[0] = 0|(latD<0?latD=-latD:latD);
  DMS[1] = 0|latD%1*60;
  DMS[2] = (0|latD*60%1*600)/10;
  DMS[3] = hemNS?'S':'N';
  // Convert the longitude
  DMS[4] = 0|(lonD<0?lonD=-lonD:lonD);
  DMS[5] = 0|lonD%1*60;
  DMS[6] = (0|lonD*60%1*600)/10;
  DMS[7] = hemEW?'E':'W';
  return DMS;
}

function convertDMStoDD() {
/* Function to convert Degrees Minutes Seconds to Decimal Degrees.
*/
  var latD = parseInt(document.getElementById('id_lat_d').value);
  var latM = parseInt(document.getElementById('id_lat_m').value);
  var latS = parseFloat(document.getElementById('id_lat_s').value);
  var lonD = parseInt(document.getElementById('id_lon_d').value);
  var lonM = parseInt(document.getElementById('id_lon_m').value);
  var lonS = parseFloat(document.getElementById('id_lon_s').value);
  var hemNS = document.getElementById('id_hem_s').checked;
  var hemEW = document.getElementById('id_hem_e').checked;
  var DD = new Array();
  // Convert the latitude
  if (!latD) latD = 0;
  if (!latM) latM = 0;
  if (!latS) latS = 0;
  DD[0] = latD;
  if (DD[0] < 0) DD[0] = -1 * DD[0];
  if ((latM >= 0) && (latM <= 60)) DD[0] = DD[0] + latM/60;
  if ((latS >= 0) && (latS <= 60)) DD[0] = DD[0] + latS/3600;
  if (hemNS) {
    if (DD[0] > 0) DD[0] = -1 * DD[0];
  }
  // Convert the latitude
  if (!lonD) lonD = 0;
  if (!lonM) lonM = 0;
  if (!lonS) lonS = 0;
  DD[1] = lonD;
  if (DD[1] < 0) DD[1] = -1 * DD[1];
  if ((lonM >= 0) && (lonM <= 60)) DD[1] = DD[1] + lonM/60;
  if ((lonS >= 0) && (lonS <= 60)) DD[1] = DD[1] + lonS/3600;
  if (!hemEW) {
    if (DD[1] > 0) DD[1] = -1 * DD[1];
  }
  return DD;
}

function coords(format) {
/* This function switches the lat/lon coordinate display in the data
   entry window to either DMS or Decimal Degrees.
*/
  if (format == 'DMS') {
    document.getElementById('id_latitude').style.display = 'none';
    document.getElementById('id_lat_d').style.display = '';
    document.getElementById('id_lat_m').style.display = '';
    document.getElementById('id_lat_s').style.display = '';
    document.getElementById('id_longitude').style.display = 'none';
    document.getElementById('id_lon_d').style.display = '';
    document.getElementById('id_lon_m').style.display = '';
    document.getElementById('id_lon_s').style.display = '';
    var coordsDMS = convertDDtoDMS();
    document.getElementById('id_lat_d').value = coordsDMS[0];
    document.getElementById('id_lat_m').value = coordsDMS[1];
    document.getElementById('id_lat_s').value = coordsDMS[2];
    document.getElementById('id_lon_d').value = coordsDMS[4];
    document.getElementById('id_lon_m').value = coordsDMS[5];
    document.getElementById('id_lon_s').value = coordsDMS[6];
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
    document.getElementById('id_latitude').value = convertDMStoDD()[0].toFixed(6);
    document.getElementById('id_longitude').value = convertDMStoDD()[1].toFixed(6);
  }
}

function updateCoords(event) {
/* This function updates the latitude and longitude in the Data Input window
 * when the user drags the site marker to a new position on the screen.
 */
    // Get the marker coordinates and reproject them
    var xyCoords = new OpenLayers.LonLat(event.feature.geometry.x,event.feature.geometry.y);
    xyCoords.transform(proj3857,proj4326);

    // Update the lat/lon text fields and hemisphere selectors
    document.getElementById('id_latitude').value = xyCoords.lat.toFixed(6);
    document.getElementById('id_longitude').value = xyCoords.lon.toFixed(6);
    if (xyCoords.lat.toFixed(6) < 0) document.getElementById('id_hem_s').checked = true
    else document.getElementById('id_hem_n').checked = true;
    if (xyCoords.lon.toFixed(6) < 0) document.getElementById('id_hem_w').checked = true
    else document.getElementById('id_hem_e').checked = true;

    if (document.getElementById('id_DMS').checked) {
      coords('DMS');
    }
}

function zoomToCoords() {
/* This function zooms the map to the coordinates shown in the Data Input
 * window. If the user is entering a new site then the marker can be dragged
 * to a new position and the coordinates in the Data Input window are
 * automatically updated.
*/
  if (document.getElementById('id_DMS').checked==true){
    var coords = convertDMStoDD();
    var latitude = coords[0];
    var longitude = coords[1];
  } else {
    var latitude = parseFloat(document.getElementById('id_latitude').value);
    var longitude = parseFloat(document.getElementById('id_longitude').value);
    // Make sure the coordinates have the correct sign
    var hemS = document.getElementById('id_hem_s').checked;
    var hemW = document.getElementById('id_hem_w').checked;
    if (hemS && (latitude > 0)) latitude = -1 * latitude;
    if (hemW && (longitude > 0)) longitude = -1 * longitude;
    if (!hemS && (latitude < 0)) latitude = -1 * latitude;
    if (!hemW && (longitude < 0)) longitude = -1 * longitude;
  }
  if (latitude && longitude && (latitude != 0 || longitude != 0)){
    // Zoom the map to the coordinates
    var xyCoords = new OpenLayers.LonLat(longitude,latitude);
    map.setCenter(xyCoords.transform(proj4326, proj3857),13);

    // Setup the marker layer
    if (layerMarker) {
      // The marker layer already exists so update the coordinates
      markerPoint.x = longitude;
      markerPoint.y = latitude;
      // Reset the marker size
      OpenLayers.Feature.Vector.style['default']['pointRadius'] = '12';
      OpenLayers.Feature.Vector.style['select']['pointRadius'] = '12';
    } else {
      // The marker layer doesn't exist so create it
      var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
      renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
      layerMarker = new OpenLayers.Layer.Vector(
        "Site Location",
        {renderers:renderer}
      );

      // Add the marker layer to the map
      map.addLayer(layerMarker);

      // Create a control for moving the marker
      modifyControl = new OpenLayers.Control.ModifyFeature(layerMarker);
      map.addControl(modifyControl);

      // Update the coordinates in the form when the marker is dragged
      layerMarker.events.on({featuremodified:updateCoords});

      // Set a default marker style
      OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '5';
      OpenLayers.Feature.Vector.style['default']['pointRadius'] = '12';
      OpenLayers.Feature.Vector.style['default']['strokeColor'] = '#ff0000';
      OpenLayers.Feature.Vector.style['default']['fill'] = false;
      OpenLayers.Feature.Vector.style['select']['strokeWidth'] = '5';
      OpenLayers.Feature.Vector.style['select']['pointRadius'] = '12';
      OpenLayers.Feature.Vector.style['select']['strokeColor'] = '#cc0000';
      OpenLayers.Feature.Vector.style['select']['fill'] = false;

      // Create the marker and add it to the marker layer
      markerPoint = new OpenLayers.Geometry.Point(longitude,latitude);
      layerMarker.addFeatures(new OpenLayers.Feature.Vector(markerPoint));
    }
    markerPoint.transform(proj4326, proj3857);
    layerMarker.redraw();

    // If site editing is allowed then allow the user to move the marker
    if (editSite == true){
      modifyControl.activate();
      // Deactivate the map click and info click functions
      userFunction = 'mapclick';
      inputFromMap();
      userFunction = 'infoclick';
      infoFromMap();
      Ext.Msg.alert('Site Marker', 'The red circle on the map shows the position of the coordinates.<br />If it is in the wrong position then click on the green circle to select it<br />and then click and drag it to the correct position.');
    } else {
      modifyControl.deactivate();
    }
  } else {
    Ext.Msg.alert('Invalid Coordinates', 'The coordinates you have entered are invalid.<br />Please check them.');
  }
}

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
      document.getElementById('id_health_class').innerHTML = '&nbsp;';
    } else if (averageScore > 0 && averageScore <= 4.3 && riverCat == 'sandy'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_v_large.png';
      document.getElementById('id_health_class').innerHTML = 'Very Poor';
    } else if (averageScore > 0 && averageScore <= 5.1 && riverCat == 'rocky'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_v_large.png';
      document.getElementById('id_health_class').innerHTML = 'Very Poor';
    } else if (averageScore > 4.3 && averageScore <= 4.9 && riverCat == 'sandy'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_p_large.png';
      document.getElementById('id_health_class').innerHTML = 'Poor';
    } else if (averageScore > 5.1 && averageScore <= 6.1 && riverCat == 'rocky'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_p_large.png';
      document.getElementById('id_health_class').innerHTML = 'Poor';
    } else if (averageScore > 4.9 && averageScore <= 5.8 && riverCat == 'sandy'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_f_large.png';
      document.getElementById('id_health_class').innerHTML = 'Fair';
    } else if (averageScore > 6.1 && averageScore <= 6.8 && riverCat == 'rocky'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_f_large.png';
      document.getElementById('id_health_class').innerHTML = 'Fair';
    } else if (averageScore > 5.8 && averageScore <= 6.9 && riverCat == 'sandy'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_g_large.png';
      document.getElementById('id_health_class').innerHTML = 'Good';
    } else if (averageScore > 6.8 && averageScore <= 7.9 && riverCat == 'rocky'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_g_large.png';
      document.getElementById('id_health_class').innerHTML = 'Good';
    } else if (averageScore > 6.9 && riverCat == 'sandy'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_n_large.png';
      document.getElementById('id_health_class').innerHTML = 'Natural';
    } else if (averageScore > 7.9 && riverCat == 'rocky'){
      document.getElementById('id_crab').src = '/static/img/icon_crab_n_large.png';
      document.getElementById('id_health_class').innerHTML = 'Natural';
    }

  }

  // Enable/disable site editing as necessary
  enableEditSite(editSite);
}

function canSubmit(){
/* This function ensures that all form variables are correctly set
   when the data input form is submitted.
*/
  if (document.getElementById('id_river_name').value == '') {
    Ext.Msg.alert('River Name Error', 'Please enter a river name');
    return false;
  } else if (document.getElementById('id_site_name').value == '') {
    Ext.Msg.alert('Site Name Error', 'Please enter a site name');
    return false;
  } else if (document.getElementById('id_description').value == '') {
    Ext.Msg.alert('Site Description Error', 'Please enter a site description');
    return false;
  } else if ((document.getElementById('id_DMS').checked==true) && (convertDMStoDD()[0] == 0)) {
    Ext.Msg.alert('Latitude Error', 'Please enter a correct latitude');
    return false;
  } else if ((document.getElementById('id_DMS').checked==true) && (convertDMStoDD()[1] == 0)) {
    Ext.Msg.alert('Longitude Error', 'Please enter a correct longitude');
    return false;
  } else if ((document.getElementById('id_decimal').checked==true) && !parseFloat(document.getElementById('id_latitude').value)) {
    Ext.Msg.alert('Latitude Error', 'Please enter a correct latitude');
    return false;
  } else if ((document.getElementById('id_decimal').checked==true) && !parseFloat(document.getElementById('id_longitude').value)) {
    Ext.Msg.alert('Longitude Error', 'Please enter a correct longitude');
    return false;
  } else if (document.getElementById('id_river_cat').selectedIndex == 0) {
    Ext.Msg.alert('River Category and Groups error',
                  'Please select a river category and indicate<br />which insect groups you found');
    return false;
  } else if (document.getElementById('id_obs_date').value == '') {
    Ext.Msg.alert('Date Error', 'Please enter a valid date');
    return false;
  } else { // All the required fields are present
    if (editSite == true) {
      // convert coordinates to DD if they've been entered as DMS
      if (document.getElementById('id_DMS').checked==true) {
        document.getElementById('id_latitude').value = convertDMStoDD()[0].toFixed(6);
        document.getElementById('id_longitude').value = convertDMStoDD()[1].toFixed(6);
      }

      // make sure the coordinates have the correct sign
      var hemS = document.getElementById('id_hem_s').checked;
      var hemW = document.getElementById('id_hem_w').checked;
      if (hemS && (document.getElementById('id_latitude').value > 0)) {
          document.getElementById('id_latitude').value = -1 * document.getElementById('id_latitude').value;
      };
      if (hemW && (document.getElementById('id_longitude').value > 0)) {
          document.getElementById('id_longitude').value = -1 * document.getElementById('id_longitude').value;
      };
      if (!hemS && (document.getElementById('id_latitude').value < 0)) {
          document.getElementById('id_latitude').value = -1 * document.getElementById('id_latitude').value;
      };
      if (!hemW && (document.getElementById('id_longitude').value < 0)) {
          document.getElementById('id_longitude').value = -1 * document.getElementById('id_longitude').value;
      };
    };
    enableEditSite(true);

    // update the geometry field
    var theGeomString = document.getElementById('id_longitude').value + ' ' + document.getElementById('id_latitude').value;
    document.getElementById('id_the_geom').value = 'POINT(' + theGeomString + ')';

    // set the observations flag to Dirty
    document.getElementById('id_flag').value = 'dirty';

    // update the map variables
    var mapCenter = new OpenLayers.LonLat(
      document.getElementById('id_longitude').value,
      document.getElementById('id_latitude').value
    );
    mapCenter.transform(proj4326, proj3857);
    document.getElementById('id_zoom_level').value = 15;
    document.getElementById('id_centre_X').value = mapCenter.lon;
    document.getElementById('id_centre_Y').value = mapCenter.lat;
    var layerStr = map.layers[0].visibility + ',' + map.layers[1].visibility + ',' + map.baseLayer.name;
    document.getElementById('id_layers').value = layerStr;
    return true;
  }
}

function inputFromMap(){
/* This function toggles the 'input from map' button image, changes the
   map cursor and then activates/deactivates the mapClick control.
*/
  if (userFunction != 'mapclick') {
    document.getElementById('id_obs_map').src = '/static/img/button_obs_map_selected.png';
    document.getElementById('id_obs_info').src = '/static/img/button_obs_info.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'url(/static/img/target.cur),crosshair';
    var msg = 'Click the location of the observation on the map.<br />' + navMsg;
    messagePanel.update(msg);
    userFunction = 'mapclick';
    mapClick.activate();
    infoClick.deactivate();
    if (infoWindow.hidden == false) infoWindow.hide();
  } else {
    document.getElementById('id_obs_map').src = '/static/img/button_obs_map.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'auto';
    var msg = navMsg;
    messagePanel.update(msg);
    userFunction = 'none';
    mapClick.deactivate();
  }
}

function infoFromMap(){
/* This function toggles the 'info from map' button image, changes the
   map cursor and then activates/deactivates the infoClick control.
*/
  if (userFunction != 'infoclick') {
    document.getElementById('id_obs_info').src = '/static/img/button_obs_info_selected.png';
    document.getElementById('id_obs_map').src = '/static/img/button_obs_map.png';
    var mapViewPort = document.getElementsByClassName('olMapViewport');
    mapViewPort[0].style.cursor = 'url(/static/img/info.cur),crosshair';
    var msg = 'Click a miniSASS crab symbol to display details of the observations at that site.<br />' + navMsg;
    messagePanel.update(msg);
    userFunction = 'infoclick';
    infoClick.activate();
    mapClick.deactivate();
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

  // Reset the radio buttons
  document.getElementById('id_hem_s').checked = 'checked';
  document.getElementById('id_hem_e').checked = 'checked';
  document.getElementById('id_decimal').checked = 'checked';
  coords('Decimal');

  // Reset the totals and score
  updateInputForm('');

  // Enable the controls for site input variables
  editSite = true;
  enableEditSite(editSite)
  document.getElementById('id_edit_site').value = 'true';

  // Erase the observation link to the site id
  document.getElementById('id_site').value = '1';

}

function enableEditSite(enable){
/* This function enables or disables editing of site-related variables
   in the data input form.
*/
  document.getElementById('id_river_name').disabled = !enable;
  document.getElementById('id_site_name').disabled = !enable;
  document.getElementById('id_description').disabled = !enable;
  document.getElementById('id_river_cat').disabled = !enable;
  document.getElementById('id_latitude').disabled = !enable;
  document.getElementById('id_lat_d').disabled = !enable;
  document.getElementById('id_lat_m').disabled = !enable;
  document.getElementById('id_lat_s').disabled = !enable;
  document.getElementById('id_longitude').disabled = !enable;
  document.getElementById('id_lon_d').disabled = !enable;
  document.getElementById('id_lon_m').disabled = !enable;
  document.getElementById('id_lon_s').disabled = !enable;
  document.getElementById('id_hem_n').disabled = !enable;
  document.getElementById('id_hem_s').disabled = !enable;
  document.getElementById('id_hem_e').disabled = !enable;
  document.getElementById('id_hem_w').disabled = !enable;
}

function loadSelectedSite(selectedSite,store){
/* This function loads the data from the selected site into the
   fields of the data input form and then disables editing of these
   fields.
*/
  if (selectedSite != '') {
    resetInputForm();
    var siteRecord = store.getAt(store.find('site_gid',selectedSite));

    // Add the site data to the Data Input form
    document.getElementById('id_river_name').value = siteRecord.get('river_name');
    document.getElementById('id_site_name').value = siteRecord.get('site_name');
    document.getElementById('id_description').value = siteRecord.get('description');
    if (siteRecord.get('river_cat') == 'rocky'){
      document.getElementById('id_river_cat').selectedIndex = 1;
    } else if (siteRecord.get('river_cat') == 'sandy'){
      document.getElementById('id_river_cat').selectedIndex = 2;
    } else document.getElementById('id_river_cat').selectedIndex = 0;
    document.getElementById('id_latitude').value = siteRecord.get('latitude').toFixed(6);
    document.getElementById('id_longitude').value = siteRecord.get('longitude').toFixed(6);
    if (siteRecord.get('latitude').toFixed(6) < 0) document.getElementById('id_hem_s').checked = true
    else document.getElementById('id_hem_n').checked = true;
    if (siteRecord.get('longitude').toFixed(6) < 0) document.getElementById('id_hem_w').checked = true
    else document.getElementById('id_hem_e').checked = true;

    // Link the observation to the site id
    document.getElementById('id_site').value = siteRecord.get('site_gid');

    // Disable the site input controls and variables
    editSite = false;
    enableEditSite(editSite);
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

  // Apply the filter
  if (cqlFilter != '') {
    cqlFilter = cqlFilter.replace(/ AND $/,'');
    layerMiniSASSObs.mergeNewParams({'CQL_FILTER':cqlFilter});
    document.getElementById('id_obs_filter_clear').src = '/static/img/button_obs_filter_clear.png';
    document.getElementById('id_legend_header').innerHTML = 'miniSASS Observations (Filtered)';
    filtered = true;
  } else filterRemove();
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
  filtered = false;
  cqlFilter = '';
}

function zoomFull() {
/* This function zooms the map to its full extent.
*/
  map.setCenter(new OpenLayers.LonLat(mapExtentX,mapExtentY),mapExtentZoom);
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

  // Setup up a combo box for displaying a list of all sites
  comboSites = new Ext.form.ComboBox({
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
      map.getLayersByName('Schools')[0].setVisibility(true);
      this.collapse();
      this.setValue(record.get('school_name'));
    }
  });

  // Define a store for holding data for nearby sites
  storeNearbySites = new Ext.data.ArrayStore({
    fields:['site_gid','river_name','site_name','combo_name','description','river_cat','longitude','latitude']
  });

  // Setup up a combo box for displaying a list of nearby sites
  comboNearbySites = new Ext.form.ComboBox({
    store:storeNearbySites,
    listWidth:290,
    displayField:'combo_name',
    valueField:'site_gid',
    typeAhead:true,
    mode:'local',
    emptyText:'Nearby sites...',
  });

  // Define a handler for processing coordinates from a map click
  OpenLayers.Control.MapClick = OpenLayers.Class(OpenLayers.Control, {
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

      // Look for existing sites close to the click point
      var jsonData;
      function requestSites(callback){
        Ext.Ajax.request({
          url:'/map/sites/'+clickCoords.lon+'/'+clickCoords.lat+'/' + searchRadius + '/',
          success:function(response,opts){
            jsonData = Ext.decode(response.responseText);
            callback.call();
          },
          failure:function(response,opts){
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

        clickCoords.transform(proj3857, proj4326);
        var lat = clickCoords.lat.toFixed(6);
        var lon = clickCoords.lon.toFixed(6);
        var msg = 'You clicked at:<br />&nbsp;&nbsp;'
          + 'Latitude ' + lat + '&deg;<br />&nbsp;&nbsp;'
          + 'Longitude ' + lon + '&deg;<br />'
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
            var obsInfoText = response.responseText.slice(response.responseText.indexOf('#')+1);
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
          }
        },
        failure:function(response,opts){
          infoWindow.update('Error: Could not request site information');
        }
      });
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
    // Toggle the Provinces layer on/off with the Google satellite layer
    if (event.layer.name=='Google satellite') {
      map.getLayersByName('Provinces')[0].setVisibility(true);
    } else {
      map.getLayersByName('Provinces')[0].setVisibility(false);
    }
    if (exceededZoom != '') {
      exceededZoom = '';
    }
  };

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
    {isbaseLayer:true}
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
    // Set the miniSASS observations layer
    if (layerArr[0]=='false') {map.layers[0].setVisibility(false);}
    else {map.layers[0].setVisibility(true);}
    // Set the Schools layers
    if (layerArr[1]=='false') {map.layers[1].setVisibility(false);}
    else {map.layers[1].setVisibility(true);}
    // Set the base layer
    map.setBaseLayer(map.getLayersByName(layerArr[2])[0]);
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

  // Add the map click controller
  mapClick = new OpenLayers.Control.MapClick();
  map.addControl(mapClick);

  // Add the info click controller
  infoClick = new OpenLayers.Control.InfoClick();
  map.addControl(infoClick);

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
        html:'Select a name from the drop-down list above. Names in this list are a combination of the river name, site name and the date the observation was entered.'
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
    width:570,
    height:560,
    closeAction:'hide',
    modal:false,
    x:20,
    items:new Ext.Panel({
      applyTo:'data_panel',
      border:false
    }),
    buttons:[{
      text:'Save',
      tooltip:'Save this observation and return to the map',
      handler:function(){
        if (canSubmit()) document.forms['dataform'].submit();
      }
    },{
      text:'Close',
      tooltip:'Close this window but keep any data that has been entered',
      handler:function(){hideMarker();inputWindow.hide();}
    },{
      text:'Cancel',
      tooltip:'Close this window and erase any data that has been entered',
      handler:function(){hideMarker();resetInputForm();inputWindow.hide();}
    }],
    listeners:{
      'hide':function(win){hideMarker();},
    },
  });
  editSite = (document.getElementById('id_edit_site').value === 'true');
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
        handler:function(event,toolEl,panel){
          var selectedTab = obsTabPanel.items.indexOf(obsTabPanel.getActiveTab());
          if (selectedTab >= 0){
            // There are one or more observations displayed in the observation
            // info window so work out which one is being displayed and then load
            // it into the input form. The tabs are shown in descending date order
            // so start counting from the last tab backwards.
            var observation = obsTabPanel.items.length - selectedTab;
            var selectedSite = document.getElementById('id_sites_gid_'+observation).value;
            resetInputForm();
            infoWindow.hide();
            loadSelectedSite(selectedSite,storeSites);
            inputWindow.show(this);
          }
        },
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
    items:[obsTabPanel],
  });
  infoWindow.show();
  infoWindow.hide();

  // Define the popup Site Selection window
  siteWindow = new Ext.Window({
    title:'Existing observation sites',
    width:280,
    height:200,
    closeAction:'hide',
    modal:true,
    constrain:true,
    items:new Ext.Panel({
      border:false,
      bodyStyle:'padding:5px;background:#dfe8f6;',
      items:comboSites,
      html:'Select a name from the drop-down list above. Names in this list are a combination of the river name, site name and the date the observation was entered.'
    }),
    buttons:[{
      text:'Use selected site',
      tooltip:'Enter an observation at the selected site',
      handler:function(){
        resetInputForm();
        siteWindow.hide();
        loadSelectedSite(comboSites.getValue(),storeSites);
        comboSites.clearValue();
        inputWindow.show(this);
      }
    },{
      text:'Add a new site',
      tooltip:'Enter an observation at a new site',
      handler:function(){
        resetInputForm();
        siteWindow.hide();
        inputWindow.show(this);
      }
    },{
      text:'Cancel',
      tooltip:'Cancel this window and return to the map',
      handler:function(){siteWindow.hide();}
    }]
  });

  // Define the popup Map Click window
  mapClickWindow = new Ext.Window({
    width:300,
    height:300,
    closeAction:'hide',
    modal:true,
    constrain:true,
    items:[
      new Ext.Panel({
        id:'id_clicked_coords',
        border:false,
        title:'Map click position',
        bodyStyle:'padding:5px;background:#dfe8f6;',
        buttonAlign:'left',
        buttons:[{
          text:'Yes, create new site',
          tooltip:'Create a new observation site',
          handler:function(){
            resetInputForm();
            document.getElementById('id_latitude').value = clickCoords.lat.toFixed(6);
            document.getElementById('id_longitude').value = clickCoords.lon.toFixed(6);
            if (clickCoords.lat < 0) {
              document.getElementById('id_hem_s').checked = true;
            } else {
              document.getElementById('id_hem_n').checked = true;
            }
            if (clickCoords.lon < 0) {
              document.getElementById('id_hem_w').checked = true;
            } else {
              document.getElementById('id_hem_e').checked = true;
            }
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
        buttons:[{
          text:'Use nearby site',
          tooltip:'Enter an observation at the selected nearby site',
          handler:function(){
            resetInputForm();
            mapClickWindow.hide();
            loadSelectedSite(comboNearbySites.getValue(),storeNearbySites);
            inputWindow.show(this);
          }
        }]
      })
    ],
    buttons:[{
      text:'Cancel',
      tooltip:'Cancel this window and return to the map',
      handler:function(){mapClickWindow.hide();}
    }]
  });
  mapClickWindow.show();
  mapClickWindow.hide();

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
                xtype:'textfield',
                fieldLabel:'River name',
                id:'id_filter_river',
              },{
                xtype:'textfield',
                fieldLabel:'Site name',
                id:'id_filter_sitename',
              },{
                xtype:'combo',
                fieldLabel:'River category',
                id:'id_filter_category',
                store:['All','Rocky','Sandy'],
                triggerAction:'all',
                value:'All',
              },{
                xtype:'textfield',
                fieldLabel:'User name',
                id:'id_filter_username',
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

  // Link the Observation Info button and activate it
  var buttonInfo = Ext.get('id_obs_info');
  buttonInfo.on('click', infoFromMap);
  infoFromMap();

  // Link the Data Input button
  var buttonAdd = Ext.get('id_obs_add');
  buttonAdd.on('click', function(){inputWindow.show(this);});

  // Link the Map Click input button
  var buttonMap = Ext.get('id_obs_map');
  buttonMap.on('click', inputFromMap);

  // Link the Site List input button
  var buttonList = Ext.get('id_obs_list');
  buttonList.on('click', function(){siteWindow.show(this);});

  // Link the Filter Observations button
  var buttonFilter = Ext.get('id_obs_filter');
  buttonFilter.on('click', function(){filterWindow.show(this);});

  // Link the Clear Filter button
  var buttonFilterClear = Ext.get('id_obs_filter_clear');
  buttonFilterClear.on('click', function(){
    if (filtered){filterRemove();filterWindow.hide();}
  });

  // Create a button for checking user-entered coordinates
  var buttonCheckCoords = new Ext.Button({
    renderTo:'id_check_coords',
    text:'Show on map',
    tooltip:'Zoom the map to the latitude/longitude coordinates',
    handler:function(){zoomToCoords();},
  });

  // Re-open the Data Input window if an error has been returned
  if (document.getElementById('id_error').value == 'true'){
    document.getElementById('id_error').value = 'false';
    inputWindow.show(this);
  };

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

  // Define tooltips for the latitude/longitude input
  new Ext.ToolTip({
    target:'id_hem_s',
    html:'Choose S for locations in Africa south of the Equator. This includes all countries in southern Africa.'
  });
  new Ext.ToolTip({
    target:'id_hem_n',
    html:'Choose N for locations in Africa north of the Equator. This includes all countries in north and west Africa.'
  });
  new Ext.ToolTip({
    target:'id_hem_e',
    html:'Choose E for all locations in Africa south of the Equator. This includes all countries in southern Africa.'
  });
  new Ext.ToolTip({
    target:'id_hem_w',
    html:'Choose W for locations in the extreme west of Africa.'
  });

  // Define a tooltip for the river category
  new Ext.ToolTip({
    target:'id_river_cat',
    html:'If your river had no rocky habitats<br />that were sampled, select sandy'
  });
});
