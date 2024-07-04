import ContainerView from './containerView';

class PageNotFoundView extends ContainerView {
  _parentElement = document.querySelector('.main');
  _errorMessage =
    'Page not found! Try searching a different recipe or enter the correct url.';
}

export default new PageNotFoundView();
