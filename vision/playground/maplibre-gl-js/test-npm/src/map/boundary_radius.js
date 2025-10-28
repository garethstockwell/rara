// Fly around the boundary, with camera pointing to the centre

import { Map } from "../component/map.js";

import { addBuildingsLayer } from "../layer/buildings.js";
import { addLineLayer } from "../layer/line.js";
import { addLocationsLayer } from "../layer/locations.js";
import { addOverlayLayer } from "../layer/overlay.js";

/**
 * Create the map
 * @returns Map
 */
export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231],
    zoom: 15,
    container: "map",
    attributionControl: false
  };

  const zOrder = [
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
    'heritage_trail',
    'locations_historical',
    'locations_contemporary',
  ];

  var map = new Map({
    config: config,
    zOrder: zOrder
  });

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

  map.appData.layers.addLayer(addBuildingsLayer, {
    id: '3d_buildings',
    text: '3D buildings',
    color: '#aaaaaa',
    visible: false
  });

  map.appData.layers.addLayer(addLineLayer, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/line_boundary.json',
    color: 'black',
    visible: true,
  });

  map.appData.layers.addLayer(addLineLayer, {
    id: 'heritage_trail',
    text: 'Heritage trail line',
    url: '/data/line_heritage_trail.json',
    color: 'green',
    visible: false,
  });

  map.appData.layers.addLayer(addLocationsLayer, {
    id: 'locations_historical',
    text: 'Historical locations',
    url: '/data/locations.json',
    tags: ['historical'],
    color: 'yellow',
    visible: true,
    staticPopups: true,
  });

  map.appData.layers.addLayer(addLocationsLayer, {
    id: 'locations_contemporary',
    text: 'Contemporary locations',
    url: '/data/locations.json',
    tags: ['contemporary'],
    color: 'red',
    visible: true,
    staticPopups: true,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'barnwell_priory',
    text: 'Barnwell Priory (historical)',
    color: 'orange',
    visible: false,
  });

  map.appData.layers.addLayer(addOverlayLayer, {
    id: 'g4_bac_cam',
    text: 'Map circa 1910',
    opacity: 0.75,
    visible: false,
  });

  return map;
}
