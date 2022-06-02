/**
 * @swagger
 * paths:
 *  /api/v1/activities/product:
 *      get:
 *          summary: Returns all the product activities
 *          description: Returns all the product activities 
 *          responses:
 *              '200':
 *                  description: Returns the product activities in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/ProductActivity"
 *      post:
 *          summary: Insert a new product activity
 *          description: Returns the link to the resource created. Requires authentication
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              productlId:
 *                                  type: string
 *                                  description: The id of the product that you want to insert into the activity
 *                              amount:
 *                                  type: integer
 *                                  description: The amount of the product you want to insert into the activity
 *                              userId:
 *                                  type: string
 *                                  description: The userId of the user
 *          responses:
 *              '201': 
 *                  description: Return the link to the resource that i created
 *              '400': 
 *                  description: A required parameter is missing
 *              '404':
 *                  description: The product that is inserted in the activity is not present in the database
 *  /api/v1/activities/product/{id}:
 *      get:
 *          summary: Returns one product activity
 *          description: Returns one product activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the product activity to be found.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Returns one product activity in JSON format described as in the model
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: "#/components/schemas/GarbageActivity"
 *      delete:
 *          summary: Deletes one product activity
 *          description: Deletes one product activity associated with the given ID
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: The id of the product activity to be deleted.
 *              schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Deleted the given product activity
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "OK"
 *              '404':
 *                  description: The given product was not deleted
 *                  content: 
 *                      text/html:
 *                          schema:
 *                              type: string
 *                              example: "Fail"
 */

const express = require('express');
const ProductActivity = require('./models/productActivity.js');
const Product = require('./models/product.js').Product;
const User = require('./models/user.js').User;
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

    let userId = req.loggedUser.id;
    let productId = req.body["productId"];
    let amount = req.body["amount"];

    if (!productId || !amount){
        console.error("The productId and amount are required");
        res.status(400).send("The productId and amount are required");
        return;
    }

    if (isNaN(amount) || amount <= 0){
        console.error("The amount must be a positive number");
        res.status(400).send("The amount must be a positive number");
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

    await User.findByIdAndUpdate(userId,{$inc: {totalImpact: impact}});

    /**
     * Return the link to the newly created resource 
     */
    res.location("/api/v1/activities/product/" + activity.id).status(201).send();
});

router.delete('/:id', async (req, res) => {
    let id = req.params["id"];
    let userId = req.loggedUser.id;
    let product = await ProductActivity.findById(id);

    if(product){
        await User.findByIdAndUpdate(userId,{$inc: {totalImpact: -product.impact}});
    }
    
    let result = await ProductActivity.deleteOne({_id: id});
    if (result.deletedCount == 1){
        console.log(`Documento con id ${id} eliminato con successo`);
        res.send("OK");
    }else{
        console.error(`ERRORE: eliminazione documento con attivita'(product) con id ${id}`);
        res.status(404).send("Fail");
    }
    
});

module.exports = router;
