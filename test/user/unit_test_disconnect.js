var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');
var md5 = require('MD5');
var User = require('../../src/models/user.js').User;

describe('Disconnecting account', function () {
    var url = 'http://localhost:4242';
    var token = "";

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
                        done();
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

    it('Should disconnect properly', function (done) {
        request(url)
            .post('/users/disconnect')
            .type('json')
            .send('{"token": "' + token + '"}')
            .expect(204)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    it('Should get an error because already disconnected', function (done) {
        request(url)
            .post('/users/disconnect')
            .type('json')
            .send('{"token": "' + token + '"}')
            .expect(400, "Bad token")
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
});
