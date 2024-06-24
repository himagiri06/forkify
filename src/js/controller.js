import 'core-js';
import 'regenerator-runtime/runtime';

import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateServings,
  toggleBookmark,
  uploadRecipe,
  deleteRecipe,
  removeRecipeBookmark,
  getSortedSearchResultsPage,
} from './model.js';
import { MODAL_CLOSE_SECS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsview from './views/resultsview.js';
import paginationView from './views/paginationView.js';
import resultsControlsView from './views/resultsControlsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

/**
 * Initializes the app - Starting point of the app
 */
function init() {
  bookmarksView.addHandlerWindowLoad(controlBookmarksOnWindowLoad);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerDeleteRecipe(controlRecipeDelete);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipeSubmit);
  resultsControlsView.on('sort', controlSortResults);
}

init();

async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Update results view to mark selected recipe
    resultsview.update(getSearchResultsPage());

    // Rendering Spinner
    recipeView.renderSpinner();

    // Loading recipe
    await loadRecipe(id);

    const { recipe } = state;

    // Redering recipe
    recipeView.render(recipe);

    // update bookmarks view to mark selected recipe
    bookmarksView.update(state.bookmarks);
  } catch (error) {
    recipeView.renderError(error.message);
    removeRecipeBookmark(state.error.recipeID);
    bookmarksView.render(state.bookmarks);
  }
}

async function controlRecipeDelete(id) {
  try {
    recipeView.renderSpinner();
    await deleteRecipe(id);
    recipeView.renderMessage('Recipe has been deleted successfully :)');
    bookmarksView.render(state.bookmarks);
    window.history.back();
  } catch (error) {
    console.error(error);
    recipeView.renderError(error.message);
  }
}

function controlServings(servings) {
  // update servings in state
  updateServings(servings);

  // render recipe with new state
  recipeView.update(state.recipe);
}

async function controlSearchResults(query) {
  try {
    if (!query && state.search.recipes.length) return;

    if (!query)
      return resultsview.renderMessage('Enter a valid search query to display results :)');

    //
    resultsControlsView.render(state.search, { show: false });

    resultsview.renderSpinner();

    // Load search results from API
    await loadSearchResults(query);

    // Render search results on view
    resultsview.render(getSearchResultsPage());

    // Render Pagination buttons on view
    paginationView.render(state.search);

    // Render search results controls view
    resultsControlsView.render(state.search, { show: Boolean(state.search.recipes?.length) });
    //
  } catch (error) {
    console.log(error);
    resultsview.renderError('Something went wrong');
  }
}

function controlPagination(goToPage) {
  resultsview.render(getSearchResultsPage(goToPage));
  paginationView.render(state.search);
}

function controlBookmark(recipe) {
  toggleBookmark(recipe);
  recipeView.update(state.recipe);
  bookmarksView.render(state.bookmarks);
}

function controlBookmarksOnWindowLoad() {
  bookmarksView.render(state.bookmarks);
}

async function controlAddRecipeSubmit(recipe) {
  try {
    // render spinner in recipe view
    addRecipeView.renderSpinner();

    // Upload new recipe
    await uploadRecipe(recipe);

    // Render newly added recipe
    recipeView.render(state.recipe);

    // Success message
    addRecipeView.renderMessage();

    setTimeout(function () {
      addRecipeView.hideWindow();
    }, MODAL_CLOSE_SECS * 1000);

    bookmarksView.render(state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${state.recipe.id}`);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

function controlSortResults(sortBy) {
  console.log(sortBy);
  resultsview.render(getSortedSearchResultsPage(sortBy, state.search.page));
}
