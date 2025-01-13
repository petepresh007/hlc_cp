const express = require('express');
const router = express.Router();
const {createFinance, editFinance} = require('../controllers/finance');
const {adminProtect} = require('../middleware/auth');


router.post('/create', adminProtect, createFinance)
router.put('/edit/:id', adminProtect, editFinance)


module.exports = router;