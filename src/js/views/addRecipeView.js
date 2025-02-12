import View from './view';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.main');
  _form = document.querySelector('.upload');
  // _window = document.querySelector('.add-recipe-window');
  // _overlay = document.querySelector('.overlay');
  // _btnOpen = document.querySelector('.nav__btn--add-recipe');
  // _btnClose = document.querySelector('.btn--close-modal');
  _numIngredients = 6;

  _message = 'Recipe has been uploaded successfully';
  _errorMessage = 'Something went wrong';

  constructor() {
    super();
    this.render(null, true, false);

    this._parentElement.addEventListener(
      'click',
      function (e) {
        const btnAddIngreients = e.target.closest('.btn--add-ingredients');
        if (!btnAddIngreients) return;

        this._addNewIngredientRow();
      }.bind(this)
    );
  }

  _disable() {
    this._parentElement
      .querySelectorAll('input')
      .forEach(el => (el.disabled = true));

    this._parentElement
      .querySelectorAll('button')
      .forEach(el => (el.disabled = true));
  }

  _showValidationError() {
    const errorEl = this._parentElement.querySelector('.upload__error');
    if (errorEl) errorEl.remove();

    const uploadBtn = this._parentElement.querySelector('.upload__btn');
    const markup = this._generateValidationErrorMarkup();
    uploadBtn.insertAdjacentHTML('beforebegin', markup);
  }

  _validateIngredientsFormat(formDataArr) {
    return formDataArr
      .filter(
        ([key, value]) => key.startsWith('ingredient') && value?.trim() !== ''
      )
      .map(([_, value]) => value)
      .some(ing => ing.split(',').length !== 3);
  }

  _getIngredientsArray(obj) {
    return Array.from({ length: this._numIngredients }, (_, i) => ({
      quantity: +obj[`ingredient[${i}][quantity]`].trim() || null,
      unit: obj[`ingredient[${i}][unit]`].trim() || null,
      description: obj[`ingredient[${i}][description]`].trim() || null,
    }));
  }

  _validateIngredients(ingredients) {
    const validationResult = { pass: true };

    for (const [index, ingredient] of ingredients.entries()) {
      if (ingredient.unit && !ingredient.quantity) {
        validationResult.pass = false;
        validationResult.index = index;
        validationResult.field = 'quantity';
        validationResult.message = 'unit is specified without quantity';
        break;
      }

      if (ingredient.quantity && !ingredient.description) {
        validationResult.pass = false;
        validationResult.index = index;
        validationResult.field = 'description';
        validationResult.message = 'missing escription of ingredient';
        break;
      }
    }
    return validationResult;
  }

  // Final form data object construction
  _constructFormDataJSON(formObject, ingredients) {
    return {
      ...Object.fromEntries(
        Object.entries(formObject).filter(
          ([key, value]) => !key.startsWith('ingredient')
        )
      ),
      ingredients,
    };
  }

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        const form = document.querySelector('.upload');

        form
          .querySelectorAll('.error')
          .forEach(el => el.classList.remove('error'));

        const formEntries = [...new FormData(form)];
        const formObject = Object.fromEntries(formEntries);
        const ingredientEntries = this._getIngredientsArray(formObject);

        const { pass, index, field, message } =
          this._validateIngredients(ingredientEntries);

        if (!pass) {
          const errorEl = this._parentElement.querySelector(
            `input[name='ingredient[${index}][${field}]']`
          );
          errorEl?.classList.add('error');

          this._errorMessage = `Invalid entry: ${message}`;
          return this._showValidationError();
        }

        const ingredients = ingredientEntries.filter(
          ing => ing.quantity || ing.unit || ing.description
        );

        if (ingredients.length === 0) {
          this._errorMessage = 'Ingredients cannot be empty';
          return this._showValidationError();
        }

        const data = this._constructFormDataJSON(formObject, ingredients);

        this._disable();
        handler?.(data);
      }.bind(this)
    );
  }

  setFocus(inputName) {
    const inputEl = this._parentElement.querySelector(
      `input[name="${inputName}"]`
    );
    if (inputEl) {
      inputEl.focus();
      const length = inputEl.value.length;
      inputEl.setSelectionRange(length, length);
    }
  }

  _addNewIngredientRow() {
    const ingredientRows =
      this._parentElement.querySelectorAll('.ingredient__row');

    const numIngredients = Array.from(ingredientRows).length;

    const newIngredientRowMarkup =
      this._generateIngredientGroupMarkup(numIngredients);

    const ingredientsEl = this._parentElement.querySelector('.ingredients');
    ingredientsEl.insertAdjacentHTML('beforeend', newIngredientRowMarkup);
    this._numIngredients++;
  }

  _generateMarkup() {
    return `
      <div class="add-recipe">
        <h2 class="page-title">ADD RECIPE</h2>
        <form class="upload">
          <div class="upload__column">
            <h3 class="upload__heading">Recipe data</h3>
            <label>Title</label>
            <input value="TEST 23" required name="title" type="text" />
            <label>URL</label>
            <input value="TEST 23" required name="sourceUrl" type="text" />
            <label>Image URL</label>
            <input value="TEST 23" required name="image" type="text" />
            <label>Publisher</label>
            <input value="TEST 23" required name="publisher" type="text" />
            <label>Prep time</label>
            <input value="23" required name="cookingTime" type="number" />
            <label>Servings</label>
            <input value="23" required name="servings" type="number" />
          </div>

          <div class="upload__column ingredients">
            <div class="upload__heading--row">
              <h3 class="upload__heading">Ingredients</h3>
              <button type="button" class="btn--tiny btn--add-ingredients">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
            ${Array.from({ length: this._numIngredients }, (_, i) =>
              this._generateIngredientGroupMarkup(i)
            ).join('')}
          </div>
          <button type="submit" class="btn upload__btn">
            <svg>
              <use href="${icons}#icon-upload-cloud"></use>
            </svg>
            <span>Upload</span>
          </button>
        </form>
      </div>
    `;
  }

  _gnereateIngredientsMarkup() {
    return `
      ${Array.from({ length: this._numIngredients }, (_, i) =>
        this._generateIngredientGroupMarkup(i)
      ).join('')}
    `;
  }

  _generateIngredientGroupMarkup(id) {
    return `
      <div class="ingredient__row">
        <label>${id + 1}</label>
        <input
          type="text"
          name="ingredient[${id}][quantity]"
          placeholder="Quantity"
        />
        <input
          type="text"
          name="ingredient[${id}][unit]"
          placeholder="Unit"
        />
        <input
          type="text"
          name="ingredient[${id}][description]"
          placeholder="Description"
        />
      </div>
    `;
  }

  _generateValidationErrorMarkup(errorMessage = this._errorMessage) {
    return `
      <div class="upload__error">
        <p class="upload__error--message">${errorMessage}</p>
      </div>
    `;
  }
}

export default new AddRecipeView();
