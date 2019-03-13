var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var documentSchema = new Schema({
    name: String,
    path: String
});

var saleSchema = new Schema({
    saleID: { type: String, unique: true },
    userID: String,
    itemsSold: Array, 
    saleStartDate: Date,
    saleCompleteDate: Date ,
    cost: Number,
    documents: [ documentSchema]
});


var saleModel = mongoose.model('Sale', saleSchema);
module.exports = saleModel;