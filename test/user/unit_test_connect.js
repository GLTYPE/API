var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;

describe('Connecting account', function () {
    var url = 'http://localhost:4242';

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            mongoose.connection.db.dropCollection("accesstokens")
            User({
                firstname: "Pierre",
                lastname: "Medard",
                email: "medard@gmail.com",
                about: "",
                role: 1,
                password: md5("00000000")
            }).save(function(err) {
                if (err) throw err;
                done();
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

    it('Should connect properly', function (done) {
        var account = {
            email: "medard@gmail.com",
            password: '00000000'
        };
        request(url)
            .post('/users/connect')
            .type('json')
            .expect(200)
            .send(JSON.stringify(account))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("token");
                res.body.should.have.property("role", 1);
                done();
            });
    });

    it('Should not connect due to bad credentials', function (done) {
        var account = {
            email: "medard@gmail.com",
            password: '00000001'
        };
        request(url)
            .post('/users/connect')
            .type('json')
            .expect(400, "Wrong credentials")
            .send(JSON.stringify(account))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should not connect due to missing email', function (done) {
        var account = {
            password: '00000001'
        };
        request(url)
            .post('/users/connect')
            .type('json')
            .expect(400, "Wrong protocol")
            .send(JSON.stringify(account))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should not connect due to missing password', function (done) {
        var account = {
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users/connect')
            .type('json')
            .expect(400, "Wrong protocol")
            .send(JSON.stringify(account))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});
