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
    ['vector', 'Vector'],
    ['raster', 'Raster'],
    ['locations', 'Locations'],
    ['boundary_tangent', 'Boundary tangent'],
    ['boundary_radius', 'Boundary radius'],
    ['globe', 'Globe'],
  ]).forEach(function(value, key) {
    add(key, value, key == name)
  });
}
