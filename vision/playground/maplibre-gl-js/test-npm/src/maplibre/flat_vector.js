// Render a flat map

import * as info from "./info.js";
import * as layer from "./layer.js";
import * as line from "./line.js";
import * as locations from "./locations.js";
import * as nav_control from "./nav_control.js";

export var name = "ML flat vector";

export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 16,
    container: "map"
  };

  var map = new maplibregl.Map(config);

  layer.add(map, line, {name: 'boundary'});
  layer.add(map, locations, {name: 'locations'});
  nav_control.add(map);
  info.setUp(map);

  return map;
}
