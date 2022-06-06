const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 
const Material = require('../app/models/material.js').Material; 
const Product = require('../app/models/product.js').Product; 
const Vehicle = require('../app/models/vehicle.js').Vehicle; 

const ProductActivity = require('../app/models/productActivity.js'); 
const GarbageActivity = require('../app/models/garbageActivity.js'); 
const TransportActivity = require('../app/models/productActivity.js'); 

describe('Activity insertion testing', () => {

    let validMaterialId;
    let validProductId;
    let validVehicleId;
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
        validProductId = product.id;

        // get a valid vehicle id
        let vehicle = await Vehicle.findOne({});
        validVehicleId = vehicle.id;


        // create a valid token
        token = jwt.sign( {username: user.username, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing activity insertion with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });
    


    // Product activity
    test('Add new valid product activity', (done) => {

        let productActivity = { productId: validProductId, amount: 2 }

        request(app)
        .post('/api/v2/activities/product')
        .set('Cookie', [`token=${token}`])
        .send(productActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201)
            let resourceId = res.headers.location.substring(res.headers.location.lastIndexOf('/') + 1);
            ProductActivity.deleteOne({_id: resourceId});
            done();
        });

    });

    test('Add new product activity without quantity', (done) => {

        let productActivity = { productId: validProductId, amount: "" }

        request(app)
        .post('/api/v2/activities/product')
        .set('Cookie', [`token=${token}`])
        .send(productActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new product activity with negative quantity', (done) => {

        let productActivity = { productId: validProductId, amount: -5 }

        request(app)
        .post('/api/v2/activities/product')
        .set('Cookie', [`token=${token}`])
        .send(productActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new product activity with non existing product id', (done) => {

        let productActivity = { productId: "ffffffffffffffffffffffff", amount: 5 }

        request(app)
        .post('/api/v2/activities/product')
        .set('Cookie', [`token=${token}`])
        .send(productActivity)
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });

    });

    // Transport activity
    test('Add new valid transport activity', (done) => {

        let transportActivity = { vehicleId: validVehicleId, distance: 2 }

        request(app)
        .post('/api/v2/activities/transport')
        .set('Cookie', [`token=${token}`])
        .send(transportActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201);
            let resourceId = res.headers.location.substring(res.headers.location.lastIndexOf('/') + 1);
            TransportActivity.deleteOne({_id: resourceId});
            done();
        });

    });

    test('Add new transport activity without distance', (done) => {

        let transportActivity = { vehicleId: validVehicleId, distance: "" }

        request(app)
        .post('/api/v2/activities/transport')
        .set('Cookie', [`token=${token}`])
        .send(transportActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new transport activity with negative distance', (done) => {

        let transportActivity = { vehicleId: validVehicleId, distance: -5 }

        request(app)
        .post('/api/v2/activities/transport')
        .set('Cookie', [`token=${token}`])
        .send(transportActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new transport activity with non existing vehicle id', (done) => {

        let transportActivity = { vehicleId: "ffffffffffffffffffffffff", distance: 5 }

        request(app)
        .post('/api/v2/activities/transport')
        .set('Cookie', [`token=${token}`])
        .send(transportActivity)
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });

    });

    // Garbage activity
    test('Add new valid garbage activity', (done) => {

        let garbageActivity = { materialId: validMaterialId, amount: 4 }

        request(app)
        .post('/api/v2/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(201);
            let resourceId = res.headers.location.substring(res.headers.location.lastIndexOf('/') + 1);
            GarbageActivity.deleteOne({_id: resourceId});
            done();
        });

    });

    test('Add new garbage without amount', (done) => {

        let garbageActivity = { materialId: validMaterialId, amount: "" }

        request(app)
        .post('/api/v2/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new garbage with negative amount', (done) => {

        let garbageActivity = { materialId: validMaterialId, amount: -5 }

        request(app)
        .post('/api/v2/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
        });

    });

    test('Add new garbage with non existing material id', (done) => {

        let garbageActivity = { materialId: "ffffffffffffffffffffffff", amount: 5 }

        request(app)
        .post('/api/v2/activities/garbage')
        .set('Cookie', [`token=${token}`])
        .send(garbageActivity)
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });

    });

    

});




