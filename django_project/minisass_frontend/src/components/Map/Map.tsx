import React, { useEffect, useState } from "react";
import maplibregl, { AddLayerObject, SourceSpecification } from 'maplibre-gl';

import LayerSelector from "./Layer/Selector";
import { BasemapConfiguration } from "./Layer/Basemap"
import { layerConfiguration } from "./Layer/Overlay";
import { hasSource, removeLayer, removeSource } from "./utils"

import 'maplibre-gl/dist/maplibre-gl.css';


const BASEMAP_ID = `basemap`

interface Interface {
  basemaps: Array<BasemapConfiguration>,
  overlayLayers: Array<layerConfiguration>,
}


/**
 * Map component using maplibre
 * @param props
 * @constructor
 */
export default function Map(props: Interface) {
  const [map, setMap] = useState<maplibregl.Map>(null);

  /** First initiate */
  useEffect(() => {
    if (!map) {
      const newMap = new maplibregl.Map(
        {
          container: 'map',
          style: {
            version: 8,
            sources: {},
            layers: [],
            glyphs: "/static/fonts/{fontstack}/{range}.pbf"
          },
          center: [24.679864950000024, -28.671882886975247],
          zoom: 5.3695883239884745,
          attributionControl: false
        }
      ).addControl(
        new maplibregl.AttributionControl({ compact: true })
      );
      newMap.once("load", () => {
        setMap(newMap)
        newMap.fitBounds([
          [16.4679158, -34.8344038],
          [32.8918141, -22.1246704]
        ]);
      })
      newMap.addControl(new maplibregl.NavigationControl(), 'top-right');
    }
  }, []);

  /*** Show layer to maplibre */
  const showLayer = (
    id: string, source: SourceSpecification, layer: AddLayerObject,
    before: string = null, rerender: boolean = false
  ) => {
    removeLayer(map, id)
    if (!hasSource(map, id) || rerender) {
      removeSource(map, id)
      map.addSource(id, source)
    }
    map.addLayer(layer, before);
  }

  /*** Hide layer to maplibre */
  const hideLayer = (id: string) => {
    removeLayer(map, id)
  }

  return <div id="map" className="w-full h-full bg-slate-200">
    {
      map ?
        <LayerSelector
          map={map}
          basemaps={props.basemaps}
          overlayLayers={props.overlayLayers}
          showLayer={showLayer}
          hideLayer={hideLayer}
        /> :
        null
    }
  </div>
}
