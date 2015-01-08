// Config
var express = require("express"),
bodyParser = require('body-parser'),
app = express(),
mongoose = require('mongoose'),
cors = require('cors');

app.use(cors());

// Receive post variable
app.use(bodyParser.json());

// Mongodb config
mongoose.connect('mongodb://localhost/dev_nourriture');

// Controllers
Product = require('./controllers/product.js'),
Receipe = require('./controllers/receipe.js');
Ingredient = require('./controllers/ingredient.js');
User = require('./controllers/user.js');
Moment = require('./controllers/moment.js');
Comment = require('./controllers/comment.js');

// Routes
app.get('/', function(req, res) { res.end("Welcome to the API"); });

app.get('/search/ingredients/:name/:minCal/:maxCal/:rateMin/:rateMax', Ingredient.getIngredientByCriteria);
app.get('/search/products/:name/:minCal/:maxCal/:rateMin/:rateMax', Product.getProductByCriteria);
app.get('/search/receipes/:name/:minCal/:maxCal/:rateMin/:rateMax', Receipe.getReceipeByCriteria);

app.post('/ingredients', Ingredient.createIngredient);
app.get('/ingredients', Ingredient.getAllIngredients);
app.get('/ingredients/:id', Ingredient.getIngredientById);
app.get('/ingredients/name/:name', Ingredient.getIngredientByName);
app.get('/ingredients/:id/values', Ingredient.getIngredientValues);
app.put('/ingredients/:id', Ingredient.editIngredient);
app.delete('/ingredients/:id', Ingredient.removeIngredient);

app.post('/products', Product.createProduct);
app.get('/products', Product.getAllProduct);
app.get('/products/:id', Product.getProductById);
app.get('/products/name/:name', Product.getProductByName);
app.get('/products/ingredient/:name', Product.getProductByIngredientName);
app.put('/products/:id', Product.editProduct);
app.delete('/products/:id', Product.removeProduct);

app.post('/receipes', Receipe.createReceipe);
app.get('/receipes', Receipe.getAllReceipes);
app.get('/receipes/:id', Receipe.getReceipeById);
app.get('/receipes/name/:name', Receipe.getReceipeByName);
app.put('/receipes/:id', Receipe.editReceipe);
app.delete('/receipes/:id', Receipe.removeReceipe);

app.post('/moments', Moment.createMoment);
app.get('/moments', Moment.getAllMoments);
app.get('/moments/:id', Moment.getMomentById);
app.get('/moments/owner/:id', Moment.getMomentByOwnerId);
app.get('/moments/target/:id', Moment.getMomentByTargetId);
app.put('/moments/:id', Moment.editMoment);
app.delete('/moments/:id', Moment.removeMoment);

app.post('/comments', Comment.createComment);
app.get('/comments', Comment.getAllComments);
app.get('/comments/:id', Comment.getCommentById);
app.get('/comments/owner/:id/type/:type', Comment.getCommentByOwnerId);
app.get('/comments/target/:id/type/:type', Comment.getCommentByTargetId);
app.put('/comments/:id', Comment.editComment);
app.delete('/comments/:id', Comment.removeComment);

app.post('/users', User.createUser);
//app.get('/users', User.getAllUsers);
app.get('/users/token/:token', User.getActualUser);
app.get('/users/:id', User.getUserById);
app.get('/users/mail/:email', User.getUserByEmail);
app.get('/users/name/:name', User.getUserByName);
app.put('/users/token/:token', User.editActualUser);
app.put('/users/:id', User.editUser);
app.post('/users/connect', User.connect);
app.post('/users/disconnect', User.disconnect);

app.listen(4242);
