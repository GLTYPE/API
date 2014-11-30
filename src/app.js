// Config
var express = require("express"),
bodyParser = require('body-parser'),
// cors = require('cors'),
app = express(),
mongoose = require('mongoose');

// Cors
// app.use(cors());

// Receive post variable
app.use(bodyParser.urlencoded({extended : false }));

// Mongodb config
mongoose.connect('mongodb://localhost/test_in');

// Controllers
Product = require('./controllers/product.js'),
Receipe = require('./controllers/receipe.js');
Ingredient = require('./controllers/ingredient.js');
User = require('./controllers/user.js');

// Routes
app.get('/', function(req, res) { res.end("Welcome to the API"); });

app.get('/search/ingredients/:name/:minCal/:maxCal/:rateMin/:rateMax', Ingredient.getIngredientByCriteria);
app.get('/search/products/:name/:minCal/:maxCal/:rateMin/:rateMax', Product.getProductByCriteria);
app.get('/search/receipes/:name/:minCal/:maxCal/:rateMin/:rateMax', Receipe.getReceipeByCriteria);

app.get('/ingredients', Ingredient.getAllIngredients);
app.get('/ingredients/:id', Ingredient.getIngredientById);
app.get('/ingredients/name/:name', Ingredient.getIngredientByName);
app.get('/ingredients/:id/values', Ingredient.getIngredientValues);

app.get('/products', Product.getAllProduct);
app.get('/products/:id', Product.getProductById);
app.get('/products/name/:name', Product.getProductByName);
app.get('/products/ingredient/:name', Product.getProductByIngredientName);

app.get('/receipes', Receipe.getAllReceipes);
app.get('/receipes/:id', Receipe.getReceipeById);
app.get('/receipes/name/:name', Receipe.getReceipeByName);

app.get('/users', User.getAllUsers);
app.post('/users', User.createUser);
app.get('/users/:id', User.getUserById);
app.put('/users/:id', User.editUser);
app.get('/users/mail/:email', User.getUserByEmail);
app.post('/users/connect', User.connect);

app.listen(4242);
