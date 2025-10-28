// Render a flat map

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";
import { addBuildingsLayer } from "../layer/buildings.js";
import { addLayer, createZOrder } from "../layer/layer.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { addOverlayLayer } from "../layer/overlay.js";

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
    container: "map",
    attributionControl: false
  };

  var map = new maplibregl.Map(config);

  const zOrder = createZOrder([
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'historical',
    'contemporary',
  ]);

  map.on('load', () => {
    zOrder.load(map)
  });

  addLayer(map, addBuildingsLayer, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    zOrder: zOrder,
    visible: false
  });

  addLayer(map, addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    visible: true,
  });

  addLayer(map, addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addLocationsLayer, {
    id: 'historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addLocationsLayer, {
    id: 'contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addOverlayLayer, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addOverlayLayer, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    zOrder: zOrder,
    visible: false,
  });

  addNavigationControl(map);
  setUpInfo(map);

  return map;
}
