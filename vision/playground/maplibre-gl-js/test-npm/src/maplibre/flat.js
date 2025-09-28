// From https://maplibre.org/maplibre-gl-js/docs/

import * as coordinates from "../coordinates.js";
import * as menu from "../menu.js";

import * as boundary from "./boundary.js";
import * as locations from "./locations.js";

export var name = "ML flat";

function addLayer(module, map, visible) {
    module.addLayer(map, visible);

    function toggle (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
        );

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
    };

    menu.add(module.name, toggle, visible);
}

function addCoordInfo(map) {
    coordinates.track(map);

    function toggle (e) {
        this.className = coordinates.toggle() ? 'active' : '';
    };

    menu.add("coordinates", toggle, false);
}

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

    addLayer(boundary, map, true);
    addLayer(locations, map, true);
    addCoordInfo(map);

    return map;
}
