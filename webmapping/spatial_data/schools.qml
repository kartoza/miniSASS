<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="1.8.0-Lisboa" minimumScale="0" maximumScale="1e+08" hasScaleBasedVisibilityFlag="0">
  <transparencyLevelInt>255</transparencyLevelInt>
  <renderer-v2 symbollevels="0" type="RuleRenderer">
    <rules>
      <rule scalemaxdenom="3100000" filter=" &quot;Phase&quot;  =  'Combined' " symbol="0" scalemindenom="150001" label="Combined"/>
      <rule scalemaxdenom="3100000" filter=" &quot;Phase&quot;  =  'Secondary' " symbol="1" scalemindenom="150001" label="Secondary"/>
      <rule scalemaxdenom="150000" filter=" &quot;Phase&quot;  =  'Secondary' " symbol="2" scalemindenom="1000" label="Secondary"/>
      <rule scalemaxdenom="3100000" filter=" &quot;Phase&quot;  =  'Primary' " symbol="3" scalemindenom="150001" label="Primary"/>
      <rule scalemaxdenom="150000" filter=" &quot;Phase&quot;  =  'Primary' " symbol="4" scalemindenom="1000" label="Primary"/>
      <rule scalemaxdenom="150000" filter=" &quot;Phase&quot;  =  'Intermediate' " symbol="5" scalemindenom="1000" label="Intermediate"/>
      <rule scalemaxdenom="3100000" filter=" &quot;Phase&quot;  =  'Intermediate' " symbol="6" scalemindenom="150001" label="Intermediate"/>
      <rule scalemaxdenom="150000" filter=" &quot;Phase&quot;  =  'Combined' " symbol="7" scalemindenom="1000" label="Combined"/>
    </rules>
    <symbols>
      <symbol outputUnit="MM" alpha="1" type="marker" name="0">
        <layer pass="0" class="SimpleMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="color" v="60,64,168,255"/>
          <prop k="color_border" v="0,0,0,255"/>
          <prop k="name" v="circle"/>
          <prop k="offset" v="0,0"/>
          <prop k="size" v="1.5"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="1">
        <layer pass="0" class="SimpleMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="color" v="70,193,249,255"/>
          <prop k="color_border" v="0,0,0,255"/>
          <prop k="name" v="circle"/>
          <prop k="offset" v="0,0"/>
          <prop k="size" v="1.5"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="2">
        <layer pass="0" class="SvgMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="fill" v="#000000"/>
          <prop k="name" v="/symbol/education_school.svg"/>
          <prop k="offset" v="0,0"/>
          <prop k="outline" v="#000000"/>
          <prop k="outline-width" v="1"/>
          <prop k="size" v="4"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="3">
        <layer pass="0" class="SimpleMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="color" v="168,90,31,255"/>
          <prop k="color_border" v="0,0,0,255"/>
          <prop k="name" v="circle"/>
          <prop k="offset" v="0,0"/>
          <prop k="size" v="1.5"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="4">
        <layer pass="0" class="SvgMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="fill" v="#000000"/>
          <prop k="name" v="/symbol/education_school.svg"/>
          <prop k="offset" v="0,0"/>
          <prop k="outline" v="#000000"/>
          <prop k="outline-width" v="1"/>
          <prop k="size" v="4"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="5">
        <layer pass="0" class="SvgMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="fill" v="#000000"/>
          <prop k="name" v="/symbol/education_school.svg"/>
          <prop k="offset" v="0,0"/>
          <prop k="outline" v="#000000"/>
          <prop k="outline-width" v="1"/>
          <prop k="size" v="4"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="6">
        <layer pass="0" class="SimpleMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="color" v="206,139,147,255"/>
          <prop k="color_border" v="0,0,0,255"/>
          <prop k="name" v="circle"/>
          <prop k="offset" v="0,0"/>
          <prop k="size" v="1.5"/>
        </layer>
      </symbol>
      <symbol outputUnit="MM" alpha="1" type="marker" name="7">
        <layer pass="0" class="SvgMarker" locked="0">
          <prop k="angle" v="0"/>
          <prop k="fill" v="#000000"/>
          <prop k="name" v="/symbol/education_school.svg"/>
          <prop k="offset" v="0,0"/>
          <prop k="outline" v="#6c7be1"/>
          <prop k="outline-width" v="1"/>
          <prop k="size" v="4"/>
        </layer>
      </symbol>
    </symbols>
  </renderer-v2>
  <customproperties/>
  <displayfield>Province</displayfield>
  <label>0</label>
  <labelattributes>
    <label fieldname="" text="Label"/>
    <family fieldname="" name="Ubuntu"/>
    <size fieldname="" units="pt" value="12"/>
    <bold fieldname="" on="0"/>
    <italic fieldname="" on="0"/>
    <underline fieldname="" on="0"/>
    <strikeout fieldname="" on="0"/>
    <color fieldname="" red="0" blue="0" green="0"/>
    <x fieldname=""/>
    <y fieldname=""/>
    <offset x="0" y="0" units="pt" yfieldname="" xfieldname=""/>
    <angle fieldname="" value="0" auto="0"/>
    <alignment fieldname="" value="center"/>
    <buffercolor fieldname="" red="255" blue="255" green="255"/>
    <buffersize fieldname="" units="pt" value="1"/>
    <bufferenabled fieldname="" on=""/>
    <multilineenabled fieldname="" on=""/>
    <selectedonly on=""/>
  </labelattributes>
  <edittypes>
    <edittype type="0" name="Latitude"/>
    <edittype type="0" name="Longitude"/>
    <edittype type="0" name="NatEmis"/>
    <edittype type="0" name="Phase"/>
    <edittype type="0" name="Province"/>
    <edittype type="0" name="School"/>
  </edittypes>
  <editform></editform>
  <editforminit></editforminit>
  <annotationform></annotationform>
  <attributeactions/>
</qgis>
