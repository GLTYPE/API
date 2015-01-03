// INGREDIENT CONTROLLER

var Moment = require('../models/moment.js').Moment,
    AccessToken = require('../auth/ControllerAccessToken.js');


exports.createMoment = function createMoment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (!req.body.name || req.body.name.length == 0)
            return res.status(400).end("name missing.");
        if (!req.body.date || req.body.date.length == 0)
            return res.status(400).end("date missing.");
        if (!req.body.description || req.body.description.length == 0)
            return res.status(400).end("description missing.");
        Moment({
            name: req.body.name,
            description: req.body.description,
            owner_id: user._id,
            target_id: req.body.target_id ? req.body.target_id : user._id,
            date: req.body.date
        }).save(function (err, mom) {
            if (err) {
                console.log(err);
                return res.status(500).end("Internal error");
            }
            res.status(201).json(mom);
        });
    });
}

exports.getAllMoments = function GetAllMoments(req, res) {
    Moment.find(function (err, mom) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(mom);
    });
}

exports.getMomentById = function GetMomentById(req, res) {
    Moment.findById(req.params.id, function (err, mom) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(mom);
    });
}

exports.getMomentByOwnerId = function GetMomentByOwnerId(req, res) {
    Moment.find({owner_id: req.params.id}, function (err, mom) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(mom);
    });
}

exports.getMomentByTargetId = function GetMomentByTargetId(req, res) {
    Moment.find({target_id: req.params.id}, function (err, mom) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(mom);
    });
}

exports.editMoment = function editMoment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        Moment.findById(req.params.id, function (err, mom) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id != mom.owner_id) return res.status(401).end("Not your moment");
            mom.name = req.body.name ? req.body.name : mom.name;
            mom.date = req.body.date ? req.body.date : mom.date;
            mom.description = req.body.description ? req.body.description : mom.description;
            mom.save(function (err, mom) {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Internal error");
                }
                res.status(200).json(mom);
            });
        });
    });
}

exports.removeMoment = function removeMoment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        Moment.findById(req.params.id, function (err, mom) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id != mom.owner_id) return res.status(401).end("Not your moment");
            Ingredient.remove({_id: req.body.id}, function (err) {
                if (err) {
                    if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                    console.log(err);
                    return res.status(500).send("Internal error");
                }
                res.status(204).end();
            });
        });
    });
}
