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
 *                      type: object
 *                      properties:
 *                          code:
 *                              type: string
 *                              description: barcode of the product
 *                          name:
 *                              type: string
 *                              description: name of the ptoduct
 *                          unitImpact:
 *                              type: integer
 *                              description: impact of a single unit of the product
 *              example:
 *                      userId: 56789wdfefe
 *                      date: 2022-05-17T12:46:47.215Z
 *                      amount: 1
 *                      impact: 12
 *                      product: {2345678, Kinder Bueno, 12}
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
