// Helper functions for creating a floating menu

function menu() {
  return document.getElementById('menu');
}

export function reset() {
  menu().innerHTML = '';
  menu().hidden = true;
}

export function add(name, text, onclick, active, color) {
  const link = document.createElement('a');
  link.id = 'menu_' + name;
  link.name = name;
  link.href = '#';
  link.textContent = text;
  link.className = active ? 'active' : '';
  link.onclick = onclick;

  color = color ?? 'transparent';
  const box = document.createElement('div');
  box.className = 'box';
  box.style.backgroundColor = color;
  link.appendChild(box);

  menu().appendChild(link);
  menu().hidden = false;
}
