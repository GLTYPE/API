// PRODUCT MODEL
var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String,
    rate: [Number],
    moments: [Number],
    brand: String,
    ings: [mongoose.Schema.Types.ObjectId],
    values: Number,
    owner: mongoose.Schema.Types.ObjectId
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = {
    Product: Product
}
