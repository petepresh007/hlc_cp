const mongoose = require('mongoose');


const Finance = new mongoose.Schema({
  totaloanBalance: {
    type: Number,
    required: [true, 'total balance is required...']
  },
  totalSavingsBalance: {
    type: Number,
    required: [true, 'total saving is required...']
  },
  monthlySavingsDeduction: {
    type: Number,
    required: [true, 'total monthly savings is required...']
  },
  monthlyLoanDeduction: {
    type: Number,
    required: [true, 'total monthly loan is required...']
  },
  decemberPurchaseDeduction:{
    type: Number,
    required: [true, 'total december purchase deduction is required...']
  },
  septemberPurchaseDeduction: {
    type: Number,
    required: [true, 'total september purchase deduction is required...']
  },
  totalDeduction: {
    type: Number,
    required: [true, 'total deduction is required...']
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


module.exports = mongoose.model('Finance', Finance);