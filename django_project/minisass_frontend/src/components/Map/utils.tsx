/** Contains all utilities for maplibre */

import maplibregl from 'maplibre-gl';

/**
 * Return if layer exist
 * @param {Object} map Map
 * @param {String} id of layer
 */
export const hasLayer = (map: maplibregl.Map, id: string): boolean => {
  if (!map) {
    return false
  }
  return typeof map.getLayer(id) !== 'undefined'
}

/**
 * Remove layer from map
 * @param {Object} map Map
 * @param {String} id of layer
 */
export const removeLayer = (map: maplibregl.Map, id: string) => {
  if (hasLayer(map, id)) {
    map.removeLayer(id)
  }
}

/**
 * Return if source exist
 * @param {Object} map Map
 * @param {String} id of layer
 */
export const hasSource = (map: maplibregl.Map, id: string): boolean => {
  return typeof map.getSource(id) !== 'undefined'
}
/**
 * Remove source if exist
 * @param {Object} map Map
 * @param {String} id of layer
 */
export const removeSource = (map: maplibregl.Map, id: string) => {
  if (hasSource(map, id)) {
    map.removeSource(id);
  }
}