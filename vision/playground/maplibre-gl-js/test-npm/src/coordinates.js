var freeze = false;

function info() {
  return document.getElementById('info');
}

export function track(map) {
  map.on('mousemove', (e) => {
    if (!freeze) {
      info().innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        `${JSON.stringify(e.point)
        }<br />${
          // e.lngLat is the longitude, latitude geographical position of the event
          JSON.stringify(e.lngLat.wrap())}`;
    }
  });
}

export function toggle() {
  if (info().style.display == 'none') {
    info().style.display = 'block';
  } else {
    info().style.display = 'none';
  }

  return info().style.display == 'block'
}

const handleKeyDown = (e) => {
  if (e.key === "f") {
    freeze = !freeze;
  }
};

document.addEventListener('keydown', handleKeyDown, true);
