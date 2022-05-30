const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 
const url = process.env.HEROKU || "http://localhost:3000"

describe('Follow user test', () => {
    
        let token, userId;
    
        beforeAll( async () => { 
            jest.setTimeout(10000);
            app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 
    
            // get a valid user from the db
            let user = await User.findOne({});
            userId = user._id;

            token = jwt.sign({ userId: user._id }, process.env.SUPER_SECRET, { expiresIn: '1h' });
        });

        afterAll( async () => {
            await mongoose.disconnect();
        });

        it('Follow myself', async (done) => {
            request(url)
            .put('/api/v2/friends/')
            .set('Cookie', [`token=${token}`])
            .send({ userId: userId })
            .end((err, res) => {
                expect(res.status).toEqual(400);
                done();
            });
        });
});