import { ListView } from './listView';
import previewView from './PreviewView';

class Resultsview extends ListView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => previewView.render(result, { render: false }))
      .join('');
  }
}
export default new Resultsview();
