/**
 * @swagger
 * components:
 *      schemas:
 *          ProductActivity:
 *              type: object
 *              required:
 *                  - userId
 *                  - date
 *                  - amount
 *                  - impact
 *                  - product
 *              properties:
 *                  userId:
 *                      type: string
 *                      description: id of this single product activity
 *                  date:
 *                      type: string
 *                      format: date
 *                      description: date of insertion of the specific product activity
 *                  amount:
 *                      type: integer
 *                      description: amount of the product consumption
 *                  impact:
 *                      type: integer
 *                      description: impact of the activity. This value is calculated multiplying the amount of product with the value of the impact of the single product
 *                  product: 
 *                      $ref: "#/components/schemas/Product"
 *              example:
 *                      userId: 56789wdfefe
 *                      date: 2022-05-17T12:46:47.215Z
 *                      amount: 1
 *                      impact: 12
 *                      product: {code: 2345678, name: Kinder Bueno, unitImpact: 12}
 */ 

var mongoose = require('mongoose');
const productSchema = require('./product').productSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('ProductActivity', new Schema({ 
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    impact: {type: Number, required: true},
	product: productSchema,
}));
