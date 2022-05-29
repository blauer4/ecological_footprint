const url = process.env.HEROKU || "http://localhost:3000"

const request = require('supertest');
const app = require('../app/app');
const mongoose = require('mongoose');

describe("new vadlid user insertion unit test", () => {

    it('POST new valid user', function (done) {
        request(url)
            .post('/api/v1/users')
            .send({ name: "new", surname: "new", email : "new", username: "new", password: "new"})
            .set('Accept', 'application/json')
            .expect(302)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

});

describe("new non-valid user insertion unit test", () => {

    it('POST non valid user: void fields', function (done) {
        request(url)
            .post('/api/v1/users')
            .send({ name: "", surname: "", email: "", username: "", password: "" })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it('POST non valid user: username already exixts fields', function (done) {
        request(url)
            .post('/api/v1/users')
            .send({ name: "vittoria", surname: "ossanna", email: "vittossanna@gmail.com", username: "vittossanna", password: "12345678" })
            .set('Accept', 'application/json')
            .expect(409)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

});

describe("retrive registered users", () => {

    it('GET all users', function (done) {
        request(url)
            .get('/api/v1/users')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it('GET one specific registered user', function(done){
        request(url)      
        .get('/api/v1/users/6284eacc5fc87587fb73d939')      
        .expect(200)
        .end(function (err, res){
            if(err) return done(err);
            return done();
        });
    });

});
/*
describe("update a specific user profile", () => {

    it('PUT update of some fields of a specific user', function(done){
        request(url)
        .put()

    });

});
*/