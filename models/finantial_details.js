const mongoose = require('mongoose');


const Finance = new mongoose.Schema({
  totaloanBalance: {
    type: Number,
    required: [true, 'total balance is required...'],
    default: 0
  },
  totalSavingsBalance: {
    type: Number,
    required: [true, 'total saving is required...'],
    default: 0
  },
  monthlySavingsDeduction: {
    type: Number,
    required: [true, 'total monthly savings is required...'],
    default: 0
  },
  monthlyLoanDeduction: {
    type: Number,
    required: [true, 'total monthly loan is required...'],
    default: 0
  },
  decemberPurchaseDeduction:{
    type: Number,
    required: [true, 'total december purchase deduction is required...'],
    default: 0
  },
  septemberPurchaseDeduction: {
    type: Number,
    required: [true, 'total september purchase deduction is required...'],
    default: 0
  },
  totalDeduction: {
    type: Number,
    required: [true, 'total deduction is required...']
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "please enter member id"]
  }
}, {timestamps: true})


module.exports = mongoose.model('Finance', Finance);
