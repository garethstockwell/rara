// Attributions

var attributions = [];
var attributionControl = null;

export function addAttribution(map, text, attribution) {
  attributions.push([text, attribution]);

  if (attributionControl) {
    map.removeControl(attributionControl);
  }

  attributionControl = new maplibregl.AttributionControl({
    compact: true,
    customAttribution: 'Attributions:<br><ul>' + attributions.map((x) => '<li>' + x[0] + ': ' + x[1] + '</li>').join('') + '</ul>'
  });

  map.addControl(attributionControl, 'bottom-right');

  // Collapse the control
  var controlElem = document.getElementsByClassName('maplibregl-ctrl-bottom-right')[0];
  var containerElem = controlElem.getElementsByTagName('details')[0];
  containerElem.classList.remove('maplibregl-compact-show');
  containerElem.removeAttribute('open');
}
