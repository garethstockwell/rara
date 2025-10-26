// Render a map of the heritage trail

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as buildings from "../layer/buildings.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";
import * as overlay from "../layer/overlay.js";

export function createMap(options) {
  options = options ?? {};

  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 15,
    container: "map",
    attributionControl: false
  };

  var map = new maplibregl.Map(config);

  const z_order = layer.zOrder([
    'boundary',
    'heritage_trail',
    'locations_precise',
  ]);

  map.on('load', () => {
    z_order.load(map)
  });

  layer.add(map, buildings, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    z_order: z_order,
    visible: false
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    z_order: z_order,
    visible: false,
  });

  layer.add(map, line, {
    id: 'heritage_trail',
    text: 'Heritage trail',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    z_order: z_order,
    visible: true,
  });

  layer.add(map, locations, {
    id: 'locations_precise',
    text: 'Precise locations',
    url: '/data/locations_precise.json',
    tags: [],
    color: 'yellow',
    z_order: z_order,
    onclick: options.locationOnClick ?? null,
    visible: options.locationVisible ?? false,
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
