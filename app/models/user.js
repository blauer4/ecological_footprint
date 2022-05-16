var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userId: { type: String, required: true },
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

var User = mongoose.model("User");

module.exports = {
    User,
    userSchema
};