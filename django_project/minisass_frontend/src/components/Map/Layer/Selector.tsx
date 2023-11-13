import React, { useState } from "react";
import maplibregl, { AddLayerObject, SourceSpecification } from 'maplibre-gl';
import LayersIcon from "../../../../static/icons/LayersIcon";

import Basemap, { BasemapConfiguration } from "./Basemap"
import Overlay, { layerConfiguration } from "./Overlay"

import "./style.css"

interface Interface {
  map: maplibregl.Map,
  basemaps: BasemapConfiguration[],
  overlayLayers: layerConfiguration[],

  showLayer: (
    id: string, source: SourceSpecification, layer: AddLayerObject, before: string, rerender: boolean
  ) => void,
  hideLayer: (id: string) => void,
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
          props.showLayer(
            BASEMAP_ID,
            config,
            {
              "type": "raster",
              "id": "basemap",
              "source": "basemap",
              ...config,
            },
            layers[0]?.id,
            true
          )
        }}
        items={props.basemaps}
      />
      <br/>
      <div className="font-bold mb-[0.5rem]">Overlay Layer</div>
      {
        props.overlayLayers.map(
          (layerConfig, idx) => {
            const id = 'overlay-' + idx
            return <Overlay
              key={id}
              show={(layerConfig, rerender) => {
                const config = layerConfig.config
                const layers = props.map.getStyle().layers.filter(layer => (layer.id.includes('overlay') && layer.id > id) || layer.id.includes('highlight'))
                props.showLayer(
                  id,
                  config,
                  {
                    "type": "raster",
                    "id": id,
                    "source": id,
                    ...config,
                  },
                  layers[layers.length - 1]?.id,
                  rerender
                )
              }}
              hide={() => {
                props.hideLayer(id)
              }}
              layerConfig={layerConfig}/>
          }
        )
      }
    </div>
  </div>
}
