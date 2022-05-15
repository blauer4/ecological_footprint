/**
 * Gestione inserimento e listaggio dei prodotti presenti nel db
 */

const express = require('express');
const router = express.Router();
const Product = require('./models/product.js').Product; 

router.get('', async (req, res) => {

    let products = await Product.find({});

    res.status(200).json(products);
});

router.get('/:id', async (req, res) => {

    let product = await Product.findById(req.params.id);

    res.status(200).json(product);
});


module.exports = router;
