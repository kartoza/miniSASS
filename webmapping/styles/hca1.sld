<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>hca1</se:Name>
    <UserStyle>
      <se:Name>hca1</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Single symbol</se:Name>
          <se:MinScaleDenominator>900000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>7000000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FF0045</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.20</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
           <se:TextSymbolizer>
                        <se:Label>
                            <ogc:PropertyName>primry</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">12.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">normal</se:SvgParameter>
                        </se:Font>
                        <se:Geometry>
                           <ogc:Function name="centroid">
                           <ogc:PropertyName>geom</ogc:PropertyName>
                           </ogc:Function>
                          </se:Geometry>         
                           <se:Halo>
                            <se:Radius>2</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#FF0045</se:SvgParameter>
                        </se:Fill>
                    </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
