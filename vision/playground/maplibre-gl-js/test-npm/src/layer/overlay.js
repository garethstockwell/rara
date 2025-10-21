// Add a map layer which shows an image

export function addLayer(map, options) {
  var id = options.id;

  map.on('load', () => {
    fetch('../../data/overlays.json')
      .then(res => res.json())
      .then(data => {
        const entry = data.find(item => item.id === id);

        const bounds = [
          entry.bounds[0],
          [entry.bounds[1][0], entry.bounds[0][1]],
          entry.bounds[1],
          [entry.bounds[0][0], entry.bounds[1][1]],
        ]

        // Add image source
        map.addSource(id, {
          type: 'image',
          url: '../../' + entry.filename,
          coordinates: bounds
        });

        // Add raster layer using that source
        map.addLayer({
          id: id,
          type: 'raster',
          source: id,
          paint: {
            'raster-opacity': options.opacity ?? 1.0
          },
          layout: {
            visibility: options.visible ? 'visible' : 'none'
          }
        });
      });

    if (options.callback) {
      options.callback(['overlay', id]);
    }
  });
}
