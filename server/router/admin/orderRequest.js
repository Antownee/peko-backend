const express = require('express');
const router = express.Router();
const multer = require('multer');
const worker = require("../../utils/bgworkers/worker");
const orderService = require("../../utils/orderService");
let documentNames = [];


const storage = multer.diskStorage({
    fileFilter: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        if (extension !== "pdf") {
            return cb(new Error('Only pdf files are allowed!'), false);
        }
        cb(null, true);
    },
    destination: function (req, file, cb) {
        cb(null, './documents')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let fullName = `${file.originalname}.${extension}`;
        documentNames.push({ path: fullName });
        cb(null, fullName)
    }
})
const upload = multer({ storage: storage }).array('file');

//Might be useful later
router.post('/', (req, res, next) => {
    orderService.addOrder(req.body)
        .then(user => user ? res.json(user) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
});

router.post('/all', (req, res, next) => {
    orderService.getAllOrdersAdmin()
        .then(orders => orders ? res.json(orders) : res.status(404).send({ error: 'Try again later' }))
        .catch(err => next(err));
})


router.post('/confirm', (req, res, next) => {
    orderService.confirmOrder(req.body)
        .then((ord) => {
            if (ord) {
                res.send({ msg: 'Order confirmed' });

                //Trigger a background process to send the emails
                orderService.getEmails()
                    .then((em) => emailNotifier(em,ord));
            } else {
                res.status(404).send({ error: 'Try again later' });
            }
        })
        .catch(err => next(err));
})


router.post('/documents', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        orderService.uploadDocuments(documentNames)
            .then((msg) => {
                documentNames = [];
                msg.nModified === 1 ? res.send({ msg: 'Documents successfully submitted' }) : res.status(404).send({ error: 'Try again later' });

            })
            .catch((err) => {
                res.status(404).send({ error: 'Try again later' });
                next(err);
            });
    })
})


function emailNotifier(em, order) {
    for (index = 0; index < em.length; ++index) {
        worker.addEmailJob(em[index].email, order);
    }
}



module.exports = router;
