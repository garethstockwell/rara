import { useRef, useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map({
  createMap,
  locations
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) map.current.remove();

    map.current = createMap(mapContainer.current, locations);
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
