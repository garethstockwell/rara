// Add a map layer which shows an image

export function addLayer(map, options) {
  var name = options.name;

  map.on('load', async () => {
  fetch('../../data/overlays.json')
    .then(res => res.json())
    .then(data => {
      const entry = data.find(item => item.key === name);

      const bounds = [
        entry.bounds[0],
        [entry.bounds[1][0], entry.bounds[0][1]],
        entry.bounds[1],
        [entry.bounds[0][0], entry.bounds[1][1]],
      ]

      // Add image source
      map.addSource(name, {
        type: 'image',
        url: '../../' + entry.filename,
        coordinates: bounds
      });

      // Add raster layer using that source
      map.addLayer({
        id: name,
        type: 'raster',
        source: name,
        paint: {
          'raster-opacity': options.opacity ?? 1.0
        },
        layout: {
          visibility: options.visible ? 'visible' : 'none'
        }
      });
    });
  });
}
