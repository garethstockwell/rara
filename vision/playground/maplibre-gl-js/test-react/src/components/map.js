import MapLibreFlat from './maplibre/flat.js';
import MapLibreGlobe from './maplibre/globe.js';
import './map.css';

export default function Map({
  activeMap,
}) {
  return (
    <div className="map-wrap">
      { activeMap === 'ML flat' ? <MapLibreFlat /> : null }
      { activeMap === 'ML globe' ? <MapLibreGlobe /> : null }
    </div>
  );
}
