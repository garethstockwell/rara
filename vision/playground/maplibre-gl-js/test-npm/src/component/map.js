// Map component

import { Info } from "../component/info.js";
import { LayerManager } from "../component/layer.js";
import { Menu } from "../component/menu.js";
import { LocationManager } from "../component/location.js";


function addNavigationControl(map) {
  map.addControl(new maplibregl.NavigationControl({
    visualizePitch: true,
    visualizeRoll: true,
    showZoom: true,
    showCompass: true
  }));

  map.addControl(new maplibregl.FullscreenControl());

  map.addControl(new maplibregl.ScaleControl(), 'bottom-right');

  function onZoom(e) {
    setTimeout(function() { info.update(map); }, 700);
  }

  document.getElementsByClassName('maplibregl-ctrl-zoom-in')[0].addEventListener('click', onZoom);
  document.getElementsByClassName('maplibregl-ctrl-zoom-out')[0].addEventListener('click', onZoom);
}


/**
 * Create a Map
 * @param {Object}        args        The arguments
 * @param {Object}        args.config Map configuration
 * @param {Array<string>} args.zOrder List of layer IDs, lowest to highest
 */
export function Map(args) {
  console.log("Map", args);

  const map = new maplibregl.Map(args.config);

  const info = new Info({
    map: map,
  });

  const menu = new Menu();

  const layerManager = new LayerManager({
    map: map,
    menu: menu,
    zOrder: args.zOrder ?? [],
  });

  const locationManager = new LocationManager({
    map: map,
  })
  
  map.appData = {
    layers: layerManager,
    locations: locationManager,
  };

  addNavigationControl(map);

  return map;
}
