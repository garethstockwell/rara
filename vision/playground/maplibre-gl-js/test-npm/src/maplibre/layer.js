// Helpers for adding map layers

import * as menu from "../menu.js";

function toggleVisible(map, name) {
  const visibility = map.getLayoutProperty(
    name,
    'visibility'
  );

  if (visibility === 'visible') {
    map.setLayoutProperty(name, 'visibility', 'none');
  } else {
    map.setLayoutProperty(name, 'visibility', 'visible');
  }

  return visibility != 'visible';
}

export function add(map, module, options) {
  options.visible = options.visible ?? true;

  module.addLayer(map, options);

  function toggle (e) {
    const name = this.name;
    e.preventDefault();
    e.stopPropagation();

    this.className = toggleVisible(map, name) ? 'active' : '';
  };

  menu.add(options.name, options.display_name, toggle, options.visible, options.color);
}
