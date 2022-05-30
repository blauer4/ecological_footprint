const express = require('express');
const garbageActivity = require('./models/garbageActivity.js');
const productActivity = require('./models/productActivity.js');
const transportActivity = require('./models/transportActivity.js');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/v1/generalstats:
 *      get:
 *          summary: Gets the total impact of every user aggregated
 *          description: Interrogates the server to have the full impact of the userbase of the service
 *          responses:
 *              '200':
 *                  description: Returns the total impact of the activities present in the database with a JSON object
 *                  content:
 *                      application/json: 
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  total_impact:
 *                                      type: integer
 *                                      description: The total impact of the activities present in the database
 *                          example:
 *                              total_impact: 20000
 */

router.get('', async (req,res)=>{
    let garbage, product, transport;
    garbage = await garbageActivity.find({});
    product = await productActivity.find({});
    transport = await transportActivity.find({});

    let total_impact = 0;
    let resp;
    for(item of product){
        total_impact += item.impact;
    }

    for(item of garbage){
        total_impact += item.impact;
    }

    for(item of transport){
        total_impact += item.impact;
    }
    resp = {"total_impact" : total_impact};
    res.status(200).json(resp);
});

module.exports = router;