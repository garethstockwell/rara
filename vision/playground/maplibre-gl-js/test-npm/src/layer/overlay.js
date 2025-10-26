// Add a map layer which shows an image

import * as attribution from "../control/attribution.js";

export function addLayer(map, options) {
  var id = options.id;

  map.on('load', () => {
    fetch('../../data/overlays.json')
      .then(res => res.json())
      .then(data => {
        const entry = data.overlays.find(item => item.id === id);

        const bounds = [
          entry.bounds[0],
          [entry.bounds[1][0], entry.bounds[0][1]],
          entry.bounds[1],
          [entry.bounds[0][0], entry.bounds[1][1]],
        ]

        // Add image source
        map.addSource(id, {
          type: 'image',
          url: entry.url,
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
        }, options.z_order ? options.z_order.myPosition(id) : null);

        if (entry.attribution) {
          var attrib = data.attributions[entry.attribution]
          if (attrib) {
            attribution.addAttribution(map, attrib, options.text);
          }
        }
      });

    if (options.callback) {
      options.callback(['overlay', id]);
    }
  });
}
