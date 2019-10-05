const express = require('express');
const passport = require("passport");
const bodyParser = require('body-parser');
const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const userController = require('../controllers/user');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', userController.signupForm);

router.post('/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid Email')
        .custom((value, { req }) => {
            return User.findOne({ username: value })
                .then(userFound => {
                    if (userFound) {
                        return Promise.reject('That Email is already taken');
                    };
                })
        }), check('password')
            .isLength({ min: 6, max: 12 })
            .withMessage('Password must be between 6 and 12 characters'),
    (req, res) => {
        const errors = validationResult(req);
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        if (!errors.isEmpty()) {
            return res.status(422).render('user/signup', {
                pageTitle: 'Signup',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                }
            });
        }

        let newUser = new User({ username: email, firstName: firstName, lastName: lastName });
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                return res.render("user/signup", { pageTitle: 'Sign Up' });
            }
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    });

router.get('/login', userController.loginForm);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
}), (req, res) => { });

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

//addFavouriteRecipe

module.exports = router;
