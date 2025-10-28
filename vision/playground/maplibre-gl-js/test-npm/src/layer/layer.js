// Helpers for adding map layers

import * as menu from "../control/menu.js";

// Dictionary of layers, indexed by id
const layers = {};

function createLayer(id) {
  const entry = {
    visible: false
  };
  layers[id] = entry;
  return entry;
}

export function setLayerVisibility(map, id, visible) {
  console.log("setLayerVisibility", id, visible);

  const entry = layers[id] ?? createLayer(id);
  entry.visible = visible;

  if (map.getLayer(id)) {
    map.setLayoutProperty(id, 'visibility', entry.visible ? 'visible' : 'none');
  }
}

function onLoad(map, id, callback) {
  console.log('layer.onLoad', id);

  const entry = layers[id] ?? createLayer(id);
  map.setLayoutProperty(id, 'visibility', entry.visible ? 'visible' : 'none');

  if (callback) {
    callback(id);
  }
}

function toggleVisible(map, id) {
  const visibility = map.getLayoutProperty(
    id,
    'visibility'
  );

  setLayerVisibility(map, id, visibility !== 'visible');

  return visibility != 'visible';
}

export function add(map, module, options) {
  options.visible = options.visible ?? true;
  createLayer(options.id);
  layers[options.id].visible = options.visible;

  const callback = options.callback;
  options.callback = (id) => {
    onLoad(map, options.id, callback);
  };

  module.addLayer(map, options);

  function toggle (e) {
    const id = this.layerId;
    e.preventDefault();
    e.stopPropagation();

    this.className = toggleVisible(map, id) ? 'active' : '';
  };

  const addToMenu = options.addToMenu ?? true;
  if (addToMenu) {
    menu.add(options.id, options.text, toggle, options.visible, options.color);
  }
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
