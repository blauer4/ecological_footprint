const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

router.get('/total_impact', async (req,res)=>{
    let garbage, product, transport;
    garbage = await garbageActivity.find({});
    product = await productActivity.find({});
    transport = await transportActivity.find({});
    // TODO: Select only authenticated
    let total_impact = 0;
    let resp;
    for(item of product){
        total_impact += item.impact;
    }

    for(item of garbage){
        total_impact += item.impact;
    }

    for(item of transport){
        total_impact += item.impact;
    }
    resp = {"total_impact" : total_impact};
    res.status(200).json(resp);
});

module.exports = router;