// Render a globe map

import { Map } from "../component/map.js";

/**
 * Create the map
 * @returns Map
 */
export function createMap() {
  const config = {
    style: "https://demotiles.maplibre.org/globe.json",
    center: [0.144843, 52.212231],
    zoom: 1,
    container: "map",
    attributionControl: false
  };

  var map = new Map({
    config: config,
  });

  return map;
}
