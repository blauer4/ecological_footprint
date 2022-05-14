const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');

const router = express.Router();

router.get('',async (req,res)=>{
    let garbage = await garbageActivity.find({});
    let product = await productActivity.find({});
    // TODO: Select only authenticated
    let resp = [];
    for(item of product){
        resp.push({
            ref: "/api/v1/activities/products/" + item.id,
            type: "product",
        });
    }

    for(item of garbage){
        resp.push({
            ref: "/api/v1/activities/materials/" + item.id,
            type: "materials",
        });
    }
    
    res.status(200).json(resp);
});

module.exports = router;