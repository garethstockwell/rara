// Render a map of the heritage trail

import { setUpInfo } from "../control/info.js";
import { addNavigationControl } from "../control/nav.js";
import { setUpCommentary } from "../logic/commentary.js"
import { addBuildingsLayer } from "../layer/buildings.js";
import { createRoute } from "../logic/route.js";
import { addLayer, createZOrder } from "../layer/layer.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { getLocationCoordinates, setPopupVisibility } from "../layer/locations.js";

var _route = null;

export function fly(fromId, toId) {
  console.log("Fly from", fromId, "to", toId);
  const fromCoord = getLocationCoordinates(fromId);
  const toCoord = getLocationCoordinates(toId);
  console.log("Fly from", fromCoord, "to", toCoord);
  if (_route) {
    _route.fly(fromCoord, toCoord, 2000);
  }
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

  const zOrder = createZOrder([
    'boundary',
    'heritage_trail',
    'locations',
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
    visible: true
  });

  addLayer(map, addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    zOrder: zOrder,
    visible: false,
  });

  addLayer(map, addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    zOrder: zOrder,
    callback: (_arguments) => {
      _route = createRoute(map, {
        lineId: 'heritage_trail',
        altitude: 200,
        distance: 500
      });
    },
    visible: true,
  });

  addLayer(map, addLocationsLayer, {
    id: 'locations',
    text: 'Heritage trail locations',
    url: '/data/locations.json',
    color: 'green',
    zOrder: zOrder,
    onclick: options.locationOnClick ?? null,
    visible: true,
  });

  addNavigationControl(map);
  setUpInfo(map);

  return map;
}

export function setUp() {
  setUpCommentary({
    onUpdate: function(oldId, newId) {
      setPopupVisibility(oldId, false);
      setPopupVisibility(newId, false);
      fly(oldId, newId);
    }
  })
}
