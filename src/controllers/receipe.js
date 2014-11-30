// RECEIPE MODEL

var mongoose = require("mongoose"),
Receipe = require('../models/receipe.js').Receipe;

exports.createProduct = function createProduct(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role == 3 || role == 4) {
	return res.status(401).end();
    }
    if (!req.body.name || req.body.name.length == 0)
	return res.status(400).end("Ingredient name missing.");
    var receipe = Receipe({
	name: req.body.name ? req.body.name : "",
	picture: req.body.picture ? req.body.picture : "",
	description: req.body.description ? req.body.description : "",
	brand: req.body.brand ? req.body.brand : "",
	ings: typeof(req.body.ings) == 'object' ? req.body.ings : [""],
	value: req.body.value ? req.body.value : "",
	owner: req.body.userId
    });
    return receipe.save(function(err) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(201).json(ing);
    });
}


exports.getAllReceipes = function getAllReceipes(req, res) {
    return Receipe.find(function(err, receipe) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(receipe);
    });
}

exports.getReceipeById = function getReceipeById(req, res) {
    return Receipe.findById(req.params.id, function(err, receipe) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(receipe);
    });
}

exports.getReceipeByName = function getReceipeByName(req, res) {
    return Receipe.find({name: new RegExp(req.params.name, "i")}, function(err, receipe) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(receipe);
    });
}

exports.getReceipeByCriteria = function getReceipeByCriteria(req, res) {
    return Receipe.find({
	name: new RegExp(req.params.name, "i"),
	values: { $gte: req.params.minCal, $lte: req.params.maxCal},
	rate: { $gte: req.params.rateMin, $lte: req.params.rateMax},
    }, function(err, receipe) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(receipe);
    });
}

exports.editReceipe = function editReceipe(req, res) {
    var role = require('user.js').getRole(req.body.userId);

    if (role == false || role == 3 || role == 4) {
	return res.status(401).end();
    }
    return Receipe.findById(req.params.id, function(err, rec) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	else {
	    rec.name = req.body.name;
	    rec.picture = req.body.picture;
	    rec.description = req.body.description;
	    rec.ings = req.body.ings;
	    rec.values = req.body.values;
	    return rec.save(function(err) {
		if (err) {
		    console.log(err);
		    return res.status(400).end("Internal error");
		}
		else { return res.status(204).end(); }
	    });
	}
    });
}
