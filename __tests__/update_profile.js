const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 

describe('Update user profile data', () => {

    let token;
    let user;
    let user2;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        user = await User.findOne({});
        user2 = await User.findOne({}).skip(1);

        // create a valid token
        token = jwt.sign( {email: user.email, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing profile update with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });
    

    test('Update personal info with missing parameter', (done) => {

        let updatedUser = { 
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: ""  // missing email
        }

        request(app)
        .put('/api/v1/users/update_profile')
        .set('Cookie', [`token=${token}`])
        .send(updatedUser)
        .end((err, res) => {
            expect(res.status).toEqual(422);
            done();
        });

    });

    test('Update username with an existing one', (done) => {

        let updatedUser = { 
            username: user2.username,
            name: user2.name,
            surname: user2.surname,
            email: user2.email
        }

        request(app)
        .put('/api/v1/users/update_profile')
        .set('Cookie', [`token=${token}`])
        .send(updatedUser)
        .end((err, res) => {
            expect(res.status).toEqual(409);
            expect(res.body.success).toEqual(false);
            done();
        });

    });


});




