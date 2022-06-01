const request = require('supertest');
const app = require('../app/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../app/models/user.js').User;
const Product = require('../app/models/product.js').Product;


describe("New food insertion", () => {

    let token;
    let realProduct;

    beforeAll(async () => {
        jest.setTimeout(10000);
        app.locals.db = await mongoose.connect(process.env.MONGO_DB_URL);

        // get a valid user from the db
        let user = await User.findOne({});

        // get a valid product
        realProduct = await Product.findOne({});

        // create a valid token
        token = jwt.sign({ username: user.username, id: user.id }, process.env.SUPER_SECRET, { expiresIn: 86400 });

        console.log("Testing food insertion with user " + user.username);
    });

    afterAll(() => { mongoose.connection.close(true); });

    test('GET all existing data', function (done) {

        request(app)
        .get(`/api/v1/products`)
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
        });

    });

    test('Add new valid product', function (done) {

        let randomProductCode = Math.floor(100000 + Math.random() * 900000);

        request(app)
        .post('/api/v1/products')
        .set('Cookie', [`token=${token}`])
        .send({ name: "Random Food", code: randomProductCode })
        .end((err, res) => {
            expect(res.status).toEqual(201);
            let resourceId = res.header.location.substring(res.header.location.lastIndexOf('/') + 1);

            // deletes the mock resource after the insertion
            Product.deleteOne({ _id: resourceId})

            done();
        });

    });


    test('Add product with missing parameters', function (done) {

        request(app)
        .post('/api/v1/products')
        .set('Cookie', [`token=${token}`])
        .send({ name: "", code: "" })
        .end((err, res) => {
            expect(res.status).toEqual(422);
            done();
        });

    });

    test('Get a product by id', (done) => {

        request(app)
        .get(`/api/v1/products/${realProduct.id}`)
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(200);
            done();
        });

    });


    test('Get a product by wrong id', (done) => {

        request(app)
        .get(`/api/v1/products/ffffffffffffffffffffffff`)
        .set('Cookie', [`token=${token}`])
        .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
        });

    });

});
