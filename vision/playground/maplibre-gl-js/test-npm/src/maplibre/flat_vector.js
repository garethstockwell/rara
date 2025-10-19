// Render a flat map

import * as boundary from "./boundary.js";
import * as info from "./info.js";
import * as layer from "./layer.js";
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

  layer.add(boundary, map, true);
  layer.add(locations, map, true);
  nav_control.add(map);
  info.setUp(map);

  return map;
}
