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

  const z_order = layer.zOrder([
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'historical',
    'contemporary',
    'point',
  ]);

  map.on('load', () => {
    z_order.load(map)

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
    }, z_order.myPosition('point'));
  });

  layer.add(map, buildings, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    z_order: z_order,
    visible: true,
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    z_order: z_order,
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
    z_order: z_order,
    visible: false,
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    staticPopups: true,
    z_order: z_order,
    visible: true,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    staticPopups: true,
    z_order: z_order,
    visible: true,
  });

  layer.add(map, overlay, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    z_order: z_order,
    visible: false,
  });

  layer.add(map, overlay, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
    z_order: z_order,
    visible: false,
  });

  nav.add(map, false);
  info.setUp(map);

  return map;
}
