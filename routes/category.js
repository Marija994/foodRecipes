const express = require('express');

const Category = require('../models/category');

const categoryController = require('../controllers/category');

const router = express.Router();


router.get('/', categoryController.getCategorys);

router.get('/:id', categoryController.getCategory);


module.exports = router;