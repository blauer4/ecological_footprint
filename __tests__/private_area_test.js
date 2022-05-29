const url = process.env.HEROKU || "http://localhost:3000"

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../app/app');
const User = require('../app/models/user.js').User; 


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

    let user;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        user = await User.findOne({});

        // create a valid token
        token = jwt.sign( {email: user.email, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });

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
        .get(`/api/v1/users/${user.id}`)      
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