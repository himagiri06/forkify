import icons from 'url:../../img/icons.svg';
import EventEmitter from '../core-modules/eventEmitter';

export default class ContainerView extends EventEmitter {
  /**
   * data used to generate the markup
   */
  _data;

  /**
   * renders or returns markup based on the data and options.
   * @param {*} data data to render the view; if no data required for the view, any falsy value is required in data and validate option should be set to false.
   * @param {*} options options to validate data and to render view. Default is empty object
   * @param {boolean} [options.render] if true, markup is rendered; if false, markup is returned without rendering on the view. Default is true
   * @param {boolean} [options.validate] if true, data undergoes the validation step; if false, data validatiion is skipped. Default is true. If data validation fails, Error is rendered
   * @returns {string} returns markup if render option is set to false
   */
  render(data, options = {}) {
    const { render = true, validate = true, show = true } = options;
    if ((validate && !data) || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = show === true ? this._generateMarkup() : '';

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Generates the markup with the new data, creates a new elements lists from the new markup and compares the new and currenet elements to update the TEXT and ATTRIBUTES of the changed elements
   * @param {Object} data data to update the view
   */
  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const newNode = document.createRange().createContextualFragment(markup);
    const newElements = Array.from(newNode.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  /**
   * Clears the current view and attaches the spinner markup to the view
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the current view and attaches the error markup to the view
   * @param {string} message error message to be displayed on the view; default error message is used if no message passed in
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the current view and attaches the message markup to the view
   * @param {string} message message to be displayed on the view; default message is used if no message passed in
   */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the view and sets the innerHTML to empty string
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
