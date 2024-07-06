import View from './view';

export default class extends View {
  // addHandlerClickPreview(handler) {
  //   this._parentElement.addEventListener('click', function (e) {
  //     e.preventDefault();
  //     const recipePreview = e.target.closest('.preview');
  //     if (!recipePreview) return;

  //     const recipeID = recipePreview.dataset.id;
  //     // const newPath = `/recipes#${recipeID}`;
  //     // history.pushState(null, '', newPath);
  //     handler?.(recipeID);
  //   });
  // }

  removeActive() {
    this._parentElement
      .querySelectorAll('.preview__link--active')
      .forEach(el => el.classList.remove('preview__link--active'));
  }
}
