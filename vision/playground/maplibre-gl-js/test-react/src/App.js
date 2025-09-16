import { useState } from 'react';
import Map from './components/map.js';
import Navbar from './components/navbar.js';
import maplibre_flat from './maps/maplibre_flat.js';
import maplibre_globe from './maps/maplibre_globe.js';
import './App.css';

export default function App() {
  const maps = {
    "ML flat": maplibre_flat,
    "ML globe": maplibre_globe
  };

  const [activeMap, setActiveMap] = useState(Object.keys(maps)[0]);

  return (
    <div className="App">
      <Navbar
        data={Object.keys(maps)}
        onSelect={setActiveMap}
      />
      <Map
        createMap={maps[activeMap]}
      />
      <pre id="info"></pre>
    </div>
  );
}
