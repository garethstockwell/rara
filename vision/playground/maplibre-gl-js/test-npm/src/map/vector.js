// Render a flat map

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";
import { addBuildingsLayer } from "../layer/buildings.js";
import { addLayer, createZOrder } from "../layer/layer.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { addOverlayLayer } from "../layer/overlay.js";

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

  const zOrder = createZOrder([
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'locations_historical',
    'locations_contemporary',
  ]);

  map.on('load', () => {
    zOrder.load(map)
  });

  addLayer(map, addBuildingsLayer, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    zOrder: zOrder,
    visible: false
  });

  addLayer(map, addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    visible: true,
  });

  addLayer(map, addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addLocationsLayer, {
    id: 'locations_historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    zOrder: zOrder,
    onclick: options.locationOnClick ?? null,
    visible: options.locationVisible ?? false,
  });

  addLayer(map, addLocationsLayer, {
    id: 'locations_contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    zOrder: zOrder,
    onclick: options.locationOnClick ?? null,
    visible: options.locationVisible ?? false,
  });

  addLayer(map, addOverlayLayer, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addOverlayLayer, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    zOrder: zOrder,
    visible: false,
  });

  addNavigationControl(map);
  setUpInfo(map);

  return map;
}
