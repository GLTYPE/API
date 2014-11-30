// PRODUCT MODEL

var mongoose = require("mongoose"),
Product = require('../models/product.js').Product;

exports.createProduct = function createProduct(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role == 2 || role == 4) {
	return res.status(401).end();
    }
    if (!req.body.name || req.body.name.length == 0)
	return res.status(400).end("Ingredient name missing.");
    var prod = Product({
	name: req.body.name ? req.body.name : "",
	picture: req.body.picture ? req.body.picture : "",
	description: req.body.description ? req.body.description : "",
	brand: req.body.brand ? req.body.brand : "",
	ings: typeof(req.body.ings) == 'object' ? req.body.ings : [""],
	value: req.body.value ? req.body.value : ""
    });
    return prod.save(function(err) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(201).json(ing);
    });
}

exports.getAllProduct = function GetAllProduct(req, res) {
    return Product.find(function(err, product) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(product);
    });
}

exports.getProductById = function GetProductById(req, res) {
    return Product.findById(req.params.id, function(err, product) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(product);
    });    
}

exports.getProductByName = function GetProductByName(req, res) {
    return Product.find({name: new RegExp(req.params.name, "i")}, function(err, product) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(product);
    });    
}

exports.getProductByIngredientName = function GetProductByProductName(req, res) {
    return Product.find({ings: req.params.name}, function(err, product) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(product);
    });
}

exports.getProductByCriteria = function getProductByCriteria(req, res) {
    return Product.find({
	name: new RegExp(req.params.name, "i"),
	values: { $gte: req.params.minCal, $lte: req.params.maxCal},
	rate: { $gte: req.params.rateMin, $lte: req.params.rateMax},
    }, function(err, product) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(product);
    });
}

exports.editProduct = function editProduct(req, res) {
    var role = require('user.js').getRole(req.body.id);

    if (role == false || role == 2 || role == 4) {
	return res.status(401).end();
    }
    return Product.findById(req.params.id, function(err, prod) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	else {
	    prod.name = req.body.name;
	    prod.picture = req.body.picture;
	    prod.description = req.body.description;
	    prod.brand = req.body.brand;
	    prod.ings = req.body.ings;
	    prod.values = req.body.values;
	    return prod.save(function(err) {
		if (err) {
		    console.log(err);
		    return res.status(400).end("Internal error");
		}
		else { return res.status(204).end(); }
	    });
	}
    });
}
