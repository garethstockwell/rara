// Render history view

import { Commentary } from "../component/commentary.js";
import { Map } from "../component/map.js";

import { addLineLayer } from "../layer/line.js";
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
    'camantsoc_1836_1838',
    'camantsoc_1910',
    'boundary',
  ];

  var map = new Map({
    config: config,
    zOrder: zOrder
  });

  map.appData.layers.addLayer(addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    visible: true,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'camantsoc_1836_1838',
    text: 'Map circa 1836-1838',
    opacity: 1.00,
    visible: false,
    addToMenu: false,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'camantsoc_1910',
    text: 'Map circa 1910',
    opacity: 1.00,
    visible: false,
    addToMenu: false,
  });

  setUpCommentary(map);

  return map;
}

/**
 * Link commentary panel to map
 */
function setUpCommentary(map) {
  // Map from era to layer
  const eraToLayer = {
    "c_1836_1838": "camantsoc_1836_1838",
    "c_1910": "camantsoc_1910",
  };

  const commentary = new Commentary({
    callback: function(oldId, newId) {
      console.log(`history.onUpdate id ${oldId} -> ${newId}`);

      const oldLayer = eraToLayer[oldId];
      const newLayer = eraToLayer[newId];

      console.log(`history.onUpdate layer ${oldLayer} -> ${newLayer}`);

      map.appData.layers.getLayer(oldLayer).visible = false;
      map.appData.layers.getLayer(newLayer).visible = true;
    }
  });

  function loaded(e) {
    var layerId = eraToLayer[commentary.ids[0]];
    if (e.isSourceLoaded && e.sourceId == layerId) {
      console.log(`Source ${e.sourceId} is loaded`);
      commentary.setIndex(0);
      map.off('sourcedata', loaded);
    }
  }

  map.on('sourcedata', loaded);
}
