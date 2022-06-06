const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v2/activities:
 *      get:
 *          summary: Returns all the activities of a specific user
 *          description: Returns all the activities of the logged user. Requires authentication.
 *          parameters:
 *              - in: cookie
 *                name: userId
 *                required: true
 *                description: The userId present in the cookie of the browser login
 *                schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: The list of activities performed by the user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:  
 *                                  type: object
 *                                  properties: 
 *                                      self:
 *                                          type: string
 *                                          description: The link to the activity
 *                                      type:
 *                                          type: string
 *                                          description: The type of the activity
 *                                      date:
 *                                          type: string 
 *                                          description: The date of insertion of the activity 
 *                                      userId:
 *                                          type: string
 *                                          description: The id of the user
 *                          example:
 *                              - self: "/api/v2/activities/product/6285204dec2411e44ef73902"
 *                                type: "product"
 *                                date: "2022-05-18T16:35:25.296Z"
 *                                userId: "628367e9078d0308f8dd76ba"
 *  /api/v2/activities/total_impact:
 *      get:
 *          summary: Returns the total impact of the user
 *          description: Returns the total impact of the logged user. Requires authentication.
 *          parameters:
 *              - in: cookie
 *                name: userId
 *                required: true
 *                description: The userId present in the cookie of the browser login
 *                schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: Returns the total impact of the user with a JSON object
 *                  content:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  total_impact:
 *                                      type: integer
 *                                      description: The total impact of the user
 *                          example:
 *                              total_impact: 210
 */

router.get('', async (req, res) => {
    let garbage = await garbageActivity.find({ userId: req.loggedUser.id });
    let product = await productActivity.find({ userId: req.loggedUser.id });
    let transport = await transportActivity.find({ userId: req.loggedUser.id });

    let resp = [];
    for (item of product) {
        resp.push({
            self: "/api/v2/activities/product/" + item.id,
            type: "product",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of garbage) {
        resp.push({
            self: "/api/v2/activities/garbage/" + item.id,
            type: "garbage",
            date: item.date,
            userId: item.userId
        });
    }

    for (item of transport) {
        resp.push({
            self: "/api/v2/activities/transport/" + item.id,
            type: "transport",
            date: item.date,
            userId: item.userId
        });
    }
    res.status(200).json(resp);
});

router.get('/total_impact', async (req, res) => {

    let userId = req.loggedUser.id;
    let garbage, product, transport;
    
    garbage = await garbageActivity.find({userId: userId});
    product = await productActivity.find({userId: userId});
    transport = await transportActivity.find({userId: userId});
    
    let total_impact = 0;
    let resp;
    for (item of product) {
        total_impact += item.impact;
    }

    for (item of garbage) {
        total_impact += item.impact;
    }

    for (item of transport) {
        total_impact += item.impact;
    }
    resp = { "total_impact": total_impact };
    res.status(200).json(resp);
});

module.exports = router;