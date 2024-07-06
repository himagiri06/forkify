import View from './view';
import icons from 'url:../../img/icons.svg';

class ModalView extends View {
  _parentElement = document.querySelector('.modal');
  _overlay = document.querySelector('.overlay');
  _body = document.querySelector('body');
  _title;
  _content;
  _okText;
  _cancelText;
  _type;

  constructor() {
    super();

    this._title = 'Title of the modal window';
    this._content = 'This is the content of the modal window body';
    this._okText = 'Ok';
    this._cancelText = 'Cancel';
    this._type = 'alert';

    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.modal__btn');
        if (!btn) return;

        const okBtn = btn.classList.contains('modal__btn--ok');
        const cancelBtn = btn.classList.contains('modal__btn--ok');
        if (okBtn) this._data.okHandler?.();
        if (cancelBtn) this._data.cancelHandler?.();
        this._close();
      }.bind(this)
    );

    this._overlay.addEventListener(
      'click',
      function (e) {
        if (!this._data.disableCancel) {
          this._close();
          this._data.cancelHandler?.();
        }
      }.bind(this)
    );
  }

  /**
   * Overrides the render method in parent class
   * @param {*} data data object {title, content, okText, cancelText, okHandler, cancelHandler} to render the modal view; if no data passed in, defaults will be applied
   */
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._show();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _show() {
    this._overlay.classList.remove('hidden');
    this._parentElement.classList.remove('hidden');
    this._body.classList.add('overflow--hidden');
  }

  _close() {
    this._overlay.classList.add('hidden');
    this._parentElement.classList.add('hidden');
    this._body.classList.remove('overflow--hidden');
  }

  renderSpinner(data) {
    this._data = data;

    const markup = `
      <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._show();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    const {
      title = this._title,
      content = this._content,
      okText = this._okText,
      cancelText = this._cancelText,
      type = this._type,
    } = this._data;

    return `
      <h3>${title}</h3>
      <div class="horinzontal--ruler"></div>
      <p>${content}</p>
      <div class="modal__btn--group">
        ${
          type === 'confirmation'
            ? `<button class="modal__btn modal__btn--cancel">${cancelText}</button>`
            : ''
        }
        <button class="modal__btn modal__btn--ok">${okText}</button>
      </div>
    `;
  }
}

export default new ModalView();
