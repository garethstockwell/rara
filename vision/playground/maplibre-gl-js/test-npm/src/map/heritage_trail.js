// Render a map of the heritage trail

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
import * as buildings from "../layer/buildings.js";
import * as fly_line from "../fly_line.js";
import * as layer from "../layer/layer.js";
import * as line from "../layer/line.js";
import * as locations from "../layer/locations.js";

var route = null;

export function fly(fromId, toId) {
  console.log("Fly from", fromId, "to", toId);
  const fromCoord = locations.getLocationCoordinates(fromId);
  const toCoord = locations.getLocationCoordinates(toId);
  console.log("Fly from", fromCoord, "to", toCoord);
  route.fly(fromCoord, toCoord, 2000);
}

export function createMap(options) {
  options = options ?? {};

  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    zoom: 15,
    container: "map",
    attributionControl: false
  };

  var map = new maplibregl.Map(config);

  const z_order = layer.zOrder([
    'boundary',
    'heritage_trail',
    'locations',
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
    visible: true
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    z_order: z_order,
    visible: false,
  });

  layer.add(map, line, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    z_order: z_order,
    callback: (_arguments) => {
      route = fly_line.createRoute(map, {
        lineId: 'heritage_trail',
        altitude: 200,
        distance: 500
      });
    },
    visible: true,
  });

  layer.add(map, locations, {
    id: 'locations',
    text: 'Heritage trail locations',
    url: '/data/locations.json',
    color: 'green',
    z_order: z_order,
    onclick: options.locationOnClick ?? null,
    visible: true,
  });

  nav.add(map);
  info.setUp(map);

  return map;
}
