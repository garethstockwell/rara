// Attributions

var attributions = [];
var attributionControl = null;

export function addAttribution(map, attribution, text) {
  if (!attributions.includes(attribution)) {
    attributions.push(attribution);
  }

  if (attributionControl) {
    map.removeControl(attributionControl);
  }

  attributionControl = new maplibregl.AttributionControl({
    compact: true,
    customAttribution: '<br>' + attributions.join('<br>')
  });

  map.addControl(attributionControl, 'bottom-right');

  // Collapse the control
  var controlElem = document.getElementsByClassName('maplibregl-ctrl-bottom-right')[0];
  var containerElem = controlElem.getElementsByTagName('details')[0];
  containerElem.classList.remove('maplibregl-compact-show');
  containerElem.removeAttribute('open');
}
