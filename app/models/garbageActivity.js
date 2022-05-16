var mongoose = require('mongoose');
const materialSchema = require('./material.js').materialSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('GarbageActivity', new Schema({ 
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    impact: {type: Number, required: true},
	material: materialSchema,
	amount: { type: Number, required: true }
}));
