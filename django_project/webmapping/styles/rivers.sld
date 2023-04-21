<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>rivers</se:Name>
    <UserStyle>
      <se:Name>rivers</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Dry</se:Name>
 
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Dry</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>   
      <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>
             <se:TextSymbolizer>
                      
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                               <se:PerpendicularOffset>10.0</se:PerpendicularOffset>
                            </se:LinePlacement>
                        </se:LabelPlacement>
                          <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                      
            <se:VendorOption name="followLine">true</se:VendorOption>                    
          </se:TextSymbolizer>
        </se:Rule>

           <se:Rule>
          <se:Name>Unknown</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Unknown</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           
           <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>
           <se:TextSymbolizer>                         
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                             <se:PerpendicularOffset>10.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                         <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                     <se:VendorOption name="followLine">true</se:VendorOption>        
                    </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Perennial</se:Name>
          
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Perennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>
                      
<se:TextSymbolizer>            
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                              <se:PerpendicularOffset>2.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                           <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                       <se:VendorOption name="followLine">true</se:VendorOption>     
                    </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>NonPerennial</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>NonPerennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>100000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>
           <se:TextSymbolizer>
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                              <se:PerpendicularOffset>6.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                           <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                       <se:VendorOption name="followLine">true</se:VendorOption>     
                    </se:TextSymbolizer>
        </se:Rule>
          
        <se:Rule>
          <se:Name>Dry</se:Name>
 
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Dry</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
      <se:MinScaleDenominator>100000</se:MinScaleDenominator>      
      <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>         
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">4 2</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>                    
             <se:TextSymbolizer>
                      
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                               <se:PerpendicularOffset>10.0</se:PerpendicularOffset>
                            </se:LinePlacement>
                        </se:LabelPlacement>
                           <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                      <se:VendorOption name="followLine">true</se:VendorOption>     
                    </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Unknown</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Unknown</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:MinScaleDenominator>100000</se:MinScaleDenominator>
           <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>          
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>
             
           <se:TextSymbolizer>                         
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                             <se:PerpendicularOffset>10.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                          <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                       <se:VendorOption name="followLine">true</se:VendorOption>      
                    </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Perennial</se:Name>
          
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Perennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>100000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>          
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>            
            <se:TextSymbolizer>            
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                              <se:PerpendicularOffset>6.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                          <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                       <se:VendorOption name="followLine">true</se:VendorOption>     
                    </se:TextSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>NonPerennial</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>NonPerennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>100000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500000</se:MaxScaleDenominator>   
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">4 2</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>
        
             <se:TextSymbolizer>
                        <se:Label>
                            <ogc:PropertyName>name</ogc:PropertyName>
                        </se:Label>
                        <se:Font>
                            <se:SvgParameter name="font-family">Arial</se:SvgParameter>
                            <se:SvgParameter name="font-size">8.0</se:SvgParameter>
                            <se:SvgParameter name="font-style">normal</se:SvgParameter>
                            <se:SvgParameter name="font-weight">bold</se:SvgParameter>
                        </se:Font>
                        <se:LabelPlacement>
                            <se:LinePlacement>
                              <se:PerpendicularOffset>6.0</se:PerpendicularOffset>   
                            </se:LinePlacement>
                        </se:LabelPlacement>
                            <se:Halo>
                            <se:Radius>1</se:Radius>
                            <se:Fill>
                                <se:SvgParameter name="fill">#FFFFFF</se:SvgParameter>
                            </se:Fill>
                        </se:Halo>
                        <se:Fill>
                            <se:SvgParameter name="fill">#0021FF</se:SvgParameter>
                        </se:Fill>
                       <se:VendorOption name="followLine">true</se:VendorOption>     
                    </se:TextSymbolizer>
        </se:Rule>
          <se:Rule>
          <se:Name>Dry</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Dry</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
            <se:MinScaleDenominator>100000</se:MinScaleDenominator>
            <se:MaxScaleDenominator>10000000</se:MaxScaleDenominator>      
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">4 2</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>                    
             
        </se:Rule>
        <se:Rule>
          <se:Name>Unknown</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Unknown</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
            <se:MinScaleDenominator>100000</se:MinScaleDenominator>
            <se:MaxScaleDenominator>10000000</se:MaxScaleDenominator>            
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>
             
           
        </se:Rule>
        <se:Rule>
          <se:Name>Perennial</se:Name>
          
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>Perennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>100000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>20000000</se:MaxScaleDenominator>             
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>            
           
        </se:Rule>
        <se:Rule>
          <se:Name>NonPerennial</se:Name>
           
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>class</ogc:PropertyName>
              <ogc:Literal>NonPerennial</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:MinScaleDenominator>100000</se:MinScaleDenominator>
           <se:MaxScaleDenominator>10000000</se:MaxScaleDenominator>     
          <se:LineSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#6998C9</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.10</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">4 2</se:SvgParameter>
                        </se:Stroke>
                    </se:LineSymbolizer>
        
             
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>