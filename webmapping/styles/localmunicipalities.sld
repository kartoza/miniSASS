<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>localmunicipalities2011</se:Name>
    <UserStyle>
      <se:Name>localmunicipalities2011</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>local municipalities</se:Name>
          <se:MinScaleDenominator>1000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>600000</se:MaxScaleDenominator>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.26</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
            <se:TextSymbolizer>
                      
                       <se:Label>
                            <ogc:PropertyName>municname</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">6.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                                <se:PerpendicularOffset>10.0</se:PerpendicularOffset>
                            </se:LinePlacement>
                        </se:LabelPlacement>
                        <se:Fill>
                            <se:SvgParameter name="fill">#00000</se:SvgParameter>
                        </se:Fill>
                    </se:TextSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
