import View from './view';

export class ListView extends View {
  addHandlerClickPreview(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const recipePreview = e.target.closest('.preview');
      if (!recipePreview) return;

      const recipeID = recipePreview.dataset.id;
      const newPath = `/recipes#${recipeID}`;
      history.pushState(null, '', newPath);
      handler?.(recipeID);
    });
  }
}
