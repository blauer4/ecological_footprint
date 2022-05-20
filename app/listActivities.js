const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

router.get('', async (req, res) => {
    let garbage = await garbageActivity.find({});
    let product = await productActivity.find({});
    let transport = await transportActivity.find({});
    // TODO: Select only authenticated
    let resp = [];
    for (item of product) {
        resp.push({
            self: "/api/v1/activities/product/" + item.id,
            type: "product",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of garbage) {
        resp.push({
            self: "/api/v1/activities/garbage/" + item.id,
            type: "garbage",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of transport) {
        resp.push({
            self: "/api/v1/activities/transport/" + item.id,
            type: "transport",
            date: item.date,
            userId: item.userId
        });
    }
    res.status(200).json(resp);
});

router.get('/total_impact', async (req, res) => {

    let userId = req.cookies['userId'];
    let garbage, product, transport;
    let search = false;
    if (userId) {
        search = { userId: userId };
    }
    garbage = await garbageActivity.find(search ? search : {});
    product = await productActivity.find(search ? search : {});
    transport = await transportActivity.find(search ? search : {});
    // TODO: Select only authenticated
    let total_impact = 0;
    let resp;
    for (item of product) {
        total_impact += item.impact;
    }

    for (item of garbage) {
        total_impact += item.impact;
    }

    for (item of transport) {
        total_impact += item.impact;
    }
    resp = { "total_impact": total_impact };
    res.status(200).json(resp);
});

module.exports = router;