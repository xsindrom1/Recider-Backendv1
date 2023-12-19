const { createRecipe, createMultipleRecipes, getAllRecipes, searchRecipe, getRecipeById } = require('./food.controller');

function setupRoutes(app) {
  app.post('/api/create', createRecipe);
  app.post('/api/createMultiple', createMultipleRecipes);
  app.get('/api/allRecipes', getAllRecipes);
  app.get('/api/searchRecipe/:recipe', searchRecipe);
  app.get('/api/recipe/:id', getRecipeById);
}

module.exports = { setupRoutes };
