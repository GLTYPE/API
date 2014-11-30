// INGREDIENT MODEL
var mongoose = require("mongoose");

var IngredientSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    picture: String,
    description: String,
    rate: [{ rateNumber: Number, rateValue : Number }],
    moments: [mongoose.Schema.Types.ObjectId],
    faith: [String],
    values: Number
});

var Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = {
    Ingredient: Ingredient
}
