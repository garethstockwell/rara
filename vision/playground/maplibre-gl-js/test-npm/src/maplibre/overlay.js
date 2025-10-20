// Add a map layer which shows an image

export function addLayer(map, options) {
  var name = options.name;

  map.on('load', () => {
    // Add image source
    map.addSource(name, {
      type: 'image',
      url: '../../' + options.filename,
      coordinates: options.bounds
    });

    // Add raster layer using that source
    map.addLayer({
      id: name,
      type: 'raster',
      source: name,
      paint: {
        'raster-opacity': options.opacity ?? 1.0
      }
    });
  });
}
