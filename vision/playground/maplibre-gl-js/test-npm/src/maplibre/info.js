// Add an overlay which shows coordinates of the mouse pointer

import * as menu from "../menu.js";

var freeze = false;

function info() {
  return document.getElementById('info');
}

function show() {
  info().style.display = 'block';
}

export function hide() {
  info().style.display = 'none';
}

function isVisible() {
  return info().style.display == 'block';
}

function toggleVisible() {
  if (!isVisible()) {
    show();
  } else {
    hide();
  }

  return isVisible();
}

var event = null;

export function update(map) {
  if (!freeze) {
    info().innerHTML =
        `${
          // e.point is the x, y coordinates of the mousemove event relative
          // to the top-left corner of the map
          event ? JSON.stringify(event.point) : ''} zoom:${map.getZoom()}<br />
        ${
          // e.lngLat is the longitude, latitude geographical position of the event
          event ? JSON.stringify(event.lngLat.wrap()) : ''}`;
    }
}

export function setZoom(value) {
  zoom = value;
  update();
}

export function setUp(map) {
  map.on('mousemove', (e) => {
    event = e;
    update(map);
  });

  function toggle (e) {
    e.preventDefault();
    e.stopPropagation();

    this.className = toggleVisible() ? 'active' : '';
  };

  menu.add("info", toggle, false);

  const handleKeyDown = (e) => {
    if (e.key === "f") {
      freeze = !freeze;
    }
  };

  document.addEventListener('keydown', handleKeyDown, true);
}
