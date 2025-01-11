const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../errors");
const User = require("../models/user");

const userProtect = async (req, res, next) => {
  const { usertoken } = req.cookies;

  if (!usertoken) {
    throw new NotAuthorizedError("User not authorized");
  }

  try {
    const decoded = jwt.verify(usertoken, process.env.USER_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    throw new NotAuthorizedError("Invalid user token");
  }
};

const adminProtect = async (req, res, next) => {
  const { admintoken } = req.cookies;

  if (!admintoken) {
    throw new NotAuthorizedError("User not authorized");
  }

  try {
    const decoded = jwt.verify(admintoken, process.env.ADMIN_SECRET);
    req.admin = await User.findById(decoded.id);
    next();
  } catch (error) {
    throw new NotAuthorizedError("Invalid user token");
  }
};

module.exports = { userProtect, adminProtect };