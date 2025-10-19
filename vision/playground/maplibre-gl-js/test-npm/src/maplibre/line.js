// Add a map layer which shows a line

export function addLayer(map, options) {
  var name = options.name;

  map.on('load', async () => {
    fetch('../../data/' + options.filename)
      .then(res => res.json())
      .then(data => {
        map.addSource(name, {
          'type': 'geojson',
          'data': data
        });

        map.addLayer({
          'id': name,
          'type': 'line',
          'source': name,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': options.visible ? 'visible' : 'none'
          },
          'paint': {
            'line-color': options.color,
            'line-width': 6
          }
        });

        if (options.callback) {
          options.callback(arguments);
        }
      }
    );
  });
}
