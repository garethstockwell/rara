// Render a flat map

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";
import { setUpCommentary } from "../logic/commentary.js"
import { addLayer, createZOrder, setLayerVisibility } from "../layer/layer.js";
import { addLineLayer } from "../layer/line.js";
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
  ]);

  map.on('load', () => {
    zOrder.load(map)
  });

  addLayer(map, addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    visible: true,
  });

  addLayer(map, addOverlayLayer, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    zOrder: zOrder,
    visible: false,
    addToMenu: false,
    callback: options.callback,
  });

  addLayer(map, addOverlayLayer, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    zOrder: zOrder,
    visible: false,
    addToMenu: false,
    callback: options.callback,
  });

  addNavigationControl(map);
  setUpInfo(map);

  return map;
}

export function setUp(map) {
  // Map from era to layer
  const eraToLayer = {
    "roman": "barnwell_priory",
    "early_modern": "g4_bac_cam",
  };

  return setUpCommentary({
    onUpdate: function(oldId, newId) {
      console.log('history.onUpdate id', oldId, newId);

      const oldLayer = eraToLayer[oldId];
      const newLayer = eraToLayer[newId];

      console.log('history.onUpdate layer', oldLayer, newLayer);

      setLayerVisibility(map, oldLayer, false);
      setLayerVisibility(map, newLayer, true);
    }
  })
}
