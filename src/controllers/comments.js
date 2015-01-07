// COMMENT CONTROLLER

var Comment = require('../models/comment.js').Comment,
    AccessToken = require('../auth/ControllerAccessToken.js');


exports.createComment = function createComment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        if (!req.body.owner_id)
            return res.status(400).end("owner_id missing.");
        if (!req.body.target_id)
            return res.status(400).end("target_id missing.");
        if (!req.body.comment || req.body.comment.length == 0)
            return res.status(400).end("target_id missing.");
        if (!req.body.date || req.body.date.length == 0)
            return res.status(400).end("date missing.");
        Comment({
            name: req.body.name,
            description: req.body.description,
            owner_id: user._id,
            target_id: req.body.target_id ? req.body.target_id : user._id,
            date: req.body.date
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
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.getCommentByOwnerId = function GetCommentByOwnerId(req, res) {
    Comment.find({owner_id: req.params.id}, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.getCommentByTargetId = function GetCommentByTargetId(req, res) {
    Comment.find({$and: [ {target_id: req.params.id}, {type:req.params.type}]}, function (err, com) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).send("Internal error");
        }
        res.status(200).send(com);
    });
}

exports.editComment = function editComment(req, res) {
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        Comment.findById(req.params.id, function (err, com) {
            if (err) {
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id != com.owner_id) return res.status(401).end("Not your comment");
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
                if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
                console.log(err);
                return res.status(500).send("Internal error");
            }
            if (user._id != com.owner_id) return res.status(401).end("Not your comment");
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
