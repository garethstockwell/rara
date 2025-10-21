// Helper functions for creating a floating menu

function menu() {
  return document.getElementById('menu');
}

export function show() {
  menu().hidden = false;
}

export function hide() {
  menu().hidden = true;
}

export function add(id, text, onclick, active, color) {
  const link = document.createElement('a');
  link.id = 'menu_' + id;
  link.layer_id = id;
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

