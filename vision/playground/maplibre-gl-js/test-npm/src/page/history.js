// Control logic for history page

import * as commentary from "../logic/commentary.js"
import * as layer from "../layer/layer.js"

export function setUp(map) {
  // Map from era to layer
  const eraToLayer = {
    "roman": "barnwell_priory",
    "early_modern": "g4_bac_cam",
  };

  return commentary.setUp({
    onUpdate: function(oldId, newId) {
      console.log('history.onUpdate id', oldId, newId);

      const oldLayer = eraToLayer[oldId];
      const newLayer = eraToLayer[newId];

      console.log('history.onUpdate layer', oldLayer, newLayer);

      layer.setLayerVisibility(map, oldLayer, false);
      layer.setLayerVisibility(map, newLayer, true);
    }
  })
}
