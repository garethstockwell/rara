// Add a map layer which shows an area boundary

export var name = 'boundary';

export function addLayer(map, visible) {
  map.on('load', async () => {
    fetch('../../data/boundary.json')
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
            'visibility': visible ? 'visible' : 'none'
          },
          'paint': {
            'line-color': '#334155',
            'line-width': 6
          }
        });
      }
    );
  });
}
