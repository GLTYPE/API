var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');

describe('Creating account', function () {
    var url = 'http://localhost:4242';

    before(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
            done()
        });
    })

    after(function (done) {
        mongoose.connect('mongodb://localhost/test_in', function () {
            mongoose.connection.db.dropCollection("users")
        });
        mongoose.connection.close(done)
    })


    it('Should create a user properly', function (done) {
        var profile = {
            firstname: 'Pierre',
            lastname: 'Medard',
            password: 'testtest',
            role: "1",
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(201)
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.have.property("firstname", "Pierre");
                res.body.should.have.property("lastname", "Medard");
                res.body.should.have.property("email", "medard@gmail.com");
                res.body.should.have.property("role", 1);
                done();
            });
    });


    it('Can t create a user because of multiple mail', function (done) {
        var profile = {
            firstname: 'Pierre',
            lastname: 'Medard',
            password: 'testtest',
            role: "1",
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "This email already exists")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    it('Can t create a user because of malformated or missing firstname', function (done) {
        var profile = {
            lastname: 'Medard',
            password: 'testtest',
            role: "1",
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error firstname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.firstname = '';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error firstname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.firstname = '012345678901234567890123456789012345678901234567890';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error firstname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    it('Can t create a user because of mal formated or missing lastname', function (done) {
        var profile = {
            firstname: "Pierre",
            password: 'testtest',
            role: "1",
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error lastname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.lastname = '';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error lastname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.lastname = '012345678901234567890123456789012345678901234567890';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error lastname (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    it('Can t create a user because of mal formated or missing email', function (done) {
        var profile = {
            firstname: 'Pierre',
            lastname: 'Medard',
            password: 'testtest',
            role: "1"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error email (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.email = '';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error email (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.email = '012345678901234567890123456789012345678901234567890';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error email (Caracter number must be between 1 and 50)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    it('Can t create a user because of mal formated or missing role', function (done) {
        var profile = {
            firstname: 'Pierre',
            lastname: 'Medard',
            password: 'testtest',
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error role")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.role = '-1';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error role")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.role = '4';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error role")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });


    it('Can t create a user because of mal formated or missing password', function (done) {
        var profile = {
            firstname: "Pierre",
            lastname: 'Medard',
            role: "1",
            email: "medard@gmail.com"
        };
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error password (Caracter number must be between 8 and 20)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.password = '';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error password (Caracter number must be between 8 and 20)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
            });
        profile.password = '012345678901234567890';
        request(url)
            .post('/users')
            .type('json')
            .expect(400, "Error password (Caracter number must be between 8 and 20)")
            .send(JSON.stringify(profile))
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });
}); 
