// Render a globe map

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";

export function createMap() {
  const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/globe.json', // style URL
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 1 // starting zoom
  });

  addNavigationControl(map);
  setUpInfo(map);

  return map;
}
