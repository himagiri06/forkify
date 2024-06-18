class GlobalView {
  _parentElement = document.body;

  addHandlerKeydown(key, handler) {
    this._parentElement.addEventListener('keydown', function (e) {
      console.log(e.target.key);
    });
  }
}

export default new GlobalView();
