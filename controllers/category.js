const mongoose = require('mongoose');
const Category = require('../models/category');
const Recipe   = require('../models/recipe');

exports.getCategorys = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render('index', {
                categories: categories,
                pageTitle: 'Food Recipes'
            });
        })
        .catch(err => console.log(err))
}


exports.getIndex = (req, res, next) => {
    res.redirect('/category');
}

exports.getCategory = (req, res, next) => {
    const catId = req.params.id;
    Category.findById(catId)
        .then(category => {
            Recipe.find({ category: catId })
                .then(result => {
                    res.render('categories/show', {
                        category: category,
                        recipe: result,
                        pageTitle: category.name
                    });
                })

        })
        .catch(err => {
            console.log(err);
        });
}

exports.addCategoryForm = (req, res, next) => {
    res.render('categories/new', {
        pageTitle: 'Add Category'
    });
}

exports.addCategory = (req, res, next) => {
    const name = req.body.name;
    const image = req.body.image;
    const category = new Category({
        name: name,
        image: image
    });
    category.author.id = req.user._id;
    category.author.username = req.user.firstName;
    category.save()
        .then(result => {
            console.log('Created Category');
            res.redirect('/category');
        })
        .catch(err => console.log(err));
}

exports.editCategoryForm = (req, res, next) => {

    const catId = req.params.id;
    Category.findById(catId)
        .then(category => {
            res.render('categories/edit', {
                category: category,
                pageTitle: category.name
            })
        })
        .catch(err => console.log(err));
}

exports.editCategory = (req, res, next) => {
    const catId = req.params.id;
    const updatedName = req.body.name;
    const updatedImage = req.body.image;
    Category.findById(catId)
        .then(category => {
            category.name = updatedName;
            category.image = updatedImage;
            return category.save()
                .then(result => {
                    console.log("Updated Category!");
                    res.redirect('/category/' + catId);
                })
        })
        .catch(err => console.log(err));
}

exports.deleteCategory = (req, res, next) => {
    const catId = req.params.id;
    Category.deleteOne({ _id: catId })
        .then(() => {
            console.log("Deleted Category");
            res.redirect('/category');
        })
        .catch(err => console.log(err))
}

