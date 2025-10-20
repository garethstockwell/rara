// Render a flat map

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";
import * as overlay from "../layer/overlay.js";

export var name = "ML flat raster";

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
    display_name: 'Riverside area boundary',
    name: 'boundary',
    filename: 'boundary.json',
    color: 'black'
  });

  layer.add(map, locations, {
    display_name: 'Historical locations',
    name: 'historical',
    era: 'historical',
    color: 'yellow',
  });

  layer.add(map, locations, {
    display_name: 'Contemporary locations',
    name: 'contemporary',
    era: 'contemporary',
    color: 'red',
  });

  layer.add(map, overlay, {
    display_name: 'Barnwell Priory (historical)',
    name: 'barnwell_priory',
    color: 'orange',
  });

  layer.add(map, overlay, {
    display_name: 'Map circa 1910',
    name: 'g4_bac_cam',
    opacity: 0.75,
    visible: false
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
