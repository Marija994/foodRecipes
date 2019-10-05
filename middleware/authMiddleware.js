const Recipe        = require('../models/recipe');
const Category      = require('../models/category');
const middlewareObj = {};



middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/user/login");
}

middlewareObj.checkRecipeOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            if(err){
                res.redirect("back");
            } else {
                if(foundRecipe.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCategoryOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Category.findById(req.params.id, function(err, foundCategory){
            if(err){
                res.redirect("back");
            } else {
                if(foundCategory.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;