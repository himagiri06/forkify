import ContainerView from './containerView';

export class ListView extends ContainerView {
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
