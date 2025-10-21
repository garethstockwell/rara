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
    container: "map"
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
    fetch('../../data/boundary_smooth.json')
      .then(res => res.json())
      .then(data => {
        var coordinates = data["features"][0]["geometry"]["coordinates"];
        route = turf.lineString(coordinates);
        animate();
      });
  });

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
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    filename: 'boundary.json',
    color: 'black',
    z_order: z_order,
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    era: 'historical',
    color: 'yellow',
    static_popups: true,
    z_order: z_order,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    era: 'contemporary',
    color: 'red',
    static_popups: true,
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

  nav.add(map, false);
  info.setUp(map);

  return map;
}
