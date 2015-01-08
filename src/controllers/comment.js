// COMMENT CONTROLLER

var Comment = require('../models/comment.js').Comment,
    User = require('../models/user.js').User,
    AccessToken = require('../auth/ControllerAccessToken.js');


exports.createComment = function createComment(req, res) {
    console.log(req.body)
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (!req.body.target_id)
            return res.status(400).end("target_id missing.");
        if (!req.body.comment || req.body.comment.length == 0)
            return res.status(400).end("target_id missing.");
        if (!req.body.date || req.body.date.length == 0)
            return res.status(400).end("date missing.");
        if (req.body.type != "moment" && req.body.type != "product" && req.body.type != "ingredient" &&
            req.body.type != "receipe")
            return res.status(400).end("wrong type missing.");
        Comment({
            name: req.body.name,
            comment: req.body.comment,
            owner_id: user._id,
            target_id: req.body.target_id,
            date: req.body.date,
            type: req.body.type
        }).save(function (err, com) {
            if (err) {
                console.log(err);
                return res.status(500).end("Internal error");
            }
            res.status(201).json(com);
        });
    });
}

exports.getAllComments = function GetAllComments(req, res) {
    Comment.find(function (err, com) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.getCommentById = function GetCommentById(req, res) {
    Comment.findById(req.params.id, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.getCommentByOwnerId = function GetCommentByOwnerId(req, res) {
    Comment.find({$and: [ {owner_id: req.params.id}, {type:req.params.type}]}, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.getCommentByTargetId = function GetCommentByTargetId(req, res) {
    Comment.find({$and: [ {target_id: req.params.id}, {type:req.params.type}]}, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.findCommentByTargetId = function findCommentByTargetId(id, res, callback) {
    Comment.find({$and: [ {target_id: id}, {type:"moment"}]}, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        callback(com);
    });
}

exports.editComment = function editComment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        Comment.findById(req.params.id, function (err, com) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id.toString() != com.owner_id.toString()) return res.status(401).end("Not your moment");
            com.name = req.body.name ? req.body.name : com.name;
            com.date = req.body.date ? req.body.date : com.date;
            com.description = req.body.description ? req.body.description : com.description;
            com.save(function (err, com) {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Internal error");
                }
                res.status(200).json(com);
            });
        });
    });
}

exports.removeComment = function removeComment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        Comment.findById(req.params.id, function (err, com) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id.toString() != com.owner_id.toString()) return res.status(401).end("Not your moment");
            Comment.remove({_id: req.body.id}, function (err) {
                if (err) {
                    if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid id");
                    console.log(err);
                    return res.status(500).send("Internal error");
                }
                res.status(204).end();
            });
        });
    });
}
