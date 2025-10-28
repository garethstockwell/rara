// Render a vector map

import { Map } from "../component/map.js";

import { addBuildingsLayer } from "../layer/buildings.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { addOverlayLayer } from "../layer/overlay.js";

/**
 * Create the map
 * @param {Object} args The arguments 
 * @returns Map
 */
export function createMap(args) {
  args = args ?? {};

  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231],
    zoom: 15,
    container: "map",
    attributionControl: false
  };

  const zOrder = [
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'locations_historical',
    'locations_contemporary',
  ];

  var map = new Map({
    config: config,
    zOrder: zOrder
  });

  map.appData.layers.addLayer(addBuildingsLayer, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    visible: false
  });

  map.appData.layers.addLayer(addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    visible: true,
  });

  map.appData.layers.addLayer(addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    visible: false,
  });

  map.appData.layers.addLayer(addLocationsLayer, {
    id: 'locations_historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    onclick: args.locationOnClick ?? null,
    visible: args.locationVisible ?? false,
  });

  map.appData.layers.addLayer(addLocationsLayer, {
    id: 'locations_contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    onclick: args.locationOnClick ?? null,
    visible: args.locationVisible ?? false,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    visible: false,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
  });

  return map;
}
