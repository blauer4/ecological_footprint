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

    if (!productId || !amount){
        console.error("The productId and amount are required");
        res.status(400).send("The productActivity productId and amount are required");
        return;
    }

    let product = await Product.findById(productId);
    if (!productId){
        console.error("The product you are trying to add doesn't exists");
        res.status(404).send("The product you are trying to add doesn't exists");
        return;
    }
    
    // impact calculation
    let impact = product.unitImpact * amount;

    var newActivity = new ProductActivity({
        userId: userId,
        date: Date.now(),
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

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];

    let result = await ProductActivity.deleteOne({_id: id});
    if (result.deletedCount == 1){
        console.log(`Documento con id ${id} eliminato con successo`);
        res.send("OK");
    }else{
        console.error(`ERRORE: eliminazione documento con attivita'(product) con id ${id}`);
        res.send("Fail");
    }
    
});

module.exports = router;
