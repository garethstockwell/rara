// Render a flat map

import * as boundary from "./boundary.js";
import * as info from "./info.js";
import * as layer from "./layer.js";
import * as locations from "./locations.js";
import * as nav_control from "./nav_control.js";

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
    zoom: 16,
    maxZoom: 18,
    container: "map"
  };

  var map = new maplibregl.Map(config);

  layer.add(boundary, map, true);
  layer.add(locations, map, true);
  nav_control.add(map);
  info.setUp(map);

  return map;
}
