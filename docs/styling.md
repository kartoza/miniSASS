Follow up to Install.md outlining styling
======================================
 Once data has been loaded into postgis it is styled either by using qgis or udig


-- In order to style the layers we followed the specifications for styling for the NGI 1 in 50k topostylesheets which outlines how rivers, boundaries need to be styled as well as the specifications for the miniSASS.

--There are two sets of river layers, the 1in500k and 1in50k all which have been styled according to the NGI classification.

-- The 1in 50k rivers are not labelled and hence we have labelled them with the 1in500k labels as they are spatially correct.


--Country boundary and provincial boundaries styles come from the NGI specification but the other clasess for local municipalities, district municipalities are styled accordingly for nice cartographic rendering.


--Once all the layers were styled and the styles applied to geoserver and the layers published there were issues which needed to be resolved or extensions which were used for nice rendering and cartography.

--Geoserver supports extensions which allows data to be styled more dynamically and the following have been used in order to have a nice rendering effect.

--For the river the geoserver vendor option was applied in order to allow the river label to follow the river lines.

>> example: <se:VendorOption name="followLine">true</se:VendorOption>  

--For all other polygon labels there was an issue with metatiling as multiple labels were being labelled during the rendering and this was corrected by having a label on the centroid of the polygon with the following function in geoserver:

>>                            <se:Geometry>
>>                           <ogc:Function name="centroid">
>>                           <ogc:PropertyName>the_geom</ogc:PropertyName>
>>                           </ogc:Function>
>>                          </se:Geometry> 

--After styling had been achieved all the layers were then put in a group layer for the miniSASS base layer.

 Another group layer was created which is the miniSASS_admin layer which contains all the administrative boundaries of South Africa and neighbouring countries. 

-- The miniSASS_admin layer group is styled differently to the miniSASS base layer group as it is only served up with google satellite imagery hence the need for all the features to be distinct against a dark background.

-- The labels in the miniSASS_admin layer group were given a fair bit of halo to allow them to be visible against a dark background.



