import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../map.css';

export default function Globe() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;
    map.current = createMap();
  });

  function createMap() {
    return new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/globe.json', // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1 // starting zoom
    });
  }

  return (
    <div ref={mapContainer} className="map" />
  );
}



