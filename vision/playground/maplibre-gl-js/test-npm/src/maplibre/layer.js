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

export function add(module, map, visible, callback) {
    module.addLayer(map, visible, callback);

    function toggle (e) {
        const name = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        this.className = toggleVisible(map, name) ? 'active' : '';
    };

    menu.add(module.name, toggle, visible);
}
