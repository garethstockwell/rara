// Helper functions for creating a floating menu

function menu() {
  return document.getElementById('menu');
}

export function reset() {
  menu().innerHTML = '';
  menu().hidden = true;
}

export function add(text, onclick, active) {
  const link = document.createElement('a');
  link.id = 'menu_' + text;
  link.href = '#';
  link.textContent = text;
  link.className = active ? 'active' : '';
  link.onclick = onclick;

  menu().appendChild(link);
  menu().hidden = false;
}
