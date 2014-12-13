var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var Ingredient = require('../../src/models/ingredient.js').Ingredient;
var User = require('../../src/models/user.js').User;

describe('Getting ingredient', function () {
    var url = 'http://localhost:4242';
    var token = "";
    var idIng = 0;
    var idIng2 = 0;
    var IdUser = "";

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("ingredients")
            mongoose.connection.db.dropCollection("accesstokens")
            mongoose.connection.db.dropCollection("users")
            User({
                firstname: "Pierre",
                lastname: "Medard",
                email: "medard@gmail.com",
                about: "",
                role: 3,
                password: md5("00000000")
            }).save(function (err, user) {
                IdUser = user._id;
                Ingredient({
                    name: 'Tomate',
                    picture: 'tomate.jpg',
                    description: "Une tomate",
                    values: 10,
                    owner: IdUser
                }).save(function (err, ing) {
                    if (err) throw err;
                    idIng = ing._id;
                    Ingredient({
                        name: 'Patate',
                        picture: 'patate.jpg',
                        description: "Une patate",
                        values: 20,
                        owner: IdUser
                    }).save(function (err, ing) {
                        if (err) throw err;
                        idIng2 = ing._id;
                        done();
                    })
                });
            })
        });
    })

    after(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("ingredients")
            mongoose.connection.db.dropCollection("accesstokens")
            mongoose.connection.db.dropCollection("users")
        });
        mongoose.connection.close(done)
    })

    it('Should get an ingredient by id', function (done) {
        request(url)
            .get('/ingredients/' + idIng)
            .type('json')
            .expect(200)
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

    it('Should get an ingredient by id', function (done) {
        request(url)
            .get('/ingredients/' + idIng)
            .type('json')
            .expect(200)
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

    it('Should get an ingredient by name', function (done) {
        request(url)
            .get('/ingredients/name/Pata')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body[0].should.have.property("name", "Patate");
                res.body[0].should.have.property("picture", "patate.jpg");
                res.body[0].should.have.property("description", "Une patate");
                res.body[0].should.have.property("values", 20);
                res.body[0].should.have.property("owner", IdUser.toString());
                done();
            });
    });

    it('Should get a value ingredient by id', function (done) {
        request(url)
            .get('/ingredients/'+ idIng + '/values')
            .type('json')
            .expect(200, '10')
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});
