// Fly along a line

export function createRoute(map, options) {
  const altitude = options.altitude ?? 500;

  let camera = { coord: null, altitude: altitude, distance: null }
  let startTime = null;
  let speed = 0.0001;

  let route = null;

  let startCoord = null;
  let stopCoord = null;
  let startDistance = null;
  let stopDistance = null;
  let reachedStopDistance = true;

  function init() {
    var line = map.getSource(options.lineId);
    line.getData().then((data) => {
      console.log("Route loaded");

      var coordinates = data.features[0].geometry.coordinates;
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

      if (options.autoStart) {
        console.log("Automatically starting");
        start();
      }
    });
  }

  function start() {
    console.log("start");

    startDistance = 0;
    stopDistance = null;
    reachedStopDistance = false;

    if (startCoord) {
      console.log("Start coordinates:", startCoord);
      const startPoint = turf.point(startCoord);
      const snappedStartPoint = turf.nearestPointOnLine(route, startPoint);
      startDistance = snappedStartPoint.properties.location;
      console.log("Start distance (km):", startDistance);
    }

    if (stopCoord) {
      console.log("Stop coordinates:", stopCoord);
      const stopPoint = turf.point(stopCoord);
      const snappedStopPoint = turf.nearestPointOnLine(route, stopPoint);
      stopDistance = snappedStopPoint.properties.location;
      console.log("Stop distance (km):", stopDistance);
    }

    startTime = Date.now();

    advance();
  }

  function advance() {
    if (reachedStopDistance) {
      return;
    }

    const now = Date.now();

    let elapsedTime = (now - startTime);
    let currentDistance = startDistance + (elapsedTime * speed);

    if (!stopDistance) {
      let totalDistance = turf.lineDistance(route);
      currentDistance = currentDistance % totalDistance;
    }

    //console.log('advance currentDistance=', currentDistance, 'stopDistance=', stopDistance);

    let lngLat = turf.along(route, currentDistance).geometry.coordinates;
    map.getSource('point').setData({ type: 'Point', coordinates: lngLat });

    // Let the camera follow the route
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

    if (stopDistance !== null && currentDistance >= stopDistance) {
      reachedStopDistance = true;
      console.log("Stopped at distance:", stopDistance);
      return;
    }

    requestAnimationFrame(advance);
  };

  function fly(startPos, stopPos) {
    console.log('Fly from', startPos, 'to', stopPos);

    startCoord = startPos;
    stopCoord = stopPos;

    reachedStopDistance = false;

    if (route) {
      start();
    }
  }

  init();

  return {
    fly: fly
  };
}