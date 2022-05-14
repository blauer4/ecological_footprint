const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');

const router = express.Router();

router.get('',async (req,res)=>{
    let garbage = await garbageActivity.find({});
    let product = await productActivity.find({});

    let resp = [];
    for(item in product){
        resp.push(product[item]);
    }
    res.status(200).json(resp);
});

module.exports = router;