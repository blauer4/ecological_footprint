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