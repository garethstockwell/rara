import { useState } from 'react';
import Map from './components/map.js';
import Navbar from './components/navbar.js';
import flat from './maps/flat.js';
import globe from './maps/globe.js';
import './App.css';

export default function App() {
  const maps = {
    "Flat": flat,
    "Globe": globe
  };

  const locations = [
    {
      title: "St Andrew the Less",
      description: "Blah blah",
      coordinates: [0.139667, 52.208968]
    },
    {
      title: "Dinky Doors Emailerator",
      description: "Blah blah",
      coordinates: [0.138785, 52.210923]
    },
    {
      title: "Dinky Doors Flysing Saucer",
      description: "Blah blah",
      coordinates: [0.142605, 52.212513]
    }
  ];

  const [activeMap, setActiveMap] = useState(Object.keys(maps)[0]);

  return (
    <div className="App">
      <Navbar
        data={Object.keys(maps)}
        onSelect={setActiveMap}
      />
      <Map
        createMap={maps[activeMap]}
        locations={locations}
      />
      <pre id="info"></pre>
    </div>
  );
}
