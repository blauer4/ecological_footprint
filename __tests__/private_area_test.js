const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../app/app');
const User = require('../app/models/user.js').User; 


describe("Private area access and registration", () => {
    
    let user;
    let user2;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        user = await User.findOne({});
        user2 = await User.findOne({}).skip(1);

        // create a valid token
        token = jwt.sign( {username: user.username, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });


    it('POST non valid user: void fields', function (done) {
        request(app)
            .post('/api/v2/register')
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
            .post('/api/v2/register')
            .send({ name: "foo", foo: "prova", email: "foo", username: user2.username, password: "foo" })
            .set('Accept', 'application/json')
            .expect(409)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it('GET all users', function (done) {
        request(app)
        .get('/api/v2/users')
        .set('Cookie', [`token=${token}`])
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            return done();
        });
    });

    it('GET one specific registered user', function(done){
        request(app)
        .get(`/api/v2/users/${user.id}`)      
        .set('Cookie', [`token=${token}`])      
        .expect(200)
        .end(function (err, res){
            if(err) return done(err);
            return done();
        });
    });

    it('logging in with valid credentials', (done) => {
        
        let mock_user = { username: user.username, password: user.password}
        request(app)
        .post('/api/v2/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
            done();
        })

    });

    it('logging in with valid username but non-valid password', (done) => {
        
        let mock_user = { username: user.username, password: "foo"}
        request(app)
        .post('/api/v2/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(404);

            done();
        })

    });

    it('logging in with non-valid credentials', (done) => {
        
        let mock_user = { username: 'foo', password: "foo" }
        request(app)
        .post('/api/v2/login')
        .send(mock_user)
        .end((err, res) => {
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(404);
            done();
        })

    });

});

