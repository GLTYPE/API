// USER CONTROLLER

var mongoose = require("mongoose"),
User = require('../models/user.js').User,
md5 = require('MD5');

exports.createUser = function createUser(req, res) {
    if (!req.body.firstname || req.body.firstname.length == 0 ||
    	req.body.firstname.length > 20)
    	return res.status(400).send({"res":false, "error_code":0002, "msg":"Need to send a field 'email' in the form !"});
    if (!req.body.lastname || req.body.lastname.length == 0 ||
    	req.body.lastname.length > 50)
    	return res.status(400).end("Error lastname (Caracter number must be between 1 and 50)");
    if (!req.body.email || req.body.email.length == 0 ||
    	req.body.email.length > 50)
    	return res.status(400).end("Error email (Caracter number must be between 1 and 50)");
    if (!req.body.role || parseInt(req.body.role) < 0 || parseInt(req.body.role) > 3)
    	res.status(400).end("Error role");
    if (!req.body.password || req.body.password.length < 8 ||
    	req.body.password.length > 20)
    	return res.status(400).end("Error password (Caracter number must be between 8 and 20)");
    var user = User({
	firstname: req.body.firstname,
	lastname: req.body.lastname,
	email: req.body.email,
	about: req.body.about ? req.body.about : "",
	role: req.body.role,
	password: md5(req.body.password)
    });
    return user.save(function(err) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(201).json(user);
    });
}

exports.getAllUsers = function getAllUsers(req, res) {
    return User.find(function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(user);
    });
}

exports.getUserByEmail = function getUserByEmail(req, res) {
    return User.findOne({email : req.body.email}, function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(user);
    });
}

exports.getUserById = function getUserById(req, res) {
    return User.findById(req.params.id, function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(user);
    });
}

exports.getUserByName = function getUserByName(req, res) {
    return User.find({name: new RegExp(req.params.name, "i")}, function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	return res.status(200).send(user);
    });
}

exports.connect = function connect(req, res) {
    return User.findOne({email : req.body.email}, function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).send("Internal error");
	}
	else {
	    if (user.password === md5(req.body.password)) {
		return res.status(200).json(user);
	    }
	    else {
		return res.status(400).end("Wrong password");
	    }
	}
    });   
}

exports.editUser = function editUser(req, res) {
    return User.findById(req.params.id, function(err, user) {
	if (err) {
	    console.log(err);
	    return res.status(400).end("Internal error");
	}
	else {
	    user.lastname = req.body.lastname;
	    user.firstname = req.body.firstname;	
	    user.picture = req.body.picture;
	    user.about = req.body.about;
	    user.email = req.body.email;
	    return user.save(function(err) {
		if (err) {
		    console.log(err);
		    return res.status(400).end("Internal error");
		}
		else { return res.status(204).end(); }
	    });
	}
    });
}

exports.getRole = function getRole(id) {
    return User.findById(id, function(err, user) {
	if (err)
	    return false;
	if (typeof user.id == 'undefined')
	    return false;
	return user.id;
    });
}
