// Render a flat map

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";
import * as overlay from "../layer/overlay.js";

export function createMap() {
  const config = {
    style: {
    "version": 8,
    "sources": {
      "osm": {
      "type": "raster",
      "tiles": [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png"  // OpenStreetMap Tile URL
      ],
      "tileSize": 256
      }
    },
    "layers": [
      {
      "id": "osm-layer",
      "type": "raster",
      "source": "osm",
      "minzoom": 0,
      }
    ]
    },
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 15,
    maxZoom: 18,
    container: "map"
  };

  var map = new maplibregl.Map(config);

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    filename: 'boundary.json',
    color: 'black'
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    era: 'historical',
    color: 'yellow',
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    era: 'contemporary',
    color: 'red',
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
