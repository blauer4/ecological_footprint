var mongoose = require('mongoose');
const productSchema = require('./product').productSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('ProductActivity', new Schema({ 
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    impact: {type: Number, required: true},
	product: productSchema,
}));
