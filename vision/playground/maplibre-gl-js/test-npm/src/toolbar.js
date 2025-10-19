// Helper functions for creating a horizontal toolbar

function add(name, text, active) {
  const link = document.createElement('a');
  link.href = name + '.html';
  link.textContent = text;
  link.className = active ? 'active' : '';

  const toolbar = document.getElementById('toolbar');
  toolbar.appendChild(link);
}

export function createToolbar(name) {
  new Map([
    ['flat_raster', 'Flat raster'],
    ['flat_vector', 'Flat vector'],
    ['fly_boundary', 'Fly boundary'],
    ['globe', 'Globe'],
  ]).forEach(function(value, key) {
    add(key, value, key == name)
  });
}
