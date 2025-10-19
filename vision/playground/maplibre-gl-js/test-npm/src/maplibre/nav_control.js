// Navigation controls

import * as info from "./info.js";

export function add(map, showZoom = true) {
    // Add zoom and rotation controls to the map.
    const control = map.addControl(new maplibregl.NavigationControl({
        visualizePitch: true,
        visualizeRoll: true,
        showZoom: showZoom,
        showCompass: true
    }));

    function onZoom(e) {
        setTimeout(function() { info.update(map); }, 700);
    }

    if (showZoom) {
        document.getElementsByClassName('maplibregl-ctrl-zoom-in')[0].addEventListener('click', onZoom);
        document.getElementsByClassName('maplibregl-ctrl-zoom-out')[0].addEventListener('click', onZoom);
    }
}
