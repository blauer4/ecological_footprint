const express = require('express');
const ProductActivity = require('./models/productActivity.js');
const Product = require('./models/product.js').Product;
const router = express.Router();

router.get('', async (req, res) => {

    let activities = await ProductActivity.find({});

    res.status(200).json(activities);
});

router.get('/:id', async (req, res) => {

    let activity = await ProductActivity.findById(req.params.id);

    res.status(200).json(activity);
});


module.exports = router;
