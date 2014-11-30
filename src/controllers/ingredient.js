// INGREDIENT CONTROLLER

var mongoose = require("mongoose"),
Ingredient = require('../models/ingredient.js').Ingredient;

exports.createIngredient = function createIngredient(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role == 1 || role == 2) {
	return res.status(401).end();
    }
    if (!req.body.name || req.body.name.length == 0)
	return res.status(400).end("Ingredient name missing.");
    var ing = Ingredient({
	name: req.body.name ? req.body.name : "",
	picture: req.body.picture ? req.body.picture : "",
	description: req.body.description ? req.body.description : "",
	faith: req.body.faith ? req.body.faith : "",
	value: req.body.value ? req.body.value : ""
    });
    return ing.save(function(err) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(201).json(ing);
    });
}

exports.getAllIngredients = function GetAllIngredients(req, res) {
    return Ingredient.find(function(err, ingredient) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	return res.status(200).send(ingredient);
    });
}

exports.getIngredientById = function GetIngredientById(req, res) {
    return Ingredient.findById(req.params.id, function(err, ingredient) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	return res.status(200).send(ingredient);
    });
}

exports.getIngredientByName = function GetIngredientByName(req, res) {
    return Ingredient.find({name: new RegExp(req.params.name, "i")}, function(err, ingredient) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	return res.status(200).send(ingredient);
    });
}

exports.getIngredientValues = function GetIngredientValues(req, res) {
    return Ingredient.findById(req.params.id, function(err, ingredient) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	return res.status(200).send(ingredient.value.toString());
    });
}

exports.getIngredientByCriteria = function getIngredientByCriteria(req, res) {
    return Ingredient.find({
	name: new RegExp(req.params.name, "i"),
	values: { $gte: req.params.minCal, $lte: req.params.maxCal}
	// ,rate: { $gte: req.params.rateMin, $lte: req.params.rateMax},
    }, function(err, ingredient) {
	if (err)
	    return res.status(400).send(err);
	return res.status(200).send(ingredient);
    });
}

exports.editIngredient = function editIngredient(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role == 1 || role == 2) {
	return res.status(401).end();
    }
    return Ingredient.findById(req.params.id, function(err, ing) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	else {
	    ing.name = req.body.name;
	    ing.picture = req.body.picture;
	    ing.description = req.body.description;
	    ing.faith = req.body.faith;
	    ing.values = req.body.values;
	    return ing.save(function(err) {
		if (err) {
		    console.log(err);
		    return res.status(400).send("Internal error");
		}
		else { return res.status(204).end(); }
	    });
	}
    });
}

exports.removeIngredient = function removeIngredient(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role != 4) {
	return res.status(401).end();
    }
    return Ingredient.findById(req.body.id, function(ing, err) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	else {
	    return ing.remove(function(err) {
		if (err) {
		    console.log(err);
		    return res.status(400).send("Internal error");
		}
		else { return res.status(200).end(); }
	    });
	}
    });
}
