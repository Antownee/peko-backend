var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contractSchema = new Schema({
    constractID: { type: String, unique: true },
    contractTitle: String,
    constractDescription: String,
    contractValue: Number,
    currentContractPaidAmount: Number,
    dateInitiated: Date,
    dateofExpiry: Date,
    constractDocuments: [{
        fileName: String,
        documentCode: String,
        dateAdded: Date
    }],
    //more details  
});


var contract = mongoose.model('contract', contractSchema);
module.exports = contract;