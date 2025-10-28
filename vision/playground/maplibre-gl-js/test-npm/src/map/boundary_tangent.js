// Fly around the boundary, with camera pointing along the boundary

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";
import { addBuildingsLayer } from "../layer/buildings.js";
import { createRoute } from "../logic/route.js";
import { addLayer, createZOrder } from "../layer/layer.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { addOverlayLayer } from "../layer/overlay.js";

export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
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
    'point',
  ]);

  map.on('load', () => {
    zOrder.load(map)

    map.addSource("point", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [0.0, 0.0]
        }
      }
    });

    map.addLayer({
      id: "point",
      source: "point",
      type: "circle",
      paint: {
        "circle-radius": 10,
        "circle-color": '#ff0000',
        "circle-stroke-width": 2,
        "circle-stroke-color": 'white' }
    }, zOrder.myPosition('point'));
  });

  addLayer(map, addBuildingsLayer, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    zOrder: zOrder,
    visible: true,
  });

  addLayer(map, addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    callback: (_arguments) => {
      createRoute(map, {
        lineId: 'boundary',
        autoStart: true,
      });
    },
    visible: true,
  });

  addLayer(map, addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
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
    staticPopups: true,
    zOrder: zOrder,
    visible: true,
  });

  addLayer(map, addLocationsLayer, {
    id: 'contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    staticPopups: true,
    zOrder: zOrder,
    visible: true,
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
    visible: false,
    zOrder: zOrder,
    visible: false,
  });

  addNavigationControl(map, false);
  setUpInfo(map);

  return map;
}
