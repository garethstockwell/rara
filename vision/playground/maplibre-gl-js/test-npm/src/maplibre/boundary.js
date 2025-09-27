export var name = 'boundary';

export default async function addLayer(map) {
  var boundary = [];

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
          'visibility': 'visible'
        },
        'paint': {
          'line-color': '#ff0000',
          'line-width': 3
        }
      });
    }
  );
}
