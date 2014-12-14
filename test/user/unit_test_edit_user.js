var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;

describe('Editing account', function () {
    var url = 'http://localhost:4242';
    var token = "";
    var idUser = 0;
    var idUser2 = 0;

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("accesstokens")
            User({
                firstname: "Thomas",
                lastname: "Lacroix",
                email: "lacroix@gmail.com",
                about: "",
                role: 1,
                password: md5("00000000")
            }).save(function (err, user) {
                if (err) throw err;
                idUser2 = user._id;
                User({
                    firstname: "Pierre",
                    lastname: "Medard",
                    email: "medard@gmail.com",
                    about: "",
                    role: 1,
                    password: md5("00000000")
                }).save(function (err, user) {
                    if (err) throw err;
                    var account = {
                        email: "medard@gmail.com",
                        password: '00000000'
                    };
                    request(url)
                        .post('/users/connect')
                        .type('json')
                        .send(JSON.stringify(account))
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            token = JSON.parse(res.text);
                            idUser = user._id;
                            done();
                        });
                });
            });
        });
    })

    after(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("accesstokens")
        });
        mongoose.connection.close(done)
    })

    it('Should edit your own profile properly', function (done) {
        var myRequest = {
            token: token,
            firstname: "Gilles",
            lastname: "Tual",
            picture: "mypic.jpg",
            about: "Un gros pd",
            email: "gillesTual@gmail.com"
        };
        request(url)
            .put('/users/' + idUser)
            .type('json')
            .expect(200)
            .send(JSON.stringify(myRequest))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("firstname", "Gilles")
                res.body.should.have.property("lastname", "Tual")
                res.body.should.have.property("picture", "mypic.jpg")
                res.body.should.have.property("about", "Un gros pd")
                res.body.should.have.property("email", "gillesTual@gmail.com")
                res.body.should.have.property("role", 1)
                done();
            });
    });

    it('Should get an error due to editing another account', function (done) {
        var myRequest = {
            token: token,
            lastname: "Gilles",
            firstname: "Tual",
            picture: "",
            about: "Un gros pd",
            email: "gillesTual@gmail.com"
        };
        request(url)
            .put('/users/' + idUser2)
            .type('json')
            .expect(401)
            .send(JSON.stringify(myRequest))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should get an error due to editing an address mail already used', function (done) {
        var myRequest = {
            token: token,
            lastname: "Gilles",
            firstname: "Tual",
            picture: "",
            about: "Un gros pd",
            email: "lacroix@gmail.com"
        };
        request(url)
            .put('/users/' + idUser)
            .type('json')
            .expect(400, "Email already used")
            .send(JSON.stringify(myRequest))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should get an error due for being disconnect', function (done) {
        request(url)
            .post('/users/disconnect')
            .type('json')
            .send('{"token": "' + token + '"}')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        var myRequest = {
            token: token,
            lastname: "Gilles",
            firstname: "Tual",
            picture: "",
            about: "Un gros pd",
            email: "gillesTual@gmail.com"
        };
        request(url)
            .put('/users/' + idUser)
            .type('json')
            .expect(401)
            .send(JSON.stringify(myRequest))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});
