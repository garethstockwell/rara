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
    'g5_8_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'attractions',
    'improvements',
  ];

  var map = new Map({
    config: config,
    zOrder: zOrder
  });

  if (!args.layers || args.layers.includes('3d_buildings')) {
    map.appData.layers.addLayer(addBuildingsLayer, {
      id: '3d_buildings',
      text: '3D buildings',
      color: '#aaaaaa',
      visible: false
    });
  }

  if (!args.layers || args.layers.includes('boundary')) {
    map.appData.layers.addLayer(addLineLayer, {
      id: 'boundary',
      text: 'Riverside area boundary',
      url: '/data/line_boundary.json',
      color: 'black',
      visible: true,
    });
  }

  if (!args.layers || args.layers.includes('heritage_trail')) {
    map.appData.layers.addLayer(addLineLayer, {
      id: 'heritage_trail',
      text: 'Heritage trail line',
      url: '/data/line_heritage_trail.json',
      color: 'green',
      visible: false,
    });
  }

  if (!args.layers || args.layers.includes('attractions')) {
    map.appData.layers.addLayer(addLocationsLayer, {
      id: 'attractions',
      text: 'Attractions',
      url: '/data/locations.json',
      tags: ['attractions'],
      color: 'yellow',
      onclick: args.locationOnClick ?? null,
      visible: args.locationVisible ?? false,
    });
  }

  if (!args.layers || args.layers.includes('improvements')) {
    map.appData.layers.addLayer(addLocationsLayer, {
      id: 'improvements',
      text: 'Improvements',
      url: '/data/locations.json',
      tags: ['improvements'],
      color: 'red',
      onclick: args.locationOnClick ?? null,
      visible: args.locationVisible ?? false,
    });
  }

  if (!args.layers || args.layers.includes('barnwell_priory')) {
    map.appData.layers.addLayer(addOverlayLayer, {
      id: 'barnwell_priory',
      text: 'Barnwell Priory (historical)',
      color: 'orange',
      visible: false,
    });
  }

  if (!args.layers || args.layers.includes('overlays')) {
    map.appData.layers.addLayer(addOverlayLayer, {
      id: 'g4_bac_cam',
      text: 'Map circa 1910',
      opacity: 0.75,
      visible: false,
    });

    map.appData.layers.addLayer(addOverlayLayer, {
      id: 'g5_8_cam',
      text: 'Map circa 1836-1838',
      opacity: 0.75,
      visible: false,
    });
  }

  return map;
}
