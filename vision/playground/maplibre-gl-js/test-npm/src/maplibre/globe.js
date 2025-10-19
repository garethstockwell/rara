// Render a globe map

import * as info from "./info.js";
import * as layer from "./layer.js";
import * as line from "./line.js";
import * as locations from "./locations.js";
import * as nav_control from "./nav_control.js";

export var name = "ML globe";

export function createMap() {
  const map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/globe.json', // style URL
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 1 // starting zoom
  });

  layer.add(map, line, {name: 'boundary'});
  layer.add(map, locations, {name: 'locations'});
  nav_control.add(map);
  info.setUp(map);

  return map;
}
