// RECEIPE MODEL

var Receipe = require('../models/receipe.js').Receipe,
    AccessToken = require('../auth/ControllerAccessToken.js');

exports.createReceipe = function createReceipe(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        if (!req.body.name || req.body.name.length == 0)
            return res.status(400).end("name missing");
        Receipe({
            name: req.body.name,
            picture: req.body.picture ? req.body.picture : "",
            description: req.body.description ? req.body.description : "",
            ings: typeof(req.body.ings) == 'object' ? req.body.ings : [],
            values: req.body.values ? req.body.values : 0,
            owner: user._id
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
        values: { $gte: req.params.minCal, $lte: req.params.maxCal}
        //rate: { $gte: req.params.rateMin, $lte: req.params.rateMax}
    }, function (err, receipe) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(receipe);
    });
}

exports.editReceipe = function editReceipe(req, res) {
    if (!req.body.name || req.body.name.length == 0)
        return res.status(400).end("name missing");
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (user.role == 1 || user.role == 2)
            return res.status(401).end("Not a gastronomist");
        Receipe.findById(req.params.id, function (err, rec) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).end("Internal error");
            }
            rec.name = req.body.name;
            rec.picture = req.body.picture ? req.body.picture : rec.picture;
            rec.description = req.body.description ? req.body.description : rec.description;
            rec.ings = req.body.ings ? req.body.ings : rec.ings;
            rec.values = req.body.values ? req.body.values : rec.values;
            rec.save(function (err, rec) {
                if (err) {
                    console.log(err);
                    return res.status(500).end("Internal error");
                }
                res.status(200).json(rec);
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