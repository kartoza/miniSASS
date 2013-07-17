<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>districtmunicipalities2011</se:Name>
    <UserStyle>
      <se:Name>districtmunicipalities2011</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>District_municipalities</se:Name>
          <se:MinScaleDenominator>600000</se:MinScaleDenominator>
           <se:MaxScaleDenominator>3000000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#2F4F4F</se:SvgParameter>
              
              <se:SvgParameter name="stroke-width">0.46</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
           <se:TextSymbolizer>
                      
                        <se:Label>
                            <ogc:PropertyName>municname</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">9.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                         <se:Geometry>
                           <ogc:Function name="centroid">
                           <ogc:PropertyName>the_geom</ogc:PropertyName>
                           </ogc:Function>
                          </se:Geometry>
                          <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>  
                          
                    </se:TextSymbolizer>
                     
        </se:Rule>
           <se:Rule>
          <se:Name>District_municipalities</se:Name>
          <se:MinScaleDenominator>600000</se:MinScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#2F4F4F</se:SvgParameter>
              
              <se:SvgParameter name="stroke-width">0.46</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>            
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
