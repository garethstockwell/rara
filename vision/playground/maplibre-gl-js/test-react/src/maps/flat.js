import maplibregl from 'maplibre-gl';

export default function createMap(container, data) {
  return new maplibregl.Map(Object.assign({}, data, {
    container: container
  }));
}
