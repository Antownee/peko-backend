const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderRequestSchema = new Schema({
    orderRequestID: { type: String, unique: true },
    userID: String,
    confirmed: Boolean,
    requestDate: { type: Date },
    orderStatus: String,
    orderValue: Number,
    teaOrders: [{
        teaName: String,
        weight: Number
    }]
});


const orderRequestModel = mongoose.model('OrderRequest', orderRequestSchema);
module.exports = orderRequestModel;