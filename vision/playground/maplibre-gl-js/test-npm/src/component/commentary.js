// Commentary component

export class Commentary {
  #elems;
  #elemIds;
  #index;
  #activeId;
  #prevButtons;
  #prevLabels;
  #nextButtons;
  #nextLabels;
  #callback

  /**
   * Construct a Commentary object
   * @param {Object}   args          The arguments
   * @param {function} args.callback Callback function
   */
  constructor(args) {
    this.#elems = document.querySelectorAll(".commentary");
    this.#elems.forEach(el => el.style = 'display: none;');
    this.#elemIds = Array.from(this.#elems).map(el => el.id);

    this.#index = 0;
    this.#activeId = this.#elemIds[this.#index];

    this.#prevButtons = document.querySelectorAll('.prev-button');
    this.#prevLabels = document.querySelectorAll('.prev-label');
    this.#nextButtons = document.querySelectorAll('.next-button');
    this.#nextLabels = document.querySelectorAll('.next-label');

    this.#prevButtons.forEach(el => el.addEventListener('click', (e) => this.#onPrev()));
    this.#nextButtons.forEach(el => el.addEventListener('click', (e) => this.#onNext()));

    this.#callback = args.callback;
  }

  /**
   * Get commentary identifiers
   */
  get ids() {
    return this.#elemIds;
  }

  /**
   * Set active identifier
   * @param {string} id Identifier 
   */
  setIndex(index) {
    const oldId = this.#activeId;
    this.#index = index;
    this.#activeId = this.#elemIds[this.#index];

    console.debug(`Commentary.setIndex ${index} ${this.#activeId}`);

    document.querySelector('#' + oldId).style.display = 'none';
    document.querySelector('#' + this.#activeId).style.display = '';

    if (this.#index > 0) {
      this.#prevButtons.forEach(el => el.style.display = '');
      this.#prevLabels.forEach(el => el.textContent = document.querySelector(
        '#' + this.#elemIds[this.#index - 1]).querySelector('h1').textContent);
    } else {
      this.#prevButtons.forEach(el => el.style.display = 'none');
    }

    if (this.#index + 1 < this.#elemIds.length) {
      this.#nextButtons.forEach(el => el.style.display = '');
      this.#nextLabels.forEach(el => el.textContent = document.querySelector(
        '#' + this.#elemIds[this.#index + 1]).querySelector('h1').textContent);
    } else {
      this.#nextButtons.forEach(el => el.style.display = 'none');
    }

    if (this.#callback) {
      this.#callback(oldId, this.#activeId);
    }
  }

  #onPrev() {
    this.setIndex((this.#index - 1 + this.#elemIds.length) % this.#elemIds.length);
  }

  #onNext() {
    this.setIndex((this.#index + 1) % this.#elemIds.length);
  }
}