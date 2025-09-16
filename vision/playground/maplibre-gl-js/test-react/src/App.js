import { createContext, useState } from 'react';
import Map from './components/map.js';
import Navbar from './components/navbar.js';
import maplibre_flat from './components/maplibre/flat.js';
import maplibre_globe from './components/maplibre/globe.js';
import './App.css';

export const AppContext = createContext(null);

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
    </div>
  );
}
