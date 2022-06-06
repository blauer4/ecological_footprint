const request = require('supertest');
const app = require('../app/app.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../app/models/user.js').User; 
const GarbageActivity = require('../app/models/garbageActivity.js'); 
const ProductActivity = require('../app/models/productActivity.js'); 
const TransportActivity = require('../app/models/transportActivity.js'); 
const Vehicle = require('../app/models/vehicle.js').Vehicle; 
const Material = require('../app/models/material.js').Material; 
const Product = require('../app/models/product.js').Product; 


describe('Remove an activity', () => {

    let rm_garbagea_id, rm_producta_id, rm_transporta_id;
    let impact_garbagea_id, impact_producta_id, impact_transporta_id;
    let token, previous_total_impact = 0, userId;

    beforeAll( async () => { 
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL); 

        // get a valid user from the db
        let user = await User.findOne({});
        let material = await Material.findOne({});
        userId = user._id;

        let garbageActivity = new GarbageActivity({
            userId: user._id,
            date: Date.now(),
            material: material,
            amount: 1,
            impact: material.unitImpact
        });
        
        activity = await garbageActivity.save();
        rm_garbagea_id = activity._id.toString();
        impact_garbagea_id = activity.impact;

        let product = await Product.findOne({});

        let productActivity = new ProductActivity({
            userId: user._id,
            date: Date.now(),
            product: product,
            amount: 1,
            impact: product.unitImpact
        });
        
        activity = await productActivity.save();
        rm_producta_id = activity._id.toString();
        impact_producta_id = activity.impact;

        let vehicle = await Vehicle.findOne({});

        let transportActivity = new TransportActivity({
            userId: user._id,
            date: Date.now(),
            vehicle: vehicle,
            distance: 1,
            impact: vehicle.unitImpact
        });
        
        activity = await transportActivity.save();
        rm_transporta_id = activity._id.toString();
        impact_transporta_id = activity.impact;
        previous_total_impact = user.totalImpact + impact_garbagea_id + impact_producta_id + impact_transporta_id;
        await User.findByIdAndUpdate(userId, {$inc: {totalImpact: impact_garbagea_id + impact_producta_id + impact_transporta_id}});
        
        // create a valid token
        token = jwt.sign( {username: user.username, id: user.id}, process.env.SUPER_SECRET, {expiresIn: 86400} ); 

        console.log("Testing remove insertion with user " + user.username);
    });

    afterAll( () => { mongoose.connection.close(true); });

    it('Remove a valid garbage activity and check the impact is calculated correctly', (done) => {

        request(app)
        .delete('/api/v2/activities/garbage/' + rm_garbagea_id)
        .set('Cookie', [`token=${token}`])
        .end(async (err, res) => {
            expect(res.status).toEqual(200);
            user = await User.findById(userId);
            expect(user.totalImpact).toEqual(previous_total_impact - impact_garbagea_id);
            done();
        })

    });

    it('Remove a valid transport activity and check the impact is calculated correctly', (done) => {

        request(app)
        .delete('/api/v2/activities/transport/' + rm_transporta_id)
        .set('Cookie', [`token=${token}`])
        .end(async (err, res) => {
            expect(res.status).toEqual(200);
            user = await User.findById(userId);
            expect(user.totalImpact).toEqual(previous_total_impact - impact_transporta_id - impact_garbagea_id);
            done();
        })

    });

    it('Remove a valid product activity and check the impact is calculated correctly', (done) => {

        request(app)
        .delete('/api/v2/activities/product/' + rm_producta_id)
        .set('Cookie', [`token=${token}`])
        .end(async (err, res) => {
            expect(res.status).toEqual(200);
            user = await User.findById(userId);
            expect(user.totalImpact).toEqual(previous_total_impact - impact_producta_id - impact_transporta_id - impact_garbagea_id);
            done();
        })

    });

    it('Remove an non-existing item', (done) => {
        
        request(app)
        .delete('/api/v2/activities/product/' + rm_producta_id)
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        })

    });

});