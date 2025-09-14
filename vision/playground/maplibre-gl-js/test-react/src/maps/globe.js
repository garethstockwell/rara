import maplibregl from 'maplibre-gl';

export default function createMap(container, config) {
  return new maplibregl.Map({
    container: container,
    style: 'https://demotiles.maplibre.org/globe.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1 // starting zoom
  });
}
