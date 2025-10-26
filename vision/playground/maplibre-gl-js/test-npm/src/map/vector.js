// Render a flat map

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
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'locations_historical',
    'locations_contemporary',
    'locations_heritage_trail',
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
    visible: true,
  });

  layer.add(map, line, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    z_order: z_order,
    visible: false,
  });

  layer.add(map, locations, {
    id: 'locations_historical',
    text: 'Historical locations',
    url: '/data/locations_precise.json',
    tags: ['historical'],
    color: 'yellow',
    z_order: z_order,
    onclick: options.locationOnClick ?? null,
    visible: options.locationVisible ?? false,
  });

  layer.add(map, locations, {
    id: 'locations_contemporary',
    text: 'Contemporary locations',
    url: '/data/locations_precise.json',
    tags: ['contemporary'],
    color: 'red',
    z_order: z_order,
    onclick: options.locationOnClick ?? null,
    visible: options.locationVisible ?? false,
  });

  layer.add(map, locations, {
    id: 'locations_heritage_trail',
    text: 'Heritage trail locations',
    url: '/data/locations_heritage_trail.json',
    tags: ['heritage_trail'],
    color: 'green',
    z_order: z_order,
    onclick: options.locationOnClick ?? null,
    visible: false,
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    z_order: z_order,
    visible: false,
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    z_order: z_order,
    visible: false,
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
