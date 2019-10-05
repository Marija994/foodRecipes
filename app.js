const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoose = require('mongoose');
const authMw = require('./middleware/authMiddleware');

const dburl = process.env.DATABASEURL || "mongodb+srv://krofna:krofna@foodrecipes-qtkfj.mongodb.net/foodrecipes?retryWrites=true&w=majority";

const methodOverride = require('method-override');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'views');
mongoose.set('useCreateIndex', true);

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'Some Secret Secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const recipeRoutes = require('./routes/recipe');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/user', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/category', categoryRoutes);
app.use('/auth', authMw.isLoggedIn, authRoutes);

app.get('/', (req, res) => {
    res.redirect('/category')
})

mongoose
    .connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        const port = process.env.PORT || 3000;
        const ip = process.env.IP || "127.0.0.1";
        app.listen(port, () => {
            console.log("Server is up on port: " + port + ", IP: " + ip);
        });
    })
    .catch(err => console.log(err));