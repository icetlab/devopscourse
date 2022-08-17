var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : { type: String },
    category : { type: String },
    price : { type: Number },
    nrReserved: { type: Number },
    nrOrdered: { type: Number }
});

module.exports = mongoose.model('products', productSchema);
