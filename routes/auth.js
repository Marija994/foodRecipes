const express = require('express');
const {check} = require('express-validator');

const Category = require('../models/category');
const Recipe   = require('../models/recipe');
const User     = require('../models/user');

const categoryController = require('../controllers/category');
const recipeController   = require('../controllers/recipe');
const userController   = require('../controllers/user');

const authMw = require('../middleware/authMiddleware')



const router = express.Router();

router.put('/recipe/:id', authMw.checkRecipeOwnership, recipeController.editRecipe);

router.delete('/recipe/:id', authMw.checkRecipeOwnership, recipeController.deleteRecipe);

router.post('/recipe', recipeController.addRecipe);

router.put('/category/:id', authMw.checkCategoryOwnership, categoryController.editCategory);

router.delete('/category/:id', authMw.checkCategoryOwnership, categoryController.deleteCategory);

router.post('/category', categoryController.addCategory);

router.get('/category/new', categoryController.addCategoryForm);

router.get('/category/:id/edit', authMw.checkCategoryOwnership, categoryController.editCategoryForm);

router.get('/recipe/new', recipeController.addRecipeForm);

router.get('/recipe/:id/edit', authMw.checkRecipeOwnership, recipeController.editRecipeForm);

router.post('/user/:id/fav', userController.addFavouriteRecipe);

module.exports = router;