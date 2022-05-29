const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 
const Material = require('../app/models/material.js').Material; 


const url = process.env.HEROKU || "http://localhost:3000"

describe('Activity insertion testing', () => {

    let validMaterialId;
    let token;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        let user = await User.findOne({});

        // get a valid garbage material id
        let materials = await Material.find({});
        validMaterialId = materials[0].id;


        // create a valid token
        token = jwt.sign( {email: user.email, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing activity insertion with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });
    

    test('Add new garbage activity', (done) => {

        let garbageActivity = { materialId: validMaterialId, amount: 4 }

        request(url)
        .post('/api/v1/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201);
            done();
        })

    });
    

});




