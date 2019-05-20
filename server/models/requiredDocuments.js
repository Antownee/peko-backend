var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var COJRequireddocumentSchema = new Schema({
    documentID: { type: String, unique: true },
    documentName: String,
    documentAbbrev: String,
    owner: String //Admin or user
});


var cojRequiredDocument = mongoose.model('cojRequiredDocument', COJRequireddocumentSchema);
module.exports = cojRequiredDocument;