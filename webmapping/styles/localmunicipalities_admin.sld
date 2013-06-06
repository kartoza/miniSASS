<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>localmunicipalities2011</se:Name>
    <UserStyle>
      <se:Name>localmunicipalities2011</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>local municipalities</se:Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>cat2</ogc:PropertyName>
              <ogc:Literal>Local Municipality</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>600000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#2F4F4F</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
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
                            <se:SvgParameter name="font-weight">normal</se:SvgParameter>
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
          <se:Name>Metropolitan Municipality</se:Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>cat2</ogc:PropertyName>
              <ogc:Literal>Metropolitan Municipality</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#2F4F4F</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
           <se:TextSymbolizer>
                        <se:Label>
                            <ogc:PropertyName>municname</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">normal</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:PointPlacement>
                                <se:AnchorPoint>
                                    <se:AnchorPointX>0.0</se:AnchorPointX>
                                    <se:AnchorPointY>0.0</se:AnchorPointY>
                                </se:AnchorPoint>
                                <se:Displacement>
                                    <se:DisplacementX>0.0</se:DisplacementX>
                                    <se:DisplacementY>0.0</se:DisplacementY>
                                </se:Displacement>
                            </se:PointPlacement>
                        </se:LabelPlacement>
                        <se:Fill>
                            <se:SvgParameter name="fill">#000000</se:SvgParameter>
                        </se:Fill>
                        <se:VendorOption name="group">yes</se:VendorOption>
             </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
