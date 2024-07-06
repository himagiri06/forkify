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
} from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import resultsControlsView from './views/resultsControlsView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import messageView from './views/messageView';
import pageNotFoundView from './views/pageNotFoundView';
import { wait } from './helpers.js';

// if (module.hot) {
//   module.hot.accept();
// }

/**
 * Initializes the app - Starting point of the app
 */

function init() {
  bookmarksView.addHandlerWindowLoad(controlBookmarksOnWindowLoad);
  recipeView.addHandlerDeleteRecipe(controlRecipeDelete);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerSubmit(controlAddRecipeSubmit);
  resultsControlsView.on('sort', controlSortResults);
  document.body.addEventListener('click', controlLinkClick);
  window.addEventListener('popstate', router);
  router();
}

init();

function controlLinkClick(e) {
  const routeLink = e.target.closest('[data-link]');

  if (!routeLink) return;

  e.preventDefault();

  const href = routeLink.href || routeLink.querySelector('[href]')?.href;

  if (!href) return;

  if (location.href === href) return;

  navigateTo(href);
}

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

function router() {
  const routes = [
    {
      path: '/',
      controller: controlHome,
    },
    {
      path: '/recipes',
      controller: controlRecipe,
    },
    {
      path: '/add-recipe',
      controller: controlAddRecipe,
    },
    {
      path: '*',
      controller: controlPageNotFound,
    },
  ];

  const matchedRoutes = routes.map(route => ({
    route,
    isMatch: route.path === location.pathname,
  }));

  let match = matchedRoutes.find(matchedRoute => matchedRoute.isMatch);

  if (!match) {
    match = { route: routes.at(-1), isMatch: true };
  }

  match.route.controller?.();
}

function controlHome() {
  if (!state.search.recipes.length) return messageView.renderMessage();

  bookmarksView.removeActive();
  resultsView.removeActive();
  messageView.renderMessage('Click on any recipe in the search results');
}

async function controlRecipe(id) {
  const recipeId = location.hash?.slice(1);

  try {
    // Update results view to mark selected recipe
    resultsView.render(getSearchResultsPage());

    // Rendering Spinner
    recipeView.renderSpinner();

    // Loading recipe
    await loadRecipe(recipeId);

    const { recipe } = state;

    // Redering recipe
    recipeView.render(recipe);

    // update bookmarks view to mark selected recipe
    bookmarksView.render(state.bookmarks);
  } catch (err) {
    recipeView.renderError(err.message);
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
  } catch (error) {
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
      return resultsView.renderMessage(
        'Enter a valid search query to display results :)'
      );

    //
    resultsControlsView.render(state.search, { show: false });

    resultsView.renderSpinner();

    // Load search results from API
    await loadSearchResults(query);

    // Render search results on view
    resultsView.render(getSearchResultsPage());

    // Render Pagination buttons on view
    paginationView.render(state.search);

    // Render search results controls view
    resultsControlsView.render(state.search, {
      show: Boolean(state.search.recipes?.length),
    });
    //
  } catch (error) {
    resultsView.renderError('Something went wrong');
  }
}

function controlPagination(goToPage) {
  resultsView.render(getSearchResultsPage(goToPage));
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

function controlAddRecipe() {
  bookmarksView.removeActive();
  resultsView.removeActive();
  addRecipeView.render(null, { validate: false });
  addRecipeView.setFocus('title');
}

async function controlAddRecipeSubmit(recipe) {
  try {
    // render spinner in recipe view
    addRecipeView.renderSpinner();

    // Upload new recipe
    await uploadRecipe(recipe);

    // Render newly added recipe
    // recipeView.render(state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // setTimeout(function () {
    //   addRecipeView.hideWindow();
    // }, MODAL_CLOSE_SECS * 1000);

    bookmarksView.render(state.bookmarks);

    // Navigate to new recipe page after 2 seconds
    await wait(2).then(() => navigateTo(`/recipes#${state.recipe.id}`));
    // Change ID in url
    // window.history.pushState(null, '', `#${state.recipe.id}`);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

function controlSortResults(sortBy) {
  resultsView.render(getSearchResultsPage(state.search.page, sortBy));
}

function controlPageNotFound() {
  pageNotFoundView.renderError();
}
