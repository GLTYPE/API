var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;

describe('Getting account', function () {
    var url = 'http://localhost:4242';
    var idUser = 0;
    var idUser2 = 0;

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("accesstokens")
            User({
                firstname: "Thomas",
                lastname: "Lacrierre",
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
                    idUser = user._id;
                    done()
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

    it('Should get my own user profile', function (done) {
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
                request(url)
                    .get('/users/token/' + token)
                    .type('json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        res.body.should.have.property("firstname", "Pierre")
                        res.body.should.have.property("lastname", "Medard")
                        res.body.should.have.property("email", "medard@gmail.com")
                        res.body.should.have.property("role", 1)
                        done();
                    });
            });
    });

    it('Should get a user by id', function (done) {
        request(url)
            .get('/users/' + idUser)
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("firstname", "Pierre")
                res.body.should.have.property("lastname", "Medard")
                res.body.should.have.property("email", "medard@gmail.com")
                res.body.should.have.property("role", 1)
                done();
            });
    });

    it('Should get a user by email', function (done) {
        request(url)
            .get('/users/mail/lacroix@gmail.com')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("firstname", "Thomas")
                res.body.should.have.property("lastname", "Lacrierre")
                res.body.should.have.property("email", "lacroix@gmail.com")
                res.body.should.have.property("role", 1)
                done();
            });
    });

    it('Should get a two users by name', function (done) {
        request(url)
            .get('/users/name/ierre')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body[0].should.have.property("firstname", "Thomas")
                res.body[0].should.have.property("lastname", "Lacrierre")
                res.body[0].should.have.property("email", "lacroix@gmail.com")
                res.body[1].should.have.property("role", 1)
                res.body[1].should.have.property("firstname", "Pierre")
                res.body[1].should.have.property("lastname", "Medard")
                res.body[1].should.have.property("email", "medard@gmail.com")
                res.body[0].should.have.property("role", 1)
                done();
            });
    });

    it('Should get get an error cause of invalid id', function (done) {
        request(url)
            .get('/users/4a0')
            .type('json')
            .expect(400, "Invalid token")
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should get no one by email', function (done) {
        request(url)
            .get('/users/mail/4a0')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.not.have.property("firstname")
                res.body.should.not.have.property("lastname")
                res.body.should.not.have.property("email")
                res.body.should.not.have.property("role")
                done();
            });
    });

    it('Should get no one by name', function (done) {
        request(url)
            .get('/users/name/4a0')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.not.have.property("firstname")
                res.body.should.not.have.property("lastname")
                res.body.should.not.have.property("email")
                res.body.should.not.have.property("role")
                done();
            });
    });
});
