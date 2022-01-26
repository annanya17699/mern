const express = require("express");
const validator = require('express-validator')

const placesController = require('../controller/places-controller')

const router = express.Router();

const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/check-auth')

router.get('/:pid', placesController.getPlaceById)

router.get('/user/:uid', placesController.getPlaceByUserId )

router.use(checkAuth);

router.post('/',
fileUpload.single('image'),
[validator.check('title')
.not()
.isEmpty(),
validator.check('description')
.isLength({min: 5}),
validator.check('address')
.not()
.isEmpty()
],
placesController.createPlace)

router.patch(
 '/:pid', 
[validator.check('title')
.not()
.isEmpty(),
validator.check('description')
.isLength({min: 5})
]
, placesController.updatePlaceById)

router.delete('/:pid', placesController.deletePlace)

module.exports = router;