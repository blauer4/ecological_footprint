const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User;
const url = process.env.HEROKU || "http://localhost:3000"

describe('Follow user test', () => {

    let token, userId, follower;

    beforeAll(async () => {
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL);

        // get a valid user from the db
        let user = await User.findOne({});
        userId = user.id;
        follower = await User.findOne({_id:{ $nin: [userId] }});

        // create a valid token
        token = jwt.sign({ email: user.email, id: user.id }, process.env.SUPER_SECRET, { expiresIn: 86400 });
        console.log(follower);
        console.log("Testing follow user with user " + user.username);
    });


    afterAll(async () => {
        await User.findOneAndUpdate({ _id: userId }, { $pull: { friends: {id: follower._id} } }, false);
        await mongoose.disconnect();
    });

    it('Follow myself', function (done) {

        request(url)
        .put('/api/v2/friends')
        .set('Cookie', [`token=${token}`])
        .send({ userId: userId })
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    it('Follow another user', (done) => {
        
        request(url)
        .put('/api/v2/friends/')
        .set('Cookie', [`token=${token}`])
        .send({ userId: follower._id.toString() })
        .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
        });
    });

    it('Follow a user that is already followed', (done) => {

        request(url)
        .put('/api/v2/friends/')
        .set('Cookie', [`token=${token}`])
        .send({ userId: follower._id.toString() })
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('Follow a user that does not exist', (done) => {

        request(url)
        .put('/api/v2/friends/')
        .set('Cookie', [`token=${token}`])
        .send({ userId: "5c7b9f9b4a3b4f2b8f7d8a6a" })
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });
    });
});