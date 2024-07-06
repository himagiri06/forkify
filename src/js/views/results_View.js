import ListView from './listView';
import previewView from './PreviewView';

class ResultsView extends ListView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results to display :)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => previewView.render(result, { render: false }))
      .join('');
  }
}
export default new ResultsView();
