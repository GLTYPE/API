// RECEIPE MODEL
var mongoose = require("mongoose");

var ReceipeSchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String,
    rate: [Number],
    moments: [mongoose.Schema.Types.ObjectId],
    ings: [mongoose.Schema.Types.ObjectId],
    values: Number,
    owner: mongoose.Schema.Types.ObjectId
});

var Receipe = mongoose.model('Receipe', ReceipeSchema);

module.exports = {
    Receipe: Receipe
}
