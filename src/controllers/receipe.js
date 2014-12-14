// RECEIPE MODEL

var Receipe = require('../models/receipe.js').Receipe,
    AccessToken = require('../auth/ControllerAccessToken.js');

exports.createReceipe = function createReceipe(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        if (!req.body.name || req.body.name.length == 0)
            return res.status(400).end("Ingredient name missing.");
        Receipe({
            name: req.body.name ? req.body.name : "",
            picture: req.body.picture ? req.body.picture : "",
            description: req.body.description ? req.body.description : "",
            ings: typeof(req.body.ings) == 'object' ? req.body.ings : [""],
            value: req.body.value ? req.body.value : "",
            owner: req.body.userId
        }).save(function (err, rec) {
            if (err) {
                console.log(err);
                return res.status(500).end("Internal error");
            }
            res.status(201).json(rec);
        });
    });
}


exports.getAllReceipes = function getAllReceipes(req, res) {
    Receipe.find(function (err, receipe) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(receipe);
    });
}

exports.getReceipeById = function getReceipeById(req, res) {
    Receipe.findById(req.params.id, function (err, receipe) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(receipe);
    });
}

exports.getReceipeByName = function getReceipeByName(req, res) {
    Receipe.find({name: new RegExp(req.params.name, "i")}, function (err, receipe) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(receipe);
    });
}

exports.getReceipeByCriteria = function getReceipeByCriteria(req, res) {
    Receipe.find({
        name: new RegExp(req.params.name, "i"),
        values: { $gte: req.params.minCal, $lte: req.params.maxCal},
        rate: { $gte: req.params.rateMin, $lte: req.params.rateMax}
    }, function (err, receipe) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(receipe);
    });
}

exports.editReceipe = function editReceipe(req, res) {
    if (user.role == 1 || user.role == 2)
        return res.status(401).end("Not a gastronomist");
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 3 || user.role == 4)
            return res.status(401).end();
        Receipe.findById(req.params.id, function (err, rec) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).end("Internal error");
            }
            rec.name = req.body.name;
            rec.picture = req.body.picture;
            rec.description = req.body.description;
            rec.ings = req.body.ings;
            rec.values = req.body.values;
            rec.save(function (err, rec) {
                if (err) {
                    console.log(err);
                    return res.status(500).end("Internal error");
                }
                res.status(204).json(rec);
            });
        });
    });
}

exports.removeReceipe = function removeReceipe(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        Receipe.remove({_id: rec._id}, function (err) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            res.status(204).end();
        });
    });
}