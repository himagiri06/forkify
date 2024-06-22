import ContainerView from './containerView';
import icons from 'url:../../img/icons.svg';

class PaginationView extends ContainerView {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler?.(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;

    const numPages = Math.ceil(this._data.recipes.length / this._data.resultsPerPage);

    //  Page 1 - more results available
    if (currPage === 1 && numPages > 1)
      return `
        ${this.#generateMarkupButton('prev', currPage + 1, { disabled: true })}
        ${this.#generatePageNumber(currPage)}
        ${this.#generateMarkupButton('next', currPage + 1)}
      `;

    // Last Page
    if (currPage === numPages && numPages > 1)
      return `
    ${this.#generateMarkupButton('prev', currPage - 1)}
    ${this.#generatePageNumber(currPage)}
    ${this.#generateMarkupButton('next', currPage - 1, { disabled: true })}
    `;

    // Between first and last pages
    if (currPage > 1 && this._data.page < numPages)
      return `
        ${this.#generateMarkupButton('prev', currPage - 1)}
        ${this.#generatePageNumber(currPage)}
        ${this.#generateMarkupButton('next', currPage + 1)}
      `;

    // Page 1 - No more results
    return '';
  }

  #generateMarkupButton(type = 'next', pageNum, options = {}) {
    const { disabled = false } = options;
    if (type === 'prev')
      return `
      <button class="btn--inline pagination__btn--prev ${disabled ? 'btn--disabled' : ''}" data-goto="${pageNum}">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Prev</span>
        </button>
    `;

    return `
      <button class="btn--inline pagination__btn--next ${disabled ? 'btn--disabled' : ''}" data-goto="${pageNum}">
            <span>Next</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }

  #generatePageNumber(pageNum) {
    return `<span class="pagination__details">${pageNum}</span>`;
  }
  // #generateMarkupButton(type = 'next', pageNum) {
  //   if (type === 'prev')
  //     return `
  //     <button class="btn--inline pagination__btn--prev" data-goto="${pageNum}">
  //           <svg class="search__icon">
  //             <use href="${icons}#icon-arrow-left"></use>
  //           </svg>
  //           <span>Page ${pageNum}</span>
  //       </button>
  //   `;

  //   return `
  //     <button class="btn--inline pagination__btn--next" data-goto="${pageNum}">
  //           <span>Page ${pageNum}</span>
  //           <svg class="search__icon">
  //             <use href="${icons}#icon-arrow-right"></use>
  //           </svg>
  //       </button>
  //   `;
  // }
}

export default new PaginationView();
