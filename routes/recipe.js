const express = require('express');

const Recipe = require('../models/recipe');
const User   = require('../models/user');

const recipeController = require('../controllers/recipe');

const router = express.Router();

router.get('/', recipeController.getRecipes);

router.get('/:id', recipeController.getRecipe);

module.exports = router;