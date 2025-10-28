// Popup component


class Popup {
  #id;
  #coordinates;
  #manager;
  #visible;
  #popup;
  
  /**
   * Create a Popup
   * @param {PopupManager} manager The parent manager
   * @param {string}       id      The location ID
   * @param {boolean}      visible Popup visibility
   */
  constructor(manager, id, visible) {
    console.log(`Popup.create id=${id}`)
    this.#id = id;
    this.#coordinates = null;
    this.#manager = manager;
    this.#visible = false;
  }

  set visible(visible) {
    console.log(`Popup.setVisible id=${this.#id} visible=${visible}`);
    this.#visible = visible;
    this.#onVisibleChange();
  }

  get coordinates() {
    return this.#coordinates;
  }

  get visible() {
    return this.#visible;
  }

  setLocation(coordinates, text) {
    console.log(`Popup.setLocation id=${this.#id} coordinates=${coordinates}`);
    this.#coordinates = coordinates;
    this.#popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.#popup
      .setLngLat(coordinates)
      .setHTML(text)
      .addTo(this.#manager.map);

    this.#onVisibleChange();
  }

  #onVisibleChange() {
    console.log(`Popup.onVisibleChange id=${this.#id} visible=${this.visible} popup=${this.#popup}`);
    if (this.#popup) {
      this.#popup.getElement().style.visibility = this.visible ? 'visible' : 'hidden';
    }
  }
}


/**
 * Manager of a set of popups
 */
export class PopupManager {
  #popups;
  #map;

  /**
   * Create a PopupManager
   * @param {Object}         args        The arguments
   * @param {maplibregl.Map} args.map    The map
   */
  constructor(args) {
    this.#popups = {};
    this.#map = args.map;
  }

  /**
   * Get map
   * @returns {maplibregl.Map}
   */
  get map() {
    return this.#map;
  }

  /**
   * Get popup
   * @param {string} id Location id
   * @returns {Popup}
   */
  getPopup(id) {
    if (!(id in this.#popups)) {
      this.#addPopup(id); 
    }
    return this.#popups[id];
  }

  #addPopup(id) {
    console.log("PopupManager.addPopup", id);
    const popup = new Popup(this, id);
    this.#popups[id] = popup;
    return popup;
  }
}