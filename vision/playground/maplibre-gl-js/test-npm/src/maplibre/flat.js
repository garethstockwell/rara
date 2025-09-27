// From https://maplibre.org/maplibre-gl-js/docs/

import addBoundaryLayer from "./boundary.js";

export var name = "ML flat";

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
            }
        },
        "layers": [
            {
            "id": "osm-layer",
            "type": "raster",
            "source": "osm",
            "minzoom": 0,
            "maxzoom": 19
            }
        ]
        },
        center: [0.144843, 52.212231], // [lng, lat]
        zoom: 15.5,
        container: "map"
    };

    var map = new maplibregl.Map(config);

    map.on('load', function() {
        addBoundaryLayer(map);
        //addMarkers(map);
    });

    return map;
}
