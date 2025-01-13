const Finance = require("../models/finantial_details");
const { BadrequestError, ConflictError, NotFoundError } = require("../errors");
const User = require("../models/user");

//create finance
const createFinance = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("No user was found with the provided id");
    }
    const {
      totaloanBalance,
      totalSavingsBalance,
      monthlySavingsDeduction,
      monthlyLoanDeduction,
      decemberPurchaseDeduction,
      septemberPurchaseDeduction,
      member_id,
    } = req.body;
    // if (
    //   !totaloanBalance ||
    //   !totalSavingsBalance ||
    //   !monthlySavingsDeduction ||
    //   !monthlyLoanDeduction ||
    //   !decemberPurchaseDeduction ||
    //   !septemberPurchaseDeduction ||
    //   !member_id
    // ) {
    //   throw new BadrequestError("all fields are required...");
    // }

    const existingFinance = await Finance.findOne({ totalSavingsBalance });
    if (existingFinance) {
      throw new ConflictError("The users total account balance is not valid");
    }
    const user = await User.findById(member_id);

    if (!user) {
      throw new NotFoundError("No user was found with the provided id...");
    }
    const newFinance = new Finance({
      totaloanBalance: Number(totaloanBalance ? totaloanBalance : 0),
      totalSavingsBalance: Number(
        totalSavingsBalance ? totalSavingsBalance : 0
      ),
      monthlyLoanDeduction: Number(
        monthlyLoanDeduction ? monthlyLoanDeduction : 0
      ),
      monthlySavingsDeduction: Number(
        monthlySavingsDeduction ? monthlySavingsDeduction : 0
      ),
      decemberPurchaseDeduction: Number(
        decemberPurchaseDeduction ? decemberPurchaseDeduction : 0
      ),
      septemberPurchaseDeduction: Number(
        septemberPurchaseDeduction ? septemberPurchaseDeduction : 0
      ),
      totalDeduction:
        monthlyLoanDeduction +
        decemberPurchaseDeduction +
        septemberPurchaseDeduction,
      member_id,
    });
    await newFinance.save();
    user.finance.push(newFinance._id);
    await user.save();
    res.status(200).json({ msg: "finanance updated successfully...." });
  } catch (error) {
    next(error);
  }
};


//edit financial details
const editFinance = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("No admin was found with the provide id");
    }

    const {
      totaloanBalance,
      totalSavingsBalance,
      monthlySavingsDeduction,
      monthlyLoanDeduction,
      decemberPurchaseDeduction,
      septemberPurchaseDeduction,
    } = req.body;
    if (
      !totaloanBalance &&
      !totalSavingsBalance &&
      !monthlySavingsDeduction &&
      !monthlyLoanDeduction &&
      !decemberPurchaseDeduction &&
      !septemberPurchaseDeduction
    ) {
      throw new BadrequestError("all fields are required...");
    }

    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      throw new NotFoundError("No finance was found");
    }

    const updateFinance = await Finance.findOneAndUpdate(
      { _id: req.params.id },
      {
        totaloanBalance: totaloanBalance
          ? totaloanBalance
          : finance.totaloanBalance,
        totalSavingsBalance: totalSavingsBalance
          ? totalSavingsBalance
          : finance.totalSavingsBalance,
        monthlyLoanDeduction: monthlyLoanDeduction
          ? monthlyLoanDeduction
          : finance.monthlyLoanDeduction,
        monthlySavingsDeduction: monthlySavingsDeduction
          ? monthlySavingsDeduction
          : finance.monthlySavingsDeduction,
        decemberPurchaseDeduction: decemberPurchaseDeduction
          ? decemberPurchaseDeduction
          : finance.decemberPurchaseDeduction,
        septemberPurchaseDeduction: septemberPurchaseDeduction
          ? septemberPurchaseDeduction
          : finance.septemberPurchaseDeduction,
        totalDeduction:
          (monthlyLoanDeduction
            ? monthlyLoanDeduction
            : finance.monthlyLoanDeduction) +
          (decemberPurchaseDeduction
            ? decemberPurchaseDeduction
            : finance.decemberPurchaseDeduction) +
          (septemberPurchaseDeduction
            ? septemberPurchaseDeduction
            : finance.septemberPurchaseDeduction),
      }
    );
    res.status(200).json(updateFinance, { new: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFinance,
  editFinance,
};