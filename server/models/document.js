var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var COJdocumentSchema = new Schema({
    documentID: { type: String, unique: true },
    documentName: String,
    orderID: String,
    Submitted: Boolean,
    documentPath: String
    //more details  
});


var cojDocument = mongoose.model('cojDocument', COJdocumentSchema);
module.exports = cojDocument;