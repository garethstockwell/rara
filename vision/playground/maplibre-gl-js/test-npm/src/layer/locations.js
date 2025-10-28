// Add a map layer which shows locations

var _map = null;

// Dictionary of locations, indexed by location id
const locations = {};

function createLocation(id) {
  const entry = {
    coordinates: null,
    popup: null,
    visible: false
  };
  locations[id] = entry;
  return entry;
}

function addPopup(location) {
  const entry = locations[location.properties.id] ?? createLocation(location.properties.id);

  entry.coordinates = location.geometry.coordinates;

  entry.popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  entry.popup
    .setLngLat(entry.coordinates)
    .setHTML(location.properties.title)
    .addTo(_map);

  setPopupVisibility(location.properties.id, entry.visible);
}

export function setPopupVisibility(id, visible) {
  const entry = locations[id] ?? createLocation(id);
  entry.visible = visible;
  if (entry.popup) {
    entry.popup.getElement().style.visibility = visible ? 'visible' : 'hidden';
  }
}

export function getLocationCoordinates(id) {
  const entry = locations[id];
  if (entry) {
    return entry.coordinates;
  }
  console.log("Error: couldn't find location", id);
}

export function addLocationsLayer(map, options) {
  _map = map;

  map.on('load', async () => {
    var id = options.id;

    const image = await map.loadImage('../../assets/pin-' + options.color + '.png');
    map.addImage(id, image.data);

    fetch(options.url)
      .then(res => res.json())
      .then(data => {   
        if (options.tags) {
          data.features = data.features.filter(
            feature => options.tags.every((x) => feature.properties.tags.includes(x))
          );
        }

        data.features.forEach(feature => {
          addPopup(feature);
          if (options.staticPopups) {
            setPopupVisibility(feature.properties.id, true);
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
            'visibility': options.visible ? 'visible' : 'none'
          }
        }, options.zOrder ? options.zOrder.myPosition(id) : null);

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
