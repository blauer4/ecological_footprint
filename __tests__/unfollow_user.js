const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User;

describe('Follow user test', () => {

    let token, userId, follower, no_follower;

    beforeAll(async () => {
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL);

        // get a valid user from the db
        let user = await User.findOne({});
        userId = user.id;

        no_follower = [userId];

        for (friend of user.friends) {
            no_follower.push(friend.id.toString());
        }

        follower = await User.findOne({_id:{ $nin: no_follower }});
        await User.findByIdAndUpdate(userId, {$push: {friends: {id: follower._id, username: follower.username}}});
        // create a valid token
        token = jwt.sign({ email: user.email, id: user.id }, process.env.SUPER_SECRET, { expiresIn: 86400 });
        
        console.log("Testing unfollow user with user " + user.username);
    });


    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('Unfollow a user that is already followed', (done) => {
            
        request(app)
        .delete('/api/v2/friends/' + follower._id.toString())
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
        });
    });

    it('Unfollow a user that is not followed', (done) => {

        request(app)
        .delete('/api/v2/friends/ffffffffffffffffffffffff')
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });
    });

    it('Unfollow without parameters', (done) => {
            
        request(app)
        .delete('/api/v2/friends/')
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });
    });
});