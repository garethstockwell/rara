// Add a map layer which shows locations

/**
 * Create the map
 * @param {Object} args              The arguments
 */
export function addLocationsLayer(map, args) {
  map.on('load', async () => {
    var id = args.id;

    const popups = map.appData.popups;

    const image = await map.loadImage('../../assets/pin-' + args.color + '.png');
    map.addImage(id, image.data);

    fetch(args.url)
      .then(res => res.json())
      .then(data => {   
        if (args.tags) {
          data.features = data.features.filter(
            feature => args.tags.every((x) => feature.properties.tags.includes(x))
          );
        }

        data.features.forEach(feature => {
          const popup = popups.getPopup(feature.properties.id);
          popup.setLocation(feature.geometry.coordinates, feature.properties.title);
          if (args.staticPopups) {
            popup.visible = true;
          }
        });

        map.addSource(id, {
          'type': 'geojson',
          'data': data
        });

        map.addLayer({
          'id': id,
          'type': 'symbol',
          'source': id,
          'layout': {
            'icon-image': id,
            'icon-size': 1.0,
            'icon-allow-overlap': true,
            'visibility': args.visible ? 'visible' : 'none'
          }
        }, args.zOrder ? args.zOrder.getPosition(id) : null);

        if (!args.staticPopups) {
          // Make sure to detect marker change for overlapping markers
          // and use mousemove instead of mouseenter event
          let currentFeatureId = undefined;
          let currentFeatureCoordinates = undefined;
          map.on('mousemove', id, (e) => {
            const featureCoordinates = e.features[0].geometry.coordinates.toString();
            if (currentFeatureCoordinates !== featureCoordinates) {
              currentFeatureCoordinates = featureCoordinates;

              // Change the cursor style as a UI indicator.
              map.getCanvas().style.cursor = 'pointer';

              const coordinates = e.features[0].geometry.coordinates.slice();

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              if (currentFeatureId) {
                popups.getPopup(currentFeatureId).visible = false;
              }

              currentFeatureId = e.features[0].properties.id;
              popups.getPopup(currentFeatureId).visible = true;
            }
          });

          map.on('mouseleave', id, () => {
            map.getCanvas().style.cursor = '';
            popups.getPopup(currentFeatureId).visible = false;
            currentFeatureId = undefined;
            currentFeatureCoordinates = undefined;
          });
        }

        if (args.onclick) {
          map.on('click', id, (e) => {
            args.onclick(e.features[0].properties.id);
          });
        }
      }
    );
  });
}
