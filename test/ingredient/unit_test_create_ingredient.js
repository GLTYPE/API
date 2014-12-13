var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;

describe('Creating ingredient', function () {
    var url = 'http://localhost:4242';
    var token = "";
    var IdUser;

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("ingredients")
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
            });
            User({
                firstname: "Pierre",
                lastname: "Medard",
                email: "medard@gmail.com",
                about: "",
                role: 3,
                password: md5("00000000")
            }).save(function (err, user) {
                if (err) throw err;
                IdUser = user._id;
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
                        done();
                    });
            });
        });
    })

    after(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("ingredients")
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("accesstokens")
        });
        mongoose.connection.close(done)
    })

    it('Should create an ingredient', function (done) {
        var profile = {
            token: token,
            name: 'Tomate',
            picture: 'tomate.jpg',
            description: 'Une tomate',
            values: 10
        };
        request(url)
            .post('/ingredients')
            .type('json')
            .expect(201)
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("name", "Tomate");
                res.body.should.have.property("picture", "tomate.jpg");
                res.body.should.have.property("description", "Une tomate");
                res.body.should.have.property("values", 10);
                res.body.should.have.property("owner", IdUser.toString());
                done();
            });
    });

    it('Should fail to create an ingredient due to name missing', function (done) {
        var profile = {
            token: token,
            picture: 'tomate.jpg',
            description: 'Une tomate',
            values: 10
        };
        request(url)
            .post('/ingredients')
            .type('json')
            .expect(400, "name missing")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should fail to create an ingredient due to token missing', function (done) {
        var profile = {
            picture: 'tomate.jpg',
            description: 'Une tomate',
            values: 10
        };
        request(url)
            .post('/ingredients')
            .type('json')
            .expect(401)
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should fail to create an ingredient due to not gastronomist', function (done) {
        var account = {
            email: "lacroix@gmail.com",
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
                var profile = {
                    token: token,
                    name: 'tomate',
                    picture: 'tomate.jpg',
                    description: 'Une tomate',
                    values: 10
                };
                request(url)
                    .post('/ingredients')
                    .type('json')
                    .expect(401, "Not a gastronomist")
                    .send(JSON.stringify(profile))
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
    });
});
