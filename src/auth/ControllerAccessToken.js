// TOKEN CONTROLLER

var AccessToken = require('./ModelAccessToken.js').AccessToken,
    User = require('../models/user.js').User;

exports.createAccessToken = function createAccessToken(uid, callback) { AccessToken({uid: uid}).save(callback) }

exports.removeAccessToken = function removeAccessToken(id, callback) { AccessToken.remove({_id: id}, callback) }

exports.userActionWithToken = function userActionWithToken(token, res, callback, checkId) {
    if (!token) { return res.status(400).end("Token empty") }
    AccessToken.findById(token, function(err, token) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).end("Internal error")
        }
        if (token == null) return res.status(401).end();
        if (checkId && checkId != token.uid) return res.status(401).end();
        User.findById(token.uid, function(err, user) {
            if (err) {
                console.log(err)
                return res.status(500).end("Internal error")
            }
            if (!user) return res.status(401).end("User not found")
            callback(user)
        });
    })
}