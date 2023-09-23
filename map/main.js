// Map of Riverside Area

import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style} from 'ol/style.js';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './boundary.json'
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'red',
          width: 3,
        }),
      })
    }),
  ],
  view: new View({
    center: fromLonLat([0.14138, 52.2114]),
    zoom: 15.75,
  })
});
