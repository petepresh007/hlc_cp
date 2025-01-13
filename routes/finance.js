const express = require('express');
const router = express.Router();
const {createFinance, editFinance, deleteFinance} = require('../controllers/finance');
const {adminProtect} = require('../middleware/auth');


router.post('/create', adminProtect, createFinance);
router.put('/edit/:id', adminProtect, editFinance);
router.delete('/del/:id', adminProtect, deleteFinance);


module.exports = router;