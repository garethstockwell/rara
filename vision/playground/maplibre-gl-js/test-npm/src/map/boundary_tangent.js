// Fly around the boundary, with camera pointing along the boundary

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as buildings from "../layer/buildings.js";
import * as route from "../logic/route.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";
import * as overlay from "../layer/overlay.js";

export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    container: "map",
    attributionControl: false
  };

  var map = new maplibregl.Map(config);

  const zOrder = layer.zOrder([
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

  layer.add(map, buildings, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    zOrder: zOrder,
    visible: true,
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    callback: (_arguments) => {
      route.createRoute(map, {
        lineId: 'boundary',
        autoStart: true,
      });
    },
    visible: true,
  });

  layer.add(map, line, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    zOrder: zOrder,
    visible: false,
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    staticPopups: true,
    zOrder: zOrder,
    visible: true,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    staticPopups: true,
    zOrder: zOrder,
    visible: true,
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    zOrder: zOrder,
    visible: false,
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
    zOrder: zOrder,
    visible: false,
  });

  nav.add(map, false);
  info.setUp(map);

  return map;
}
