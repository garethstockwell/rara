import { useState } from 'react';
import Map from './components/map.js';
import Navbar from './components/navbar.js';
import flat from './maps/flat.js';
import globe from './maps/globe.js';
import './App.css';

export default function App() {
  const maps = {
    "Globe": globe,
    "Flat": flat
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
