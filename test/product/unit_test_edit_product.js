var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;
var Ingredient = require('../../src/models/ingredient.js').Ingredient;
var Product = require('../../src/models/product.js').Product;


describe('Editing product', function () {
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
                            }).save(function (err) {
                                if (err) throw err;
                                Ingredient({
                                    name: 'Tomate',
                                    picture: 'tomate.jpg',
                                    description: "Une tomate",
                                    values: 10,
                                    owner_id: user._id
                                }).save(function (err) {
                                    if (err) throw err;
                                    Product({
                                        name: "MyProduct",
                                        picture: "myproduct.jpg",
                                        description: "My product",
                                        brand: "Sodebo",
                                        ings: ["Patate", "Tomate"],
                                        values: 30,
                                        owner: user._id
                                    }).save(function (err, prod) {
                                        if (err) throw err;
                                        IdProduct = prod._id;
                                        Product({
                                            name: "MyProduct3",
                                            picture: "myproduct.jpg",
                                            description: "My product",
                                            brand: "Sodebo",
                                            ings: ["Patate", "Tomate"],
                                            values: 30,
                                            owner: user._id
                                        }).save(function (err, prod) {
                                            if (err) throw err;
                                            done();
                                        });
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

    it('Should edit a product', function (done) {
        var product = {
            token: token,
            name: 'MyProduct2',
            picture: 'my_product2.jpg',
            description: 'My product 2',
            brand: "Sodebo 2",
            ings: ["Patate"],
            values: 40
        };
        request(url)
            .put('/products/' + IdProduct)
            .type('json')
            .expect(200)
            .send(JSON.stringify(product))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("name", "MyProduct2");
                res.body.should.have.property("picture", "my_product2.jpg");
                res.body.should.have.property("description", "My product 2");
                res.body.should.have.property("brand", "Sodebo 2");
                res.body.should.have.property("ings", ["Patate"]);
                res.body.should.have.property("values", 40);
                res.body.should.have.property("owner", IdUser.toString());
                done();
            });
    });

    it('Should fail to edit a product due to missing token', function (done) {
        var product = {
            name: "MyProduct2",
            picture: 'my_product2.jpg',
            description: 'My product 2',
            brand: "Sodebo 2",
            ings: ["Patate"],
            values: 40
        };
        request(url)
            .put('/products/' + IdProduct)
            .type('json')
            .expect(400, "Token empty")
            .send(JSON.stringify(product))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should fail to edit a product due to not a food supplier', function (done) {
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
                var product = {
                    token: token,
                    name: 'MyProduct2',
                    picture: 'my_product2.jpg',
                    description: 'My product 2',
                    brand: "Sodebo 2",
                    ings: ["Patate"],
                    values: 40
                };
                request(url)
                    .put('/products/' + IdProduct)
                    .type('json')
                    .expect(401, "Not a food supplier")
                    .send(JSON.stringify(product))
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        done();
                    });
            });
    });
});