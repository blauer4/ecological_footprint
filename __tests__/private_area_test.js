const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../app/app');
const User = require('../app/models/user.js').User; 


describe("Private area access and registration", () => {
    
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


    it('POST non valid user: void fields', function (done) {
        request(app)
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
        request(app)
            .post('/api/v1/users')
            .send({ name: "vittoria", surname: "ossanna", email: "vittossanna@gmail.com", username: "vittossanna", password: "12345678" })
            .set('Accept', 'application/json')
            .expect(409)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it('GET all users', function (done) {
        request(app)
            .get('/api/v1/users')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it('GET one specific registered user', function(done){
        request(app)      
        .get(`/api/v1/users/${user.id}`)      
        .expect(200)
        .end(function (err, res){
            if(err) return done(err);
            return done();
        });
    });

    it('logging in with valid credentials', (done) => {
        
        let mock_user = { email: user.email, password: user.password}
        request(app)
        .post('/api/v1/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(true)
            done();
        })

    });

    it('logging in with valid mail but non-valid password', (done) => {
        
        let mock_user = { email: user.email, password: "foo"}
        request(app)
        .post('/api/v1/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false)
            done();
        })

    });

    it('logging in with non-valid credentials', (done) => {
        
        let mock_user = { email: 'foo', password: "foo" }
        request(app)
        .post('/api/v1/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false)
            done();
        })

    });

});

