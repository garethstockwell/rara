// Fly around the boundary, with camera pointing along the boundary

import * as info from "../control/info.js";
import * as nav from "../control/nav.js";
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

  const z_order = layer.zOrder([
    'g4_bac_cam',
    'barnwell_priory',
    'boundary',
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
  });

  layer.add(map, line, {
    id: 'boundary',
    text: 'Riverside area boundary',
    url: '/data/boundary.json',
    color: 'black',
    z_order: z_order,
    callback: init,
  });

  layer.add(map, locations, {
    id: 'historical',
    text: 'Historical locations',
    era: 'historical',
    color: 'yellow',
    staticPopups: true,
    z_order: z_order,
  });

  layer.add(map, locations, {
    id: 'contemporary',
    text: 'Contemporary locations',
    era: 'contemporary',
    color: 'red',
    staticPopups: true,
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
