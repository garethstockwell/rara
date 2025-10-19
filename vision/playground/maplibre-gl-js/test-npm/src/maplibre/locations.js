// Add a map layer which shows locations

export function addLayer(map, options) {
  map.on('load', async () => {
    const image = await map.loadImage('../../assets/pin.png');
    map.addImage('custom-marker', image.data);

    fetch('../../data/locations.json')
      .then(res => res.json())
      .then(data => {
        map.addSource(options.name, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': data.map(item => ({
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
          'id': options.name,
          'type': 'symbol',
          'source': options.name,
          'layout': {
            'icon-image': 'custom-marker',
            'icon-size': 1.0,
            'icon-allow-overlap': true,
            'visibility': options.visible ? 'visible' : 'none'
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
        map.on('mousemove', options.name, (e) => {
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

        map.on('mouseleave', options.name, () => {
            currentFeatureCoordinates = undefined;
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

        if (options.callback) {
          options.callback(arguments);
        }
      }
    );
  });
}
