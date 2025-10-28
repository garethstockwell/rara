// Helper functions for creating a floating menu

function menu() {
  return document.getElementById('menu');
}

function show() {
  menu().hidden = false;
}

function hide() {
  menu().hidden = true;
}

function toggleVisible() {
  menu().hidden = !menu().hidden;
}

export function addMenuItem(id, text, onclick, active, color) {
  const link = document.createElement('a');
  link.id = 'menu_' + id;
  link.layerId = id;
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
  show();
}

const handleKeyDown = (e) => {
  if (e.key === "m") {
    toggleVisible();
  }
};

document.addEventListener('keydown', handleKeyDown, true);

