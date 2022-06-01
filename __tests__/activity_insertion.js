const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 
const Material = require('../app/models/material.js').Material; 
const Product = require('../app/models/product.js').Product; 

describe('Activity insertion testing', () => {

    let validMaterialId;
    let validProductlId;
    let token;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        console.log(process.env.MONGO_DB_URL)
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        let user = await User.findOne({});

        // get a valid garbage material id
        let material = await Material.findOne({});
        validMaterialId = material.id;

        // get a valid product id
        let product = await Product.findOne({});
        validProductlId = product.id;


        // create a valid token
        token = jwt.sign( {username: user.username, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing activity insertion with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });
    

    test('Add new garbage activity', (done) => {

        let garbageActivity = { materialId: validMaterialId, amount: 4 }

        request(app)
        .post('/api/v1/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201);
            done();
        });

    });

    test('Add new product activity', (done) => {

        let productActivity = { productId: validProductlId, amount: 2 }

        request(app)
        .post('/api/v1/activities/product')
        .set('Cookie', [`token=${token}`])
        .send(productActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201);
            done();
        });

    });
    

});




