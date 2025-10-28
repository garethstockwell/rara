// Control logic for heritage_trail page

import * as commentary from "../logic/commentary.js"
import * as locations from "../layer/locations.js";
import * as map from "../map/heritage_trail.js";

export function setUp() {
  commentary.setUp({
    onUpdate: function(oldId, newId) {
      locations.setPopupVisibility(oldId, false);
      locations.setPopupVisibility(newId, false);
      map.fly(oldId, newId);
    }
  })
}
