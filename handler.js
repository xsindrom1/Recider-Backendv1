const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createRecipe(req, res) {
  try {
    // Handle create recipe logic
    const keywords = recipe.recipe.toLowerCase().split(' ');
    const ingredientArray = req.body.ingredient.split(',').map((ingredient) => ingredient.trim());
    const stepArray = req.body.step.split(';').map((step) => step.trim());

    await db.collection('reciderRecipe').doc(`/${Date.now()}/`).create({
      id: Date.now(),
      recipe: req.body.recipe,
      recipeLower: req.body.recipe.toLowerCase(),
      keywords: keywords,
      image: req.body.image,
      ingredient: ingredientArray,
      step: stepArray,
    });

    return res.status(200).send({ status: 'Success', msg: 'Data Saved' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'Failed', msg: error });
  }
}

async function createMultipleRecipes(req, res) {
  try {
    // Handle create multiple recipes logic
    const recipes = req.body.recipes;

    for (const recipe of recipes) {
      const keywords = recipe.recipe.toLowerCase().split(' ');
      const ingredientArray = recipe.ingredient.split(';').map((ingredient) => ingredient.trim());
      const stepArray = recipe.step.split(';').map((step) => step.trim());

      await db.collection('reciderRecipe').doc(`/${Date.now()}/`).create({
        id: Date.now(),
        recipe: recipe.recipe,
        recipeLower: recipe.recipe.toLowerCase(),
        keywords: keywords,
        image: recipe.image,
        ingredient: ingredientArray,
        step: stepArray,
      });
    }

    return res.status(200).send({ status: 'Success', msg: 'Recipes Saved' });
  } catch (error) {
    console.log('Error in createMultiple route:', error);
    res.status(500).send({ status: 'Failed', msg: error });
  }
}

async function getAllRecipes(req, res) {
  try {
    // Handle get all recipes logic
    const recipesRef = db.collection('reciderRecipe');
    const querySnapshot = await recipesRef.get();

    const allRecipes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      recipe: doc.data().recipe,
      image: doc.data().image,
    }));

    return res.status(200).json({ status: 'Success', data: allRecipes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'Failed', msg: error.message });
  }
}

async function searchRecipe(req, res) {
  try {
    const searchTerms = req.params.recipeLower.split(" ");

    const keywordQueries = searchTerms.map((term) => {
      return db.collection("reciderRecipe").where("keywords", "array-contains", term.toLowerCase()).get();
    });

    const results = await Promise.all(keywordQueries);

    const mergedResults = results.flatMap((querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        recipe: doc.data().recipe,
        image: doc.data().image,
        // Add other fields as needed
      }));
    });

    if (mergedResults.length > 0) {
      return res.status(200).json({
        status: "Success",
        data: mergedResults,
      });
    } else {
      return res.status(404).json({
        status: "Failed",
        msg: "No recipe details match the provided search terms.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      msg: error.message,
    });
  }
}



async function getRecipeById(req, res) {
  try {
    const reqDoc = db.collection('reciderRecipe').doc(req.params.id);
    const reciderRecipe = await reqDoc.get();
    const response = reciderRecipe.data();

    return res.status(200).send({ status: 'Success', data: response });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 'Failed', msg: error });
  }
}

module.exports = {
  createRecipe,
  createMultipleRecipes,
  getAllRecipes,
  searchRecipe,
  getRecipeById,
};
