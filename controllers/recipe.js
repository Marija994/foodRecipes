const mongoose = require('mongoose');

const Recipe   = require('../models/recipe');
const Category = require('../models/category');

exports.getRecipes = (req, res, next) => {
    Recipe.find()
        .then(recipes => {
            res.render('recipes/recipes', {
                recipes: recipes,
                pageTitle: 'All Recipes'
            });
        })
        .catch(err => console.log(err))
}

exports.getRecipe = (req, res, next) => {
    const recId = req.params.id;
    Recipe.findById(recId)
        .then(recipe => {
            res.render('recipes/show', {
                recipe: recipe,
                pageTitle: recipe.name
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.addRecipeForm = (req, res, next) => {
    Category.find()
        .then(category => {
            res.render('recipes/new', {
                pageTitle: 'Add Recipe',
                category: category
            })
        })
        .catch(err => console.log(err));
}

exports.addRecipe = (req, res, next) => {
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const measure = req.body.measure;
    const category = req.body.category;
    const image = req.body.image;
    const video = req.body.video;
    const description = req.body.description;
    let videoCut = null;

    if (video.includes("&")) {
        videoCut = video.substr(0, video.lastIndexOf("&"));
    } else {
        videoCut = video;
    }


    const embedVideo = [videoCut.slice(0, 23) + "/embed/" + videoCut.slice(32)].join();

    const recipe = new Recipe({
        name: name,
        ingredients: ingredients,
        measure: measure,
        category: category,
        image: image,
        video: embedVideo,
        description: description
    });
    recipe.author.id = req.user._id;
    recipe.author.username = req.user.firstName;
    recipe.save()
        .then(recipe => {
            Category.findById(category, (err, foundCat) => {
                if (err) {
                    console.log(err);
                } else {
                    foundCat.recipes.push(recipe);
                    foundCat.save();
                }
            })
                .then(result => {
                    console.log('Created Recipe');
                    res.redirect('/recipes/' + recipe._id);
                })
        })
        .catch(err => console.log(err));
}

exports.editRecipeForm = (req, res, next) => {
    const recId = req.params.id;
    Recipe.findById(recId)
        .then(recipe => {
            Category.find()
                .then(category => {
                    res.render('recipes/edit', {
                        recipe: recipe,
                        pageTitle: recipe.name,
                        category: category
                    })
                })

        })
        .catch(err => console.log(err));
}

exports.editRecipe = (req, res, next) => {
    const recId = req.params.id;
    const updatedName = req.body.name;
    const updatedIngredients = req.body.ingredients;
    const updatedMeasure = req.body.measure;
    const updatedCategory = req.body.category;
    const updatedImage = req.body.image;
    const updatedVideo = req.body.video;
    const updatedDescription = req.body.description;

    Recipe.findById(recId)
        .then(recipe => {
            oldCategory = recipe.category;
            recipe.name = updatedName;
            recipe.ingredients = updatedIngredients;
            recipe.measure = updatedMeasure;
            recipe.category = updatedCategory;
            recipe.image = updatedImage;
            recipe.video = updatedVideo;
            recipe.description = updatedDescription;

            return recipe.save()
                .then(recipe => {
                    if (oldCategory !== updatedCategory) {
                        Category.findById(updatedCategory, (err, foundCat) => {
                            if (err) {
                                console.log(err);
                            } else {
                                foundCat.recipes.push(recipe);
                                foundCat.save();
                            }
                        });
                        Category.findById(oldCategory, (err, foundOldCat) => {
                            if (err) {
                                console.log(err);
                            } else {
                                foundOldCat.recipes.pull(recipe);
                                foundOldCat.save();
                            }
                        });
                    }

                })

                .then(result => {
                    console.log("Updated Recipe!");
                    res.redirect('/recipes/' + recipe._id);
                })

        })
        .catch(err => console.log(err));
}

exports.deleteRecipe = (req, res, next) => {
    const recId = req.params.id;
    Recipe.findById(recId, (err, recipe) => {
        const recCat = recipe.category;
        Category.findById(recCat)
            .then(foundCat => {
                foundCat.recipes.pull(recipe);
                foundCat.save();
            })
    })
        .then(() => {
            Recipe.deleteOne({ _id: recId })
                .then(() => {
                    console.log("Deleted Recipe");
                    res.redirect('/recipes');
                })
        })
        .catch(err => console.log(err))
}