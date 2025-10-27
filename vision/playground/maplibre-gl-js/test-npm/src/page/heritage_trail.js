// Control logic for heritage_trail page

import * as locations from "../layer/locations.js";
import * as map from "../map/heritage_trail.js";

export function setUp() {
  const locationIds = Array.from(document.querySelectorAll(".commentary")).map(el => el.id);

  var locationIndex = 0;
  var locationId = locationIds[locationIndex];
  locations.setPopupVisibility(locationId, true);

  const prevButtons = document.querySelectorAll('.prev-button');
  const prevLabels = document.querySelectorAll('.prev-label');
  const nextButtons = document.querySelectorAll('.next-button');
  const nextLabels = document.querySelectorAll('.next-label');

  function onLocationIndexUpdate() {
    console.log("locationIndex", locationIndex);

    document.querySelector('#' + locationId).style.display = 'none';
    locations.setPopupVisibility(locationId, false);

    locationId = locationIds[locationIndex];
    document.querySelector('#' + locationId).style.display = '';
    locations.setPopupVisibility(locationId, true);

    if (locationIndex > 0) {
      prevButtons.forEach(el => el.style.display = '');
      prevLabels.forEach(el => el.textContent = document.querySelector(
        '#' + locationIds[locationIndex - 1]).querySelector('h1').textContent);
    } else {
      prevButtons.forEach(el => el.style.display = 'none');
    }

    if (locationIndex + 1 < locationIds.length) {
      nextButtons.forEach(el => el.style.display = '');
      nextLabels.forEach(el => el.textContent = document.querySelector(
        '#' + locationIds[locationIndex + 1]).querySelector('h1').textContent);
    } else {
      nextButtons.forEach(el => el.style.display = 'none');
    }
  }

  function onPrev() {
    const fromLocation = locationId;
    locationIndex = (locationIndex - 1 + locationIds.length) % locationIds.length;
    onLocationIndexUpdate();
    map.fly(fromLocation, locationId);
  }

  function onNext() {
    const fromLocation = locationId;
    locationIndex = (locationIndex + 1) % locationIds.length;
    onLocationIndexUpdate();
    map.fly(fromLocation, locationId);
  }

  prevButtons.forEach(el => el.addEventListener('click', onPrev));
  nextButtons.forEach(el => el.addEventListener('click', onNext));

  onLocationIndexUpdate();
}
