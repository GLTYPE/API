// USER CONTROLLER

var User = require('../models/user.js').User,
    AccessToken = require('../auth/ControllerAccessToken.js'),
    md5 = require('MD5');

exports.createUser = function createUser(req, res) {
    if (!req.body.firstname || req.body.firstname.length == 0 ||
        req.body.firstname.length > 50)
        return res.status(400).end("Error firstname (Caracter number must be between 1 and 50)");
    if (!req.body.lastname || req.body.lastname.length == 0 ||
        req.body.lastname.length > 50)
        return res.status(400).end("Error lastname (Caracter number must be between 1 and 50)");
    if (!req.body.email || req.body.email.length == 0 ||
        req.body.email.length > 50)
        return res.status(400).end("Error email (Caracter number must be between 1 and 50)");
    if (!req.body.role || parseInt(req.body.role) < 0 || parseInt(req.body.role) > 3)
        return res.status(400).end("Error role");
    if (!req.body.password || req.body.password.length < 8 ||
        req.body.password.length > 20)
        return res.status(400).end("Error password (Caracter number must be between 8 and 20)");
    User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        picture: req.body.picture ? req.body.picture : "",
        email: req.body.email,
        about: req.body.about ? req.body.about : "",
        role: req.body.role,
        password: md5(req.body.password)
    }).save(function (err, user) {
        if (err) {
            if (err.toString().search("to be unique") != -1) return res.status(400).end("This email already exists");
            console.log(err.toString());
            return res.status(500).end("Internal error");
        }
        res.status(201).json(user);
    });
}

exports.getAllUsers = function getAllUsers(req, res) {
    User.find(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(user);
    });
}

exports.getActualUser = function getActualUser(req, res) {
    AccessToken.userActionWithToken(req.params.token, res, function (user) {
        res.status(200).json(user);
    });
}

exports.getUserByEmail = function getUserByEmail(req, res) {
    User.findOne({email: req.params.email}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(user);
    });
}

exports.getUserById = function getUserById(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            if (err.message.search("Cast to ObjectId") != -1) return res.status(400).end("Invalid token");
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(user);
    });
}

exports.getUserByName = function getUserByName(req, res) {
    User.find({ $or: [ {firstname: new RegExp(req.params.name, "i")}, {lastname: new RegExp(req.params.name, "i")} ] }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).end("Internal error");
        }
        res.status(200).send(user);
    });
}

exports.editUser = function editUser(req, res) {
    if (!req.body.firstname || req.body.firstname.length == 0 ||
        req.body.firstname.length > 50)
        return res.status(400).end("Error firstname (Caracter number must be between 1 and 50)");
    if (!req.body.lastname || req.body.lastname.length == 0 ||
        req.body.lastname.length > 50)
        return res.status(400).end("Error lastname (Caracter number must be between 1 and 50)");
    if (!req.body.email || req.body.email.length == 0 ||
        req.body.email.length > 50)
        return res.status(400).end("Error email (Caracter number must be between 1 and 50)");
    AccessToken.userActionWithToken(req.body.token, res, function (user) {
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.picture = req.body.picture ? req.body.picture : "";
        user.about = req.body.about ? req.body.about : "";
        user.email = req.body.email;
        user.save(function (err) {
            if (err) {
                if (err.errors.email.message) return res.status(400).end("Email already used")
                return res.status(500).end("Internal error");
            }
            res.status(200).json(user);
        });
    }, req.params.id);
}

exports.connect = function connect(req, res) {
    if (!req.body.email || !req.body.password) return (res.status(400).end("Wrong protocol"))
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal error");
        }
        if (!user) {
            return res.status(400).end("User not found")
        }
        if (user.password === md5(req.body.password)) {
            AccessToken.createAccessToken(user._id, function (err, token) {
                if (err) {
                    console.log("Error : " + err);
                    return res.status(500).end("Internal error");
                }
                res.status(200).send(token._id);
            });
        }
        else
            res.status(400).end("Wrong credentials");
    });
}

exports.disconnect = function disconnect(req, res) {
    if (!req.body.token) return res.status(400).end("Not connected")
    AccessToken.removeAccessToken(req.body.token, function (err, token) {
        if (err) {
            console.log("Error token : " + err);
            return res.status(500).end("Internal error");
        }
        if (!token) return res.status(400).end("Bad token");
        res.status(204).end();
    })
}
