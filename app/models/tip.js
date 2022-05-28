/**
 * @swagger
 * components:
 *      schemas:
 *          Tip:
 *              type: object
 *              required:
 *                  - text
 *              properties:
 *                  text:
 *                      type: string
 *                      description: the message contained in the tip
 *              example:
 *                  message: Use a bike instead of the car
 */

 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 
 var tipSchema = new Schema({ 
    text: { type: String, required: true }
 });
 
 var Tip = mongoose.model('Tip', tipSchema);
 
 // set up a mongoose model
 module.exports = {
    Tip,
     tipSchema
 };