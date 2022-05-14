var mongoose = require('mongoose');
const vehicleSchema = require('./vehicle.js').vehicleSchema;
var Schema = mongoose.Schema;

module.exports = mongoose.model('TransportActivity', new Schema({ 
    userId: { type: String, required: true },
    impact: {type: Number, required: true},
	distance: { type: Number, required: true },
    vehicle: vehicleSchema
}));