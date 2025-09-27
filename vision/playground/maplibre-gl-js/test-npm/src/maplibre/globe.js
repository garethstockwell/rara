// From https://maplibre.org/maplibre-gl-js/docs/

export var name = "ML globe";

export function createMap() {
    console.log("globe.createMap");

    const map = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://demotiles.maplibre.org/globe.json', // style URL
        center: [0, 0], // starting position [lng, lat]
        zoom: 1 // starting zoom
    });

    return map;
}
