// PRODUCT MODEL
var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
    name: String,
    picture: String,
    description: String,
    rate: Number,
    moments: [Number],
    brand: String,
    ings: [String],
    values: Number,
    owner: [mongoose.Schema.Types.ObjectId]
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = {
    Product: Product
}
