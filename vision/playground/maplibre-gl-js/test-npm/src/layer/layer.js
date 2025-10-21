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
