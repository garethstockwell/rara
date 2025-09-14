import { useRef, useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map({
  createMap
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const data = {
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
    center: [0.142112, 52.2105086], // [lng, lat]
    zoom: 16.5
  };

  useEffect(() => {
    if (map.current) map.current.remove();

    map.current = createMap(mapContainer.current, data);
  });

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
