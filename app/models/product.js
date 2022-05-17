/**
 * @swagger
 * components:
 *      schemas:
 *          Product:
 *              type: object
 *              required:
 *                  - code
 *                  - name
 *                  - unitImpact
 *              properties:
 *                  code:
 *                      type: string
 *                      description: bar-code of the product.
 *                  name: 
 *                      type: string
 *                      description: name of the product
 *                  unitImpact:
 *                      type: integer
 *                      description: The value of the impact of a single unit of the product
 *              example:
 *                  code: 2345678
 *                  name: Kinder Bueno
 *                  unitImpact: 12
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({ 
	code: { type: String, required: true },
	name: { type: String, required: true },
    unitImpact: { type: Number, required: true}
});

var Product = mongoose.model('Product', productSchema);

// set up a mongoose model
module.exports = {
    Product,
    productSchema
};