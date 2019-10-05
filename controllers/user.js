const express  = require('express');
const mongoose = require('mongoose');
const User     = require('../models/user');
const Recipe   = require('../models/recipe');
const router   = express.Router();

exports.signupForm = (req, res, next) => {
    res.render('user/signup', {
        pageTitle: 'Signup',
        errorMessage: null,
        oldInput: {
            email:"",
            firstName: "",
            lastName: ""
        }
    });
}

exports.loginForm = (req, res, next) => {
    res.render('user/login', {
        pageTitle: 'Login',
    });
}

exports.addFavouriteRecipe = (req, res, next) => {
    user = req.user;
    Recipe.findById(req.params.id)
    .then(result => {
        recipe = result._id;
        user.favouriteRecipes.push(recipe);
        user.save();
        res.redirect('/recipes/'+recipe);
    })
    .catch(err => console.log(err));

}
