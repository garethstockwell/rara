// Helpers for adding map layers

import * as menu from "../control/menu.js";

function toggleVisible(map, id) {
  const visibility = map.getLayoutProperty(
    id,
    'visibility'
  );

  if (visibility === 'visible') {
    map.setLayoutProperty(id, 'visibility', 'none');
  } else {
    map.setLayoutProperty(id, 'visibility', 'visible');
  }

  return visibility != 'visible';
}

export function add(map, module, options) {
  options.visible = options.visible ?? true;

  module.addLayer(map, options);

  function toggle (e) {
    const id = this.layer_id;
    e.preventDefault();
    e.stopPropagation();

    this.classid = toggleVisible(map, id) ? 'active' : '';
  };

  menu.add(options.id, options.text, toggle, options.visible, options.color);
}

// Module which fixes z-orders of Map layers
// Based on https://qubika.com/blog/effectively-manage-layer-order-mapbox-gl-js/
export function zOrder(ids) {
  return {
    order: ids,

    load: function(map) {
      map.addSource('empty', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      for (let i = this.order.length - 1; i >= 0; i--) {
        map.addLayer({
          id: `z-${i}`,
          type: 'symbol',
          source: 'empty'
        }, (i == this.order.length - 1) ? undefined : `z-${i+1}`)
      }
    },

    myPosition: function(layerId) {
      if (!this.order.includes(layerId)) { throw new Error(`Layer ${layerId} not included as a sortable layer`) }

      return `z-${this.order.indexOf(layerId)}`
    }
  };
}
