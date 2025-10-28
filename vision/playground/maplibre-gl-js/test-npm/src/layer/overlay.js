// Add a map layer which shows an image

import * as attribution from "../control/attribution.js";

export function addLayer(map, options) {
  var id = options.id;

  map.on('load', () => {
    fetch('/data/overlays.json')
      .then(res => res.json())
      .then(data => {
        const entry = data.overlays.features.find(item => item.properties.id === id);

        // Add image source
        map.addSource(id, {
          type: 'image',
          url: entry.properties.url,
          coordinates: entry.geometry.coordinates
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
        }, options.zOrder ? options.zOrder.myPosition(id) : null);

        if (entry.properties.attribution) {
          var attrib = data.attributions[entry.properties.attribution]
          if (attrib) {
            attribution.addAttribution(map, attrib, options.text);
          }
        }

        if (options.callback) {
          options.callback(['overlay', id]);
        }
      });
  });
}
