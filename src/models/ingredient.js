// INGREDIENT MODEL
var mongoose = require("mongoose"),
uniqueValidator = require('mongoose-unique-validator');

var IngredientSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    picture: String,
    description: String,
    rate: [{ rateNumber: Number, rateValue : Number }],
    moments: [mongoose.Schema.Types.ObjectId],
    faith: [String],
    values: Number,
    owner: [mongoose.Schema.Types.ObjectId]
});

IngredientSchema.plugin(uniqueValidator);

var Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = {
    Ingredient: Ingredient
}
