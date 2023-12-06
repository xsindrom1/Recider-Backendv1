const { createRecipe, createMultipleRecipes, getAllRecipes, searchRecipe, getRecipeById } = require('./handler');

function setupRoutes(app) {
  app.post('/api/create', createRecipe);
  app.post('/api/createMultiple', createMultipleRecipes);
  app.get('/api/allRecipes', getAllRecipes);
  app.get('/api/searchRecipe/:recipeLower', searchRecipe);
  app.get('/api/recipe/:id', getRecipeById);
}

module.exports = { setupRoutes };
