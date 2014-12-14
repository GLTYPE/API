// INGREDIENT CONTROLLER

var Ingredient = require('../models/ingredient.js').Ingredient,
    AccessToken = require('../auth/ControllerAccessToken.js');


exports.createIngredient = function createIngredient(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        if (!req.body.name || req.body.name.length == 0)
            return res.status(400).end("name missing");
        Ingredient({
            name: req.body.name,
            picture: req.body.picture ? req.body.picture : "",
            description: req.body.description ? req.body.description : "",
            faith: req.body.faith ? req.body.faith : "",
            values: req.body.values ? req.body.values : 0,
            owner: user._id
        }).save(function (err, ing) {
            if (err) {
                if (err.toString().search("to be unique") != -1) return res.status(400).end("This name already exists");
                console.log(err);
                return res.status(500).end("Internal error");
            }
            res.status(201).json(ing);
        });
    });
}

exports.getAllIngredients = function GetAllIngredients(req, res) {
    Ingredient.find(function (err, ingredient) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(ingredient);
    });
}

exports.getIngredientById = function GetIngredientById(req, res) {
    Ingredient.findById(req.params.id, function (err, ingredient) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(ingredient);
    });
}

exports.getIngredientByName = function GetIngredientByName(req, res) {
    Ingredient.find({name: new RegExp(req.params.name, "i")}, function (err, ingredient) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(ingredient);
    });
}

exports.getIngredientValues = function GetIngredientValues(req, res) {
    Ingredient.findById(req.params.id, function (err, ingredient) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(ingredient.values.toString());
    });
}

exports.getIngredientByCriteria = function getIngredientByCriteria(req, res) {
    Ingredient.find({
        name: new RegExp(req.params.name, "i"),
        values: { $gte: req.params.minCal, $lte: req.params.maxCal}
        // ,rate: { $gte: req.params.rateMin, $lte: req.params.rateMax},
    }, function (err, ingredient) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send(ingredient);
    });
}

exports.editIngredient = function editIngredient(req, res) {
    if (!req.body.name || req.body.name.length == 0)
        return res.status(400).end("name missing");
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        Ingredient.findById(req.params.id, function (err, ing) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            ing.name = req.body.name;
            ing.picture = req.body.picture ? req.body.picture : ing.picture;
            ing.description = req.body.description ? req.body.description : ing.description;
            ing.faith = req.body.faith ? req.body.faith: ing.faith;
            ing.values = req.body.values ? req.body.values : ing.values;
            ing.save(function (err, ing) {
                if (err) {
                    if (err.errors.name.message) return res.status(400).end("This name already exists")
                    console.log(err);
                    res.status(400).send("Internal error");
                }
                res.status(200).json(ing);
            });
        });
    });
}

exports.removeIngredient = function removeIngredient(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        Ingredient.remove({_id: req.body.id}, function (err) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            res.status(204).end();
        });
    });
}
