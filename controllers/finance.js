const Finance = require("../models/finantial_details");
const { BadrequestError, ConflictError, NotFoundError } = require("../errors");
const User = require("../models/user");
const fs = require("fs");
const XLSX = require("xlsx");

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

    const existingFinance = await Finance.findOne({ totalSavingsBalance });
    // if (existingFinance) {
    //   throw new ConflictError("The users total account balance is not valid");
    // }
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
        monthlySavingsDeduction +
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
          (monthlySavingsDeduction
            ? monthlySavingsDeduction
            : finance.monthlySavingsDeduction) +
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
    res.status(200).json(updateFinance);
  } catch (error) {
    next(error);
  }
};

//delete finance
const deleteFinance = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new BadrequestError("No admin was found with the provided id");
    }
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      throw new NotFoundError("No finance was found with the provided id");
    }
    const del = await Finance.findOneAndDelete({ _id: req.params.id });
    if (!del) {
      throw new NotFoundError("No data was found with the provided id");
    }
    res.status(200).json({ msg: "finance deleted successfully..." });
  } catch (error) {
    next(error);
  }
};

//create financial details using excel
const createFinanceFromExcel = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("No admin was found with the provided id");
    }

    if (!req.file) {
      throw new BadrequestError("Please upload an Excel file...");
    }

    // Read and parse the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const finances = XLSX.utils.sheet_to_json(sheet);

    const results = [];

    for (const financeData of finances) {
      const {
        totaloanBalance,
        totalSavingsBalance,
        monthlySavingsDeduction,
        monthlyLoanDeduction,
        decemberPurchaseDeduction,
        septemberPurchaseDeduction,
        member_id,
      } = financeData;

      // Validate required fields
      if (
        !member_id ||
        totaloanBalance === undefined ||
        totalSavingsBalance === undefined ||
        monthlySavingsDeduction === undefined ||
        monthlyLoanDeduction === undefined ||
        decemberPurchaseDeduction === undefined ||
        septemberPurchaseDeduction === undefined
      ) {
        results.push({
          member_id,
          status: "failed",
          reason: "Missing required fields",
        });
        continue;
      }

      // Validate member_id
      const user = await User.findById(member_id);
      if (!user) {
        results.push({
          member_id,
          status: "failed",
          reason: "Invalid member_id (user not found)",
        });
        continue;
      }

      // Create Finance document
      const totalDeduction =
        Number(monthlySavingsDeduction) +
        Number(monthlyLoanDeduction) +
        Number(decemberPurchaseDeduction) +
        Number(septemberPurchaseDeduction);

      const newFinance = new Finance({
        totaloanBalance: Number(totaloanBalance || 0),
        totalSavingsBalance: Number(totalSavingsBalance || 0),
        monthlySavingsDeduction: Number(monthlySavingsDeduction || 0),
        monthlyLoanDeduction: Number(monthlyLoanDeduction || 0),
        decemberPurchaseDeduction: Number(decemberPurchaseDeduction || 0),
        septemberPurchaseDeduction: Number(septemberPurchaseDeduction || 0),
        totalDeduction,
        member_id,
      });

      await newFinance.save();

      // Link the finance record to the user
      user.finance.push(newFinance._id);
      await user.save();

      results.push({
        member_id,
        status: "success",
        financeId: newFinance._id,
      });
    }

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ msg: "Bulk finance creation completed", results });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  createFinance,
  editFinance,
  deleteFinance,
  createFinanceFromExcel,
};
