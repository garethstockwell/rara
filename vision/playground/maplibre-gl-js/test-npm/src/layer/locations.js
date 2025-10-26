// Add a map layer which shows locations

var _map = null;

// Dictionary of popups, indexed by location id
const popups = {};

function createPopupEntry(id) {
  const entry = {
    popup: null,
    visible: false
  };
  popups[id] = entry;
  return entry;
}

function addPopup(location) {
  const entry = popups[location.id] ?? createPopupEntry(location.id);

  entry.popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  entry.popup
    .setLngLat(location.coordinates)
    .setHTML(location.title)
    .addTo(_map);

  setPopupVisibility(location.id, entry.visible);
}

export function setPopupVisibility(id, visible) {
  const entry = popups[id] ?? createPopupEntry(id);
  entry.visible = visible;
  if (entry.popup) {
    entry.popup.getElement().style.visibility = visible ? 'visible' : 'hidden';
  }
}

export function addLayer(map, options) {
  _map = map;

  map.on('load', async () => {
    var id = options.id;

    const image = await map.loadImage('../../assets/pin-' + options.color + '.png');
    map.addImage(id, image.data);

    fetch(options.url)
      .then(res => res.json())
      .then(data => {
        var items = data;
        
        if (options.tags) {
          items = items.filter(item => options.tags.every((x) => item.tags.includes(x)));
        }

        items.forEach(item => {
          addPopup(item);
          if (options.staticPopups) {
            setPopupVisibility(item.id, true);
          }
        });

        map.addSource(id, {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': items.map(item => ({
              'type': 'Feature',
              'properties': {
                  'id': item.id
              },
              'geometry': {
                'type': 'Point',
                'coordinates': item.coordinates
              }
            }))
          }
        });

        map.addLayer({
          'id': id,
          'type': 'symbol',
          'source': id,
          'layout': {
            'icon-image': id,
            'icon-size': 1.0,
            'icon-allow-overlap': true,
            'visibility': options.visible ? 'visible' : 'none'
          }
        }, options.z_order ? options.z_order.myPosition(id) : null);

        if (!options.staticPopups) {
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
                setPopupVisibility(currentFeatureId, false);
              }

              currentFeatureId = e.features[0].properties.id;
              setPopupVisibility(currentFeatureId, true);
            }
          });

          map.on('mouseleave', id, () => {
            map.getCanvas().style.cursor = '';
            setPopupVisibility(currentFeatureId, false);
            currentFeatureId = undefined;
            currentFeatureCoordinates = undefined;
          });
        }

        if (options.onclick) {
          map.on('click', id, (e) => {
            options.onclick(e.features[0].properties.id);
          });
        }
      }
    );
  });
}
