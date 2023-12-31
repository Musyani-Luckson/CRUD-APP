const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const productSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    currPrice: {
        type: Number,
        required: true,
    },
    prevPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
})
const Product = mongoose.model("Products", productSchema);
module.exports = Product;