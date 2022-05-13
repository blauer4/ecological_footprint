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

router.post('', async (req, res) => {

    let userId = req.body["userId"];
    let productId = req.body["productId"];
    let amount = req.body["amount"];

    let product = await Product.findById(productId);
    
    //TODO calculation of a random impact 
    let impact = product.unitImpact * amount;


    var newActivity = new ProductActivity({
        userId: userId,
        amount: amount,
        impact: impact,
        product: product
    });
    
    activity = await newActivity.save();

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/products/" + activity.id).status(201).send();
});

module.exports = router;
