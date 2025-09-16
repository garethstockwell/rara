import maplibregl from 'maplibre-gl';

export default function createMap(container, locations) {
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
    center: [0.142112, 52.2105086], // [lng, lat]
    zoom: 16.25,
    container: container
  };

  const map = new maplibregl.Map(config);

  map.on('load', async () => {
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

  map.on('mousemove', (e) => {
    document.getElementById('info').innerHTML =
      // e.point is the x, y coordinates of the mousemove event relative
      // to the top-left corner of the map
      `${JSON.stringify(e.point)
      }<br />${
          // e.lngLat is the longitude, latitude geographical position of the event
          JSON.stringify(e.lngLat.wrap())}`;
  });

  return map;
}
