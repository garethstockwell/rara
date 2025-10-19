// Render a flat map

import * as info from "./info.js";
import * as layer from "./layer.js";
import * as line from "./line.js";
import * as locations from "./locations.js";
import * as nav_control from "./nav_control.js";

export var name = "ML fly";

export function createMap() {
  const config = {
    style: "https://api.maptiler.com/maps/openstreetmap/style.json?key=zsAKnM69p5uDhfEeaTCu",
    center: [0.144843, 52.212231], // [lng, lat]
    container: "map"
  };

  var map = new maplibregl.Map(config);

  let camera = { coord: null, altitude: 500, distance: null }
  let start = null, playtime = 30000;
  let route = null;

  let animate = () => {
     start = start || Date.now();

     // calculate route progress and visualize a marker at the current progress
     let progress = (Date.now() - start) % playtime;
     let lngLat = turf.along(route, turf.lineDistance(route) * progress / playtime).geometry.coordinates;
     map.getSource('point').setData({ type: 'Point', coordinates: lngLat });

     // let the camera follow the route
     let coord = maplibregl.MercatorCoordinate.fromLngLat(lngLat);
     let dx = coord.x - camera.coord.x, dy = coord.y - camera.coord.y;
     let delta = Math.hypot(dx, dy) - camera.distance;
     if (delta > 0) {
      let a = Math.atan2(dy, dx);
      camera.coord.x += Math.cos(a) * delta;
      camera.coord.y += Math.sin(a) * delta;
     }
     // FIXME! when using easeTo the positioning is not correct
     map.jumpTo(map.calculateCameraOptionsFromTo(camera.coord.toLngLat(), camera.altitude, lngLat));

     requestAnimationFrame(animate);
  }

  let init = (_arguments) => {
    var boundary = map.getSource('boundary');
    boundary.getData().then((data) => {
      var coordinates = data["features"][0]["geometry"]["coordinates"];
      route = turf.lineString(coordinates);

      // calculate camera startpoint
      //  - compute the direction of the first quater of the route
      //  - and place the camera in to opposite direction of this point
      let a = maplibregl.MercatorCoordinate.fromLngLat(coordinates[0]);
      let b = maplibregl.MercatorCoordinate.fromLngLat(turf.along(route, turf.lineDistance(route) / 4).geometry.coordinates);
      let dx = b.x - a.x, dy = b.y - a.y;
      camera.distance = Math.hypot(dx, dy);
      camera.coord = new maplibregl.MercatorCoordinate(a.x - dx, a.y - dy);

      // FIXME! when using flyTo the positioning is not correct
      map.jumpTo(map.calculateCameraOptionsFromTo(camera.coord.toLngLat(), camera.altitude, coordinates[0]));

      animate();
    });

  }

  // The 'building' layer in the streets vector source contains building-height
  // data from OpenStreetMap.
  map.on('load', () => {
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
  });

  layer.add(map, line, {
    display_name: 'Riverside area boundary',
    name: 'boundary',
    filename: 'boundary.json',
    color: 'black',
    callback: init
  });

  layer.add(map, locations, {
    display_name: 'Historical locations',
    name: 'historical',
    era: 'historical',
    color: 'yellow',
  });

  layer.add(map, locations, {
    display_name: 'Contemporary locations',
    name: 'contemporary',
    era: 'contemporary',
    color: 'red',
  });

  nav_control.add(map, false);
  info.setUp(map);

  return map;
}
