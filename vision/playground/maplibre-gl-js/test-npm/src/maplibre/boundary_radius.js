// Fly around the boundary, with camera pointing to the centre

import * as info from "./info.js";
import * as layer from "./layer.js";
import * as line from "./line.js";
import * as locations from "./locations.js";
import * as nav_control from "./nav_control.js";
import * as overlay from "./overlay.js";

export var name = "ML fly";

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

  // The 'building' layer in the streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', async () => {
    map.addSource("point", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: maplibregl.MercatorCoordinate.fromLngLat(center)
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
    });

    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addSource('openfreemap', {
      url: `https://tiles.openfreemap.org/planet`,
      type: 'vector',
    });

    map.addLayer(
      {
        id: '3d-buildings',
        source: 'openfreemap',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 15,
        filter: ['!=', ['get', 'hide_3d'], true],
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
          ],
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            16,
            ['get', 'render_height']
          ],
          'fill-extrusion-base': ['case',
            ['>=', ['get', 'zoom'], 16],
            ['get', 'render_min_height'], 0
          ]
        }
      },
      labelLayerId
    );

    fetch('../../data/boundary_smooth.json')
      .then(res => res.json())
      .then(data => {
        var coordinates = data["features"][0]["geometry"]["coordinates"];
        route = turf.lineString(coordinates);
        animate();
      });
    
  });

  layer.add(map, line, {
    display_name: 'Riverside area boundary',
    name: 'boundary',
    filename: 'boundary.json',
    color: 'black'
  });

  layer.add(map, locations, {
    display_name: 'Historical locations',
    name: 'historical',
    era: 'historical',
    color: 'yellow',
    static_popups: true,
  });

  layer.add(map, locations, {
    display_name: 'Contemporary locations',
    name: 'contemporary',
    era: 'contemporary',
    color: 'red',
    static_popups: true,
  });

  layer.add(map, overlay, {
    display_name: 'Barnwell Priory (historical)',
    name: 'barnwell_priory',
    color: 'orange',
  });

  nav_control.add(map, false);
  info.setUp(map);

  return map;
}
