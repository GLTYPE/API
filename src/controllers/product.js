// PRODUCT MODEL

var Product = require('../models/product.js').Product,
    AccessToken = require('../auth/ControllerAccessToken.js');

exports.createProduct = function createProduct(req, res) {
    if (!req.body.name || req.body.name.length == 0)
        return res.status(400).end("name missing");
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 3)
            return res.status(401).end("Not a food supplier");
        Product({
            name: req.body.name,
            picture: req.body.picture ? req.body.picture : "",
            description: req.body.description ? req.body.description : "",
            brand: req.body.brand ? req.body.brand : "",
            ings: typeof(req.body.ings) == 'object' ? req.body.ings : [],
            values: req.body.values ? req.body.values : 0,
            owner: user._id
        }).save(function (err, prod) {
            if (err) {
                console.log(err);
                return res.status(500).end("Internal error");
            }
            res.status(201).json(prod);
        });
    });
}

exports.getAllProduct = function GetAllProduct(req, res) {
    Product.find(function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(product);
    });
}

exports.getProductById = function GetProductById(req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(product);
    });
}

exports.getProductByName = function GetProductByName(req, res) {
    Product.find({name: new RegExp(req.params.name, "i")}, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(product);
    });
}

exports.getProductByIngredientName = function GetProductByProductName(req, res) {
    Product.find({ings: new RegExp(req.params.name, "i")}, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(product);
    });
}

exports.getProductByCriteria = function getProductByCriteria(req, res) {
    Product.find({
        name: new RegExp(req.params.name, "i"),
        values: { $gte: req.params.minCal, $lte: req.params.maxCal}
        //rate: { $gte: req.params.rateMin, $lte: req.params.rateMax}
    }, function (err, product) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(product);
    });
}

exports.editProduct = function editProduct(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 3)
            return res.status(401).end("Not a food supplier");
        Product.findById(req.params.id, function (err, prod) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
                console.log(err);
                return res.status(500).end("Internal error");
            }
            prod.name = req.body.name ? req.body.name : prod.name;
            prod.picture = req.body.picture ? req.body.picture : prod.picture;
            prod.description = req.body.description ? req.body.description : prod.description;
            prod.brand = req.body.brand ? req.body.brand : prod.brand;
            prod.ings = req.body.ings ? req.body.ings : prod.ings;
            prod.values = req.body.values ? req.body.values : prod.values;
            prod.save(function (err, prod) {
                if (err) {
                    console.log(err);
                    return res.status(500).end("Internal error");
                }
                res.status(200).json(prod);
            });
        });
    });
}

exports.removeProduct = function removeProduct(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 3)
            return res.status(401).end("Not a food supplier");
        Product.remove({_id: req.params.id}, function (err) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            res.status(204).end();
        });
    });
}