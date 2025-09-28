// Top-level script

import * as flat from './maplibre/flat.js'
import * as globe from './maplibre/globe.js'
import * as info from './maplibre/info.js'
import * as menu from './menu.js'

var createMap = {};
var map = null;

function showMap(name) {
    if (map) {
        map.remove();
        map = null;

        menu.reset();
        info.hide();
    }

    map = createMap[name]();
}

function registerMap(module) {
    createMap[module.name] = module.createMap;
    
    const button = document.createElement("button");
    button.innerHTML = module.name;
    button.onclick = function() { showMap(module.name); };

    const nav = document.getElementById("nav");
    nav.appendChild(button);
}

export default function main() {
    registerMap(flat);
    registerMap(globe);

    showMap("ML flat");
}
