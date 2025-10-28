// Fly around the boundary, with camera pointing to the centre

import * as nav from "../control/nav.js";
import * as info from "../control/info.js";
import * as buildings from "../layer/buildings.js";
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

  let start = null, playtime = 30000;
  let route = null;

  const center = new maplibregl.LngLat(0.14547600132800653, 52.212610097321885);
  const centerPt = turf.point([center.lng, center.lat]);

  const altitude = 300; // m
  const extend = 500; // m

  let animate = () => {
    start = start || Date.now();
    let progress = (Date.now() - start) % playtime;
    let boundaryPt = turf.along(route, turf.lineDistance(route) * progress / playtime).geometry.coordinates;

    // Compute distance (in km) and bearing between them
    let dist = turf.distance(centerPt, boundaryPt, { units: 'meters' });
    let bearing = turf.bearing(centerPt, boundaryPt);

    // Extend the line
    let extendedDist = dist + extend;

    // Compute the new point 200 m beyond 'boundary' along the same bearing
    let extendedPt = turf.destination(centerPt, extendedDist, bearing, { units: 'meters' });

    // Extract as [lng, lat]
    let extendedLngLat = extendedPt.geometry.coordinates;

    map.jumpTo(map.calculateCameraOptionsFromTo(new maplibregl.LngLat(extendedLngLat[0], extendedLngLat[1]), altitude, center));
  
    requestAnimationFrame(animate);
  }

  map.on('load', async () => {
    fetch('/data/line_boundary_smooth.json')
      .then(res => res.json())
      .then(data => {
        var coordinates = data.features[0].geometry.coordinates;
        route = turf.lineString(coordinates);
        animate();
      });
  });

  const zOrder = layer.zOrder([
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
    zOrder: zOrder,
    visible: false,
  });

  nav.add(map, false);
  info.setUp(map);

  return map;
}
