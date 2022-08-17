var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderRef : { type: String },
    totalPrice : { type: Number },
    productsList : [
        {
        type: String,
        ref: "Product"
        }
    ],
    orderStatus : { type: String }
});

module.exports = mongoose.model('orders', orderSchema);

