import React, { useEffect, useState } from "react";
import maplibregl from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

interface MapInterface {
}

/**
 * Map component that using maplibre
 * @param props
 * @constructor
 */
export default function Map(props: MapInterface) {
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
          center: [0, 0],
          zoom: 1,
          attributionControl: false
        }
      ).addControl(
        new maplibregl.AttributionControl({ compact: true })
      );
      newMap.once("load", () => {
        setMap(newMap)
      })
      newMap.addControl(new maplibregl.NavigationControl(), 'top-right');
    }
  }, []);

  return <div id="map" className="w-full h-full bg-slate-200"></div>
}
