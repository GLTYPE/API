var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;
var Ingredient = require('../../src/models/ingredient.js').Ingredient;
var Product = require('../../src/models/product.js').Product;


describe('Getting product', function () {
    var url = 'http://localhost:4242';
    var token = "";
    var IdUser;
    var IdProduct;

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("ingredients")
            mongoose.connection.db.dropCollection("accesstokens")
            mongoose.connection.db.dropCollection("products")
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
                    role: 2,
                    password: md5("00000000")
                }).save(function (err, user) {
                    if (err) throw err;
                    var account = {
                        email: "medard@gmail.com",
                        password: '00000000'
                    };
                    IdUser = user._id;
                    request(url)
                        .post('/users/connect')
                        .type('json')
                        .send(JSON.stringify(account))
                        .end(function (err, res) {
                            if (err) {
                                throw err;
                            }
                            token = JSON.parse(res.text);
                            Ingredient({
                                name: 'Patate',
                                picture: 'patate.jpg',
                                description: "Une patate",
                                values: 20,
                                owner_id: user._id
                            }).save(function(err) {
                                if (err) throw err;
                                Ingredient({
                                    name: 'Tomate',
                                    picture: 'tomate.jpg',
                                    description: "Une tomate",
                                    values: 10,
                                    owner_id: user._id
                                }).save(function(err) {
                                    if (err) throw err;
                                    Product({
                                        name: "MyProduct",
                                        picture: "myproduct.jpg",
                                        description: "My product",
                                        brand: "Sodebo",
                                        ings: ["Patate", "Tomate"],
                                        values: 30,
                                        owner: user._id
                                    }).save(function(err, prod) {
                                        if (err) throw err;
                                        IdProduct = prod._id;
                                        done();
                                    });
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
            mongoose.connection.db.dropCollection("products")
        });
        mongoose.connection.close(done)
    })

    it('Should get a product by id', function (done) {
        request(url)
            .get('/products/' + IdProduct)
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("name", "MyProduct");
                res.body.should.have.property("picture", "myproduct.jpg");
                res.body.should.have.property("description", "My product");
                res.body.should.have.property("brand", "Sodebo");
                res.body.should.have.property("ings", ["Patate", "Tomate"]);
                res.body.should.have.property("values", 30);
                res.body.should.have.property("owner", IdUser.toString());
                done();
            });
    });

    it('Should get a product by name', function (done) {
        request(url)
            .get('/products/name/MyProd')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body[0].should.have.property("name", "MyProduct");
                res.body[0].should.have.property("picture", "myproduct.jpg");
                res.body[0].should.have.property("description", "My product");
                res.body[0].should.have.property("brand", "Sodebo");
                res.body[0].should.have.property("ings", ["Patate", "Tomate"]);
                res.body[0].should.have.property("values", 30);
                res.body[0].should.have.property("owner", IdUser.toString());
                done();
            });
    });

    it('Should get a product by ingredient name', function (done) {
        request(url)
            .get('/products/ingredient/Patat')
            .type('json')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body[0].should.have.property("name", "MyProduct");
                res.body[0].should.have.property("picture", "myproduct.jpg");
                res.body[0].should.have.property("description", "My product");
                res.body[0].should.have.property("brand", "Sodebo");
                res.body[0].should.have.property("ings", ["Patate", "Tomate"]);
                res.body[0].should.have.property("values", 30);
                done();
            });
    });
});