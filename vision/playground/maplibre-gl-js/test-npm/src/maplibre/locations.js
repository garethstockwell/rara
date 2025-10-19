// Add a map layer which shows locations

export function addLayer(map, options) {
  var name = options.name;

  map.on('load', async () => {
    const image = await map.loadImage('../../assets/pin-' + options.color + '.png');
    map.addImage(name, image.data);

    fetch('../../data/locations.json')
      .then(res => res.json())
      .then(data => {
        console.log("data", data);

        var features = data.reduce(function(result, item) {
          if (item.era == options.era) {
            result.push({
              'type': 'Feature',
              'properties': {
                  'description': '<strong>' + item.title + '</strong><p>' + item.description + '</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': item.coordinates
              }
            });
          }
          return result;
        }, []);

        console.log("features", features);

        map.addSource(name, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': features
          }
        });

        // Add a layer showing the places.
        map.addLayer({
          'id': name,
          'type': 'symbol',
          'source': name,
          'layout': {
            'icon-image': name,
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
        map.on('mousemove', name, (e) => {
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

        map.on('mouseleave', name, () => {
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
