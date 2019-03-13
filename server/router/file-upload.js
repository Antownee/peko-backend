const upload = require('multer');
var express = require('express');
const faker = require('faker');
var router = express.Router();

const storage = multer.diskStorage({
    destination: '../uploads/documents'
});

router.post('', upload.single("document"),(req,res)=>{
    if (req.file) {
        console.log('Uploading file...');
        var filename = req.file.filename;
        var uploadStatus = 'File Uploaded Successfully';
    } else {
        console.log('No File Uploaded');
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    }

})

module.exports = router;