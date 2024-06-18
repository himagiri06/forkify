class SearchView {
  _parentElement = document.querySelector('.search');

  _getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        const query = this._getQuery();
        handler?.(query);

        this._clearInput();
      }.bind(this)
    );
  }
}
export default new SearchView();
