import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Info from '../info.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../map.css';
import locations from "../../data/locations.json"
import boundary from "../../data/boundary.json"


const updateInfo = (e) => {
  console.log(e);

  var x = 
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    `${JSON.stringify(e.point)
    }<br />${
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat.wrap())}`;
}

export default function Flat() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [infoContents, setInfoContents] = useState(null);
  const [freezeInfo, setFreezeInfo] = useState(false);

  useEffect(() => {
    if (!map.current) {
      map.current = createMap();
    }

    const handleKeyDown = (e) => {
      if (e.key === "f") {

        if (freezeInfo) {
          console.log('off');
          map.current.off('mousemove', updateInfo);
        } else {
          console.log('on');
          map.current.on('mousemove', updateInfo);
        }

        setFreezeInfo((freezeInfo) => !freezeInfo);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  function createMap() {
    const config = {
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
      center: [0.144843, 52.212231], // [lng, lat]
      zoom: 15.5,
      container: mapContainer.current
    };

    var map = new maplibregl.Map(config);

    addBoundary(map);
    addMarkers(map);

    return map;
  }

  function addBoundary(map) {
    map.on('load', async () => {
      map.addSource('route', {
        'type': 'geojson',
        'data': boundary
      });

      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#ff0000',
          'line-width': 3
        }
      });
    });
  }

  function addMarkers(map) {
    map.on('load', async () => {
      // Add markers

      const image = await map.loadImage('https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png');
      // Add an image to use as a custom marker
      map.addImage('custom-marker', image.data);

      map.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': locations.map(item => ({
            'type': 'Feature',
              'properties': {
                  'description': '<strong>' + item.title + '</strong><p>' + item.description + '</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': item.coordinates
              }
          }))
        }
      });

      // Add a layer showing the places.
      map.addLayer({
        'id': 'places',
        'type': 'symbol',
        'source': 'places',
        'layout': {
          'icon-image': 'custom-marker',
          'icon-overlap': 'always'
        }
      });

      // Create a popup, but don't add it to the map yet.
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // Make sure to detect marker change for overlapping markers
      // and use mousemove instead of mouseenter event
      let currentFeatureCoordinates = undefined;
      map.on('mousemove', 'places', (e) => {
        const featureCoordinates = e.features[0].geometry.coordinates.toString();
        if (currentFeatureCoordinates !== featureCoordinates) {
          currentFeatureCoordinates = featureCoordinates;

          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';

          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        }
      });

      map.on('mouseleave', 'places', () => {
          currentFeatureCoordinates = undefined;
          map.getCanvas().style.cursor = '';
          popup.remove();
      });
    });
  }

  return (
    <div>
      <div ref={mapContainer} className="map"></div>
      <Info contents={infoContents}/>
    </div>
  );
}
