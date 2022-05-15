/**
 * Gestione inserimento e listaggio dei prodotti presenti nel db
 */

const express = require('express');
const router = express.Router();
const Product = require('./models/product.js').Product; 

router.get('', async (req, res) => {

    let products = await Product.find({});
    products = products.map( (product) => {
        return {
            self: '/api/v1/products/' + product["_id"],
            name: product["name"]
        };
    });

    res.status(200).json(products);
});

router.get('/:id', async (req, res) => {

    let product = await Product.findById(req.params.id);
    product = {
        self: '/api/v1/products/' + product.id,
        name: product["name"],
        code: product["code"],
        unitImpact: product["unitImpact"]
    }

    res.status(200).json(product);
});

router.post('', async (req, res) => {

	let code = req.body["code"];
	let name = req.body["name"];
	let unitImpact = req.body["unitImpact"];

    // if the product doesn't already exists in the DB add it
    let products = await Product.find({code: code, name: name});

    if(products.length == 0){ // product not already in the database
        let newProduct = new Product({
            code: code,
            name: name,
            unitImpact: unitImpact
        });
    
        newProduct = await newProduct.save();
        let newProductId = newProduct.id;
    
        /**
         * Return the link to the newly created resource 
         */
        res.location("/api/v1/products/" + newProductId).status(201).send();
    }

    /**
     * Return the link to the existing resource 
     */
    res.location("/api/v1/products/" + products[0].id).status(201).send();
});

module.exports = router;
