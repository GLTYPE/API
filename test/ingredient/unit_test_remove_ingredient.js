var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;
var Ingredient = require('../../src/models/ingredient.js').Ingredient;


describe('Removing ingredient', function () {
    var url = 'http://localhost:4242';
    var token = "";
    var idIng = "";
    var idIng2 = "";


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
            }).save(function (err) {
                if (err) throw err;
                User({
                    firstname: "Pierre",
                    lastname: "Medard",
                    email: "medard@gmail.com",
                    about: "",
                    role: 3,
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
                            token = JSON.parse(res.text).token;
                            Ingredient({
                                name: 'Patate',
                                picture: 'patate.jpg',
                                description: "Une patate",
                                values: 20,
                                owner_id: user._id
                            }).save(function (err, ing) {
                                if (err) throw err;
                                idIng = ing._id;
                                Ingredient({
                                    name: 'Tomate',
                                    picture: 'tomate.jpg',
                                    description: "Une tomate",
                                    values: 10,
                                    owner_id: user._id
                                }).save(function (err, ing) {
                                    if (err) throw err;
                                    idIng2 = ing._id;
                                    done();
                                })
                            })
                        });
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

    it('Should remove an ingredient', function (done) {
        var profile = {
            token: token,
            id: idIng
        };
        request(url)
            .delete('/ingredients/' + idIng)
            .type('json')
            .expect(204)
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should fail to remove an ingredient due to not a gastronomist', function (done) {
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
                token = JSON.parse(res.text).token;
                var profile = {
                    token: token,
                    id: idIng
                };
                request(url)
                    .delete('/ingredients/' + idIng2)
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
    })
});
