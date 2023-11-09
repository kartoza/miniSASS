import React, { useEffect, useState } from "react";
import maplibregl, { AddLayerObject, SourceSpecification } from 'maplibre-gl';

import LayerSelector from "./Layer/Selector";
import { BasemapConfiguration } from "./Layer/Basemap"
import { removeLayer, removeSource } from "./utils"

import 'maplibre-gl/dist/maplibre-gl.css';


const BASEMAP_ID = `basemap`

interface Interface {
  basemaps: Array<BasemapConfiguration>,
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

  /*** Render layer to maplibre */
  const renderLayer = (id: string, source: SourceSpecification, layer: AddLayerObject, before: string = null) => {
    removeLayer(map, id)
    removeSource(map, id)
    map.addSource(id, source)
    return map.addLayer(layer, before);
  }

  return <div id="map" className="w-full h-full bg-slate-200">
    {
      map ?
        <LayerSelector
          map={map} basemaps={props.basemaps} renderLayer={renderLayer}/> :
        null
    }
  </div>
}
