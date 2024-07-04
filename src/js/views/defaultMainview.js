import ContainerView from './containerView';

class DefaultMainView extends ContainerView {
  _parentElement = document.querySelector('.main');
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';

  // _generateMarkup() {
  //   throw new Error(
  //     'Cannot call render() method on this view, please showMessage() method instead'
  //   );
  // }
}

export default new DefaultMainView();
