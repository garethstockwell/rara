// Render a flat map

import * as boundary from "./boundary.js";
import * as info from "./info.js";
import * as layer from "./layer.js";
import * as locations from "./locations.js";

export var name = "ML fly";

export function createMap() {
    const config = {
        style: {
        "version": 8,
        "sources": {
            "sat": {
                "type": "raster",
                "tiles": [
                    "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg" // Satellite map
                ],
                "tileSize": 256
            },
            "osm-raster": {
                "type": "raster",
                "tiles": [
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png"  // OpenStreetMap Tile URL
                ],
                "tileSize": 256
            },
        /*
            "osm-vector": {
                "type": "vector",
                "tiles": [
                    'https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=zsAKnM69p5uDhfEeaTCu'
                ],
            },
        */
            "point": {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [0.0, 0.0]
                    }
                }
            }
        },
        "layers": [
        /*
            {
                "id": "sat",
                "type": "raster",
                "source": "sat",
                "minzoom": 0,
                "maxzoom": 19
            },
        */
            {
                "id": "osm-raster",
                "type": "raster",
                "source": "osm-raster",
                "minzoom": 0,
                "maxzoom": 19
            },
        /*
            {
                'id': 'road-labels',
                'type': 'symbol',
                'source': 'osm-vector',
                'source-layer': 'road',
                'minzoom': 10,
                'layout': {
                    'text-field': '{name}',
                    'text-font': ['Open Sans Bold'],
                    'text-size': 12
                },
                'paint': {
                    'text-color': '#FFFFFF', // White text for visibility on satellite imagery
                    'text-halo-color': '#000000', // Black halo for contrast
                    'text-halo-width': 1
                }
            },
        */
            {
                "id": "point",
                "source": "point",
                "type": "circle",
                "paint": { 'circle-radius': 10, 'circle-color': '#ff0000', 'circle-stroke-width': 2, 'circle-stroke-color': 'white' }
            }
        ],
        glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf"
        },
        center: [0.144843, 52.212231], // [lng, lat]
        zoom: 12,
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
    layer.add(locations, map, true);
    info.setUp(map);

    // The 'building' layer in the streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', () => {
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
                'id': '3d-buildings',
                'source': 'openfreemap',
                'source-layer': 'building',
                'type': 'fill-extrusion',
                'minzoom': 15,
                'filter': ['!=', ['get', 'hide_3d'], true],
                'paint': {
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

    return map;
}
