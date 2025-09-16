import { useState } from 'react';
import Map from './components/map.js';
import Navbar from './components/navbar.js';
import './App.css';

export default function App() {
  const maps = [
    "ML flat",
    "ML globe"
  ];

  const [activeMap, setActiveMap] = useState(maps[0]);
  
  return (
    <div className="App">
      <Navbar
        data={maps}
        onSelect={setActiveMap}
      />
      <Map
        activeMap={activeMap}
      />
    </div>
  );
}
