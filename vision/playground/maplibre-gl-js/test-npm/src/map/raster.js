// Render a flat map

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as buildings from "../layer/buildings.js";
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

  const z_order = layer.zOrder([
    'g4_bac_cam',
    'barnwell_priory',
    'historical',
    'contemporary',
    'boundary'
  ]);

  map.on('load', () => {
    z_order.load(map)
  });

  layer.add(map, buildings, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    z_order: z_order,
    visible: false
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/boundary.json',
    color: 'black',
    z_order: z_order,
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    era: 'historical',
    color: 'yellow',
    z_order: z_order,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    era: 'contemporary',
    color: 'red',
    z_order: z_order,
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    z_order: z_order,
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
    z_order: z_order,
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
