/**
 * @swagger
 *  paths:
 *      /api/v2/products:
 *          get:
 *              summary: Retrieve all the products present in the database
 *              description: Returns a json object with the resource link and the name of the product
 *              responses:
 *                  '200': 
 *                      description: Returns a json object with self link of the resource and the name of the product
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties: 
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the api resource
 *                                      name: 
 *                                          type: string
 *                                          description: The name of the product given
 *          post:
 *              summary: Insert a new product
 *              description: Returns the link to the resource created, or, if it already exists, returns the link to the resource in the database. Requires authentication
 *              requestBody:
 *                  required: true
 *                  content: 
 *                      application/x-www-form-urlencoded:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  code:
 *                                      type: string
 *                                      description: The code of the product that you want to insert
 *                                  name:
 *                                      type: string
 *                                      description: The name of the product you want to insert
 *              responses:
 *                  '201': 
 *                      description: Return the link to the resource that i created or found
 *      /api/v2/products/{id}:
 *          get:
 *              summary: Get the specified product by ID
 *              description: Returns a product with lots of information like name, code, and impact of the product. Requires authentication
 *              parameters:
 *                  - in: path
 *                    name: id
 *                    required: true
 *                    description: The id of the correspondent product you would like to search for
 *                    schema: 
 *                      type: string
 *              responses:
 *                  '200': 
 *                      description: Return the json of the before mentioned properties of the product
 *                      content:
 *                          application/json:
 *                              schema:
 *                                  type: object
 *                                  properties:
 *                                      self: 
 *                                          type: string
 *                                          description: The link to the api resource
 *                                      name: 
 *                                          type: string
 *                                          description: The name of the product given
 *                                      code: 
 *                                          type: string
 *                                          description: The code of the product given
 *                                      unitImpact: 
 *                                          type: integer
 *                                          description: The impact of the product given
 *                  '404':
 *                      description: The specified product doesn't exist
 */

const express = require('express');
const router = express.Router();
const Product = require('./models/product.js').Product; 

router.get('', async (req, res) => {

    let products = await Product.find({});
    products = products.map( (product) => {
        return {
            self: '/api/v2/products/' + product["_id"],
            name: product["name"]
        };
    });

    res.status(200).json(products);
});

router.get('/:id', async (req, res) => {

    let product = await Product.findById(req.params.id);

    if (!product){
        res.status(404).send("Product not found");
        return;
    }

    product = {
        self: '/api/v2/products/' + product.id,
        name: product["name"],
        code: product["code"],
        unitImpact: product["unitImpact"]
    }

    res.status(200).json(product);
});

router.post('', async (req, res) => {

	let code = req.body["code"];
	let name = req.body["name"];
	let unitImpact = Math.floor(Math.random() * 20 + 1); // the unit impact is a random number between 1 and 20

    if (!code || !name){
        console.error("The product code and name are required");
        res.status(422).send("The product code and name are required");
        return;
    }

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
        res.location("/api/v2/products/" + newProductId).status(201).send();
        return;
    }

    /**
     * Return the link to the existing resource 
     */
    res.location("/api/v2/products/" + products[0].id).status(201).send();
});

module.exports = router;
