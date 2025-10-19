// Add a map layer which shows a line

export function addLayer(map, options) {
  map.on('load', async () => {
    fetch('../../data/' + options.name + '.json')
      .then(res => res.json())
      .then(data => {
        map.addSource(options.name, {
          'type': 'geojson',
          'data': data
        });

        map.addLayer({
          'id': options.name,
          'type': 'line',
          'source': options.name,
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': options.visible ? 'visible' : 'none'
          },
          'paint': {
            'line-color': '#334155',
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
