import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import maplibregl, { AddLayerObject, SourceSpecification } from 'maplibre-gl';
import { bbox } from '@turf/turf';

import LayerSelector from "./Layer/Selector";
import { BasemapConfiguration } from "./Layer/Basemap"
import { layerConfiguration } from "./Layer/Overlay";
import { hasLayer, hasSource, removeLayer, removeSource } from "./utils"
import { minisassObservationId } from "./Layer/MinisassLayer";

import 'maplibre-gl/dist/maplibre-gl.css';

interface Interface {
  basemaps: BasemapConfiguration[],
  overlayLayers: layerConfiguration[],
}

const HIGHLIGHT_ID = 'highlight'
const HIGHLIGHT_COLOR = `rgb(255, 0, 0)`
const HIGHLIGHT_OPACITY = 0.3
const HIGHLIGHT_WIDTH = 3
const HIGHLIGHT_CIRCLE_ID = HIGHLIGHT_ID + '-circle'
const HIGHLIGHT_LINE_ID = HIGHLIGHT_ID + '-line'
const HIGHLIGHT_POLYGON_ID = HIGHLIGHT_ID + '-polygon'

/**
 * Map component using maplibre
 * @param props
 * @constructor
 */
export const Map = forwardRef((props: Interface, ref) => {
    const [map, setMap] = useState<maplibregl.Map>(null);

    /** Update highlight geosjon **/
    useImperativeHandle(ref, () => ({
      updateHighlighGeojson(geojson) {
        addHighlight(geojson)
      }
    }));

    /** First initiate */
    useEffect(() => {
      if (!map) {
        (
          async () => {
            const response = await fetch('https://raw.githubusercontent.com/kartoza/miniSASS/main/django_project/webmapping/styles/minisass_style_v1.json');
            const styles = await response.json();
            const urlTile = new URL(styles.sources[minisassObservationId].tiles[0])
            const currUrl = new URL(window.location)
            currUrl.pathname = urlTile.pathname
            styles.sources[minisassObservationId].tiles[0] = decodeURIComponent(currUrl.href)

            // Just using 'MiniSASS Observations' source
            for (const [key, value] of Object.entries(styles.sources)) {
              if (key !== minisassObservationId) {
                delete styles.sources[key]
              }
            }
            styles.layers = styles.layers.filter(layer => layer.source === minisassObservationId)

            const newMap = new maplibregl.Map(
              {
                container: 'map',
                style: styles,
                center: [24.679864950000024, -28.671882886975247],
                zoom: 5.3695883239884745,
                attributionControl: false,
                maxZoom: 17
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
            newMap.addControl(new maplibregl.NavigationControl(), 'top-left');
          }
        )();
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


    /*** Add highlight */
    const addHighlight = (geojson) => {
      if (!map) {
        return
      }
      try {
        // Remove highlight layer
        if (hasLayer(map, HIGHLIGHT_CIRCLE_ID)) {
          map.removeLayer(HIGHLIGHT_CIRCLE_ID)
        }
        if (hasLayer(map, HIGHLIGHT_LINE_ID)) {
          map.removeLayer(HIGHLIGHT_LINE_ID)
        }
        if (hasLayer(map, HIGHLIGHT_POLYGON_ID)) {
          map.removeLayer(HIGHLIGHT_POLYGON_ID)
        }
        if (hasSource(map, HIGHLIGHT_ID)) {
          map.removeSource(HIGHLIGHT_ID)
        }
        // Remove source
        map.addSource('highlight', {
          'type': 'geojson',
          'data': geojson
        });
        // CREATE HIGHLIGHT LAYER
        map.addLayer(
          {
            id: HIGHLIGHT_CIRCLE_ID,
            type: 'circle',
            source: HIGHLIGHT_ID,
            filter: ['==', '$type', 'Point'],
            paint: {
              'circle-color': `black`,
              'circle-opacity': 0,
              'circle-radius': 12,
              'circle-stroke-color': HIGHLIGHT_COLOR,
              'circle-stroke-opacity': HIGHLIGHT_OPACITY,
              'circle-stroke-width': HIGHLIGHT_WIDTH
            }
          }
        )
        map.addLayer(
          {
            id: HIGHLIGHT_LINE_ID,
            type: 'line',
            source: HIGHLIGHT_ID,
            filter: ['==', '$type', 'LineString'],
            paint: {
              'line-color': HIGHLIGHT_COLOR,
              'line-opacity': HIGHLIGHT_OPACITY,
              'line-width': HIGHLIGHT_WIDTH
            }
          },
          HIGHLIGHT_CIRCLE_ID
        )
        map.addLayer(
          {
            id: HIGHLIGHT_POLYGON_ID,
            type: 'line',
            source: HIGHLIGHT_ID,
            filter: ['==', '$type', 'Polygon'],
            paint: {
              'line-color': HIGHLIGHT_COLOR,
              'line-opacity': HIGHLIGHT_OPACITY,
              'line-width': HIGHLIGHT_WIDTH
            }
          },
          HIGHLIGHT_LINE_ID
        )
        var bounds = bbox(geojson);
        map.fitBounds(bounds, {
          padding: 50,
          duration: 3000
        });
      } catch (e) {

      }
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
)
