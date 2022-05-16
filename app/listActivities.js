const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

router.get('',async (req,res)=>{
    let garbage = await garbageActivity.find({});
    let product = await productActivity.find({});
    let transport = await transportActivity.find({});
    // TODO: Select only authenticated
    let resp = [];
    for(item of product){
        resp.push({
            self: "/api/v1/activities/products/" + item.id,
            type: "product",
            date: item.date
        });
    }

    for(item of garbage){
        resp.push({
            self: "/api/v1/activities/materials/" + item.id,
            type: "materials",
            date: item.date
        });
    }

    for(item of transport){
        resp.push({
            self: "/api/v1/activities/transport/" + item.id,
            type: "transport",
            date: item.date
        });
    }

    res.status(200).json(resp);
});

module.exports = router;