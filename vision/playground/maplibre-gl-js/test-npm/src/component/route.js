// Component which allows camera to fly along a route

export class Route {
  #camera;
  #distance;
  #map;
  #route;

  #startTime;
  #startCoord;
  #startPoint;
  #startDistance;

  #stopCoord;
  #stopPoint;
  #stopDistance;
  #reachedStopDistance;
  
  #speed;
  #direction;

  /**
   * Create a Route
   * @param {Object}         args           The arguments
   * @param {boolean}        args.autoStart Start flight as soon as route is loaded
   * @param {int}            args.altitude  Camera altitude in meters
   * @param {int}            args.distance  Camera trailing distance in meters
   * @param {string}         args.lineId    Identifier of line to follow
   * @param {maplibregl.Map} args.map       The map
   */
  constructor(args) {
    this.#camera = {
      coord: null,
      altitude: args.altitude ?? 500,
      distance: null
    };
    this.#distance = args.distance ?? 500;
    this.#map = args.map;
    this.#speed = 0.0001;
  
    this.#init(args.lineId, args.autoStart ?? false);
  }

  #init(lineId, autoStart) {
    var line = this.#map.getSource(lineId);
    line.getData().then((data) => {
      console.log("Route loaded");

      var coordinates = data.features[0].geometry.coordinates;
      this.#route = turf.lineString(coordinates);

      // calculate camera startpoint
      //  - compute the direction of the first quater of the route
      //  - and place the camera in to opposite direction of this point
      let a = maplibregl.MercatorCoordinate.fromLngLat(coordinates[0]);
      let b = maplibregl.MercatorCoordinate.fromLngLat(
        turf.along(this.#route, turf.lineDistance(this.#route) / 4).geometry.coordinates);
      let dx = b.x - a.x, dy = b.y - a.y;
      this.#camera.distance = this.#distance ?? Math.hypot(dx, dy);
      this.#camera.coord = new maplibregl.MercatorCoordinate(a.x - dx, a.y - dy);

      // FIXME! when using flyTo the positioning is not correct
      this.#map.jumpTo(this.#map.calculateCameraOptionsFromTo(
        this.#camera.coord.toLngLat(),
        this.#camera.altitude,
        coordinates[0]));

      if (autoStart) {
        console.log("Automatically starting");
        this.#start();
      }
    });
  }

  #start() {
    console.log("Route.start");

    this.#startDistance = 0;
    this.#stopDistance = null;
    this.#reachedStopDistance = false;
    this.#direction = 1;

    if (this.#startCoord) {
      console.log("Start coordinates:", this.#startCoord);
      const startPoint = turf.point(this.#startCoord);
      const snappedStartPoint = turf.nearestPointOnLine(this.#route, startPoint);
      this.#startDistance = snappedStartPoint.properties.location;
      console.log("Start distance (km):", this.#startDistance);
    }

    if (this.#stopCoord) {
      console.log("Stop coordinates:", this.#stopCoord);
      const stopPoint = turf.point(this.#stopCoord);
      const snappedStopPoint = turf.nearestPointOnLine(this.#route, stopPoint);
      this.#stopDistance = snappedStopPoint.properties.location;
      console.log("Stop distance (km):", this.#stopDistance);
    }

    if (this.#stopDistance && (this.#stopDistance < this.#startDistance)) {
      this.#direction = -1;
    }

    this.#startTime = Date.now();

    this.#advance();
  }

  #advance() {
    if (this.#reachedStopDistance) {
      return;
    }

    const now = Date.now();

    let elapsedTime = (now - this.#startTime);
    let currentDistance = this.#startDistance + (elapsedTime * this.#speed * this.#direction);

    if (!this.#stopDistance) {
      let totalDistance = turf.lineDistance(this.#route);
      currentDistance = currentDistance % totalDistance;
    }

    //console.log('advance currentDistance=', currentDistance, 'stopDistance=', stopDistance);

    let lngLat = turf.along(this.#route, currentDistance).geometry.coordinates;
    this.#map.getSource('point').setData({ type: 'Point', coordinates: lngLat });

    // Let the camera follow the route
    let coord = maplibregl.MercatorCoordinate.fromLngLat(lngLat);
    let dx = coord.x - this.#camera.coord.x, dy = coord.y - this.#camera.coord.y;
    let delta = Math.hypot(dx, dy) - this.#camera.distance;
    if (delta > 0) {
      let a = Math.atan2(dy, dx);
      this.#camera.coord.x += Math.cos(a) * delta;
      this.#camera.coord.y += Math.sin(a) * delta;
    }
    // FIXME! when using easeTo the positioning is not correct
    this.#map.jumpTo(this.#map.calculateCameraOptionsFromTo(
        this.#camera.coord.toLngLat(),
        this.#camera.altitude,
        lngLat));

    // Determine whether stop point has been reached
    if (this.#stopDistance !== null && ((
        this.#direction > 0 &&
        currentDistance >= this.#stopDistance
      ) || (
        this.#direction < 0 &&
        currentDistance <= this.#stopDistance
      ))) {
      this.#reachedStopDistance = true;
      console.log("Stopped at distance:", this.#stopDistance);
      return;
    }

    requestAnimationFrame(() => { this.#advance() });
  };

  /**
   * Fly from start position to stop position
   * @param {[float, float]} startPos Start position, expressed as [lat, lng]
   * @param {[float, float]} stopPos  Stop position, expressed as [lat, lng]
   */
  fly(startPos, stopPos) {
    console.log('Fly from', startPos, 'to', stopPos);

    this.#startCoord = startPos;
    this.#stopCoord = stopPos;

    this.#reachedStopDistance = false;

    if (this.#route) {
      this.#start();
    }
  }
}

