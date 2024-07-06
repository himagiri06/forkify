import ListView from './listView';
import previewView from './PreviewView';

class BookmarksView extends ListView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerWindowLoad(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, { render: false }))
      .join('');
  }
}
export default new BookmarksView();
