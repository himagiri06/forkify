import ContainerView from './containerView';

class ResultsControlsView extends ContainerView {
  _parentElement = document.querySelector('.results-controls');

  constructor() {
    super();
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btn = e.target.closest('.control__sort');
        if (!btn) return;
        const sortBy = btn.dataset.sortBy;
        this.emit('sort', sortBy);
      }.bind(this)
    );
  }

  _generateMarkup() {
    return `
      <div class="container__controls">
        <div class="control__btn">Sort by</div>
        <ul class="control__content">
          <li class="control__sort" data-sort-by="relevance">Releavance</li>
          <li class="control__sort" data-sort-by="cookingTime">Preparation Time</li>
          <li class="control__sort" data-sort-by="ingredients">Ingredients</li>
        </ul>
      </div>
    `;
  }
  hide() {
    this._parentElement.classList.add('hidden');
  }
}

export default new ResultsControlsView();
