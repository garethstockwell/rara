// Render a flat map

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";
import * as overlay from "../layer/overlay.js";

export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 15,
    container: "map"
  };

  var map = new maplibregl.Map(config);

/*
  const layers = [];

  function callback(args) {
    console.log(args);
    layers.push(args[1]);
    console.log(layers);

    if (layers.includes('boundary') && layers.includes('g4_bac_cam')) {
      map.moveLayer('g4_bac_cam', 'boundary');
    }

    if (layers.includes('boundary') && layers.includes('barnwell_priory')) {
      map.moveLayer('barnwell_priory', 'boundary');
    }

    if (layers.includes('barnwell_priory') && layers.includes('g4_bac_cam')) {
      map.moveLayer('g4_bac_cam', 'barnwell_priory');
    }
  }
*/
  function callback(args) {
    console.log(args);
  }

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    filename: 'boundary.json',
    color: 'black',
    visible: true,
    callback: callback
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    era: 'historical',
    color: 'yellow',
    callback: callback,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    era: 'contemporary',
    color: 'red',
    callback: callback,
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    callback: callback,
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
    callback: callback,
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
