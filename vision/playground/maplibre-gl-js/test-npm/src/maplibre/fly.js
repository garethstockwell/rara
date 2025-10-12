// Render a flat map

import * as boundary from "./boundary.js";
import * as info from "./info.js";
import * as layer from "./layer.js";

export var name = "ML fly";

export function createMap() {
    const config = {
        style: {
        "version": 8,
        "sources": {
            "osm": {
                "type": "raster",
                "tiles": [
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png"  // OpenStreetMap Tile URL
                ],
                "tileSize": 256
            },
            "point": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        coordinates: [0.0, 0.0]
                    }
                }
            }
        },
        "layers": [
            {
                "id": "osm-layer",
                "type": "raster",
                "source": "osm",
                "minzoom": 0,
                "maxzoom": 19
            },
            {
                "id": "point",
                "source": "point",
                "type": "circle",
                "paint": { 'circle-radius': 10, 'circle-color': '#ff0000', 'circle-stroke-width': 2, 'circle-stroke-color': 'white' }
            }
        ]
        },
        center: [0.144843, 52.212231], // [lng, lat]
        zoom: 15.5,
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

    let init = (name) => {
        console.log("start", name);

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

    layer.add(boundary, map, true, init);
    info.setUp(map);

    return map;
}
