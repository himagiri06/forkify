import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config';
import { getLocalStorage, setLocalStorage, sortArrayObjectsByProperty } from './helpers';
import { ajax } from './apiRequest';

export const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    sortBy: 'relevance',
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
  error: {
    recipeID: '',
  },
};
const persistBookmarks = () => {
  setLocalStorage('bookmarks', state.bookmarks);
};

const getPersistedBookmarks = () => getLocalStorage('bookmarks', []);

const initState = function () {
  state.bookmarks = getPersistedBookmarks();
};
initState();

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

const addRecipeBookmark = function (recipe) {
  state.bookmarks.push(state.recipe);
  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const removeRecipeBookmark = function (id) {
  state.bookmarks = [...state.bookmarks.filter(recipe => recipe.id !== id)];
  persistBookmarks();
};

export const loadRecipe = async function (id) {
  try {
    const data = await ajax.read(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    state.error.recipeID = id;
    throw error;
  }
};

/**
 * load search results from the api
 * @param {string} query query string to be searched for (e.g. pizza)
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await ajax.read(`${API_URL}?search=${query}&key=${API_KEY}`);
    // To fake the cooking time as the API does not return the cooking time in search results
    let time = 1000000;
    state.search.recipes = data.data.recipes.map(recipe => {
      time--;
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
        cookingTime: recipe.cooking_time ?? time,
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const results =
    state.search.sortBy !== 'relevance'
      ? sortArrayObjectsByProperty(state.search.recipes.slice(), state.search.sortBy)
      : state.search.recipes;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

export const toggleBookmark = function (recipe) {
  // Add to bookmarks array
  if (recipe.bookmarked === true) state.bookmarks.push(recipe);

  // Remove from bookmarks array
  if (recipe.bookmarked === false) {
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === recipe.id);
    state.bookmarks.splice(index, 1);
  }

  // set local storage bookmarks
  setLocalStorage('bookmarks', state.bookmarks);

  // Mark the recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = recipe.bookmarked;
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0]?.trim().startsWith('ingredient') && entry[1])
      .map(ing => {
        const ingArr = ing[1].split(',').map(str => str.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please use the correct format');

        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit || null,
          description: description || null,
        };
      });

    const uploadData = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await ajax.create(`${API_URL}?key=${API_KEY}`, uploadData);
    state.recipe = createRecipeObject(data);
    addRecipeBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export const deleteRecipe = async function (id) {
  try {
    await ajax.delete(`${API_URL}${id}?key=${API_KEY}`);
    removeRecipeBookmark(id);
  } catch (error) {
    throw error;
  }
};

export const getSortedSearchResultsPage = function (sortBy, page) {
  state.search.sortBy = sortBy;
  return getSearchResultsPage(page);
};
