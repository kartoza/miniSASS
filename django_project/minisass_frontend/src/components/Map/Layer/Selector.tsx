import React, { useState } from "react";
import maplibregl, { AddLayerObject, SourceSpecification } from 'maplibre-gl';
import LayersIcon from "../../../static/icons/LayersIcon";

import Basemap, { BasemapConfiguration } from "./Basemap"

import "./style.css"

interface Interface {
  map: maplibregl.Map,
  renderLayer: (id: string, source: SourceSpecification, layer: AddLayerObject, before: string) => void,
  basemaps: Array<BasemapConfiguration>,
}

const BASEMAP_ID = `basemap`

/**
 * Layer selector component
 * @param props
 * @constructor
 */
export default function Selector(props: Interface) {
  const [open, setOpen] = useState<boolean>(false);
  return <div
    className={
      'LayerSelector drop-shadow-lg ' + (open ? 'maximized' : 'minimized')
    }
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
  >
    <div className='minimized'>
      <LayersIcon props={undefined}/>
    </div>
    <div className='maximized p-[0.5rem]'>
      <div className="font-bold mb-[0.5rem]">Base Layer</div>
      <Basemap
        basemapChanged={(basemapConfig) => {
          const layers = props.map.getStyle().layers.filter(layer => layer.id !== BASEMAP_ID)
          const config = basemapConfig.config
          props.renderLayer(
            BASEMAP_ID,
            config,
            {
              "type": "raster",
              "id": "basemap",
              "source": "basemap",
              ...config,
            },
            layers[0]?.id
          )
        }}
        items={props.basemaps}
      />
    </div>
  </div>
}
