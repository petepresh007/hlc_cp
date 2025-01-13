const User = require("../models/user");
const {
  BadrequestError,
  NotAuthorizedError,
  ConflictError,
  NotFoundError,
} = require("../errors");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { deleteFile } = require("../utils/deletefile");
const path = require("path");
const fs = require("fs");

// Register user
const RegisterUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !password || !email || !role) {
      throw new BadrequestError("All fields are required...");
    }

    //check if user exists already
    const existingUser = await User.findOne({ email });

    const existingUserUserName = await User.findOne({ username });
    if (existingUser || existingUserUserName) {
      throw new ConflictError(
        "A user with the email or username exists already..."
      );
    }

    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(role)) {
      throw new BadrequestError("Invalid role specified");
    }

    const harshedPassword = await bcrypt.hash(password, 10);
    const file = req.file ? req.file.filename : null;

    const newUser = new User({
      username,
      email,
      password: harshedPassword,
      role,
      file,
    });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

// Login user
const LoginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!password || (!username && !email)) {
      throw new BadrequestError(
        "Username or email and password are required..."
      );
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!user) {
      throw new BadrequestError("Invalid credentials...");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new BadrequestError("Invalid credentials...");
    }

    let token;

    if (user.role === "admin") {
      token = JWT.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.ADMIN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("admintoken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 2 * 60 * 60 * 1000,
      });
    }

    if (user.role === "user") {
      token = JWT.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.USER_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("usertoken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 2 * 60 * 60 * 1000,
      });
    }

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({ userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

//persist user login
const persistUser = async (req, res, next) => {
  const { usertoken } = req.cookies;

  if (!usertoken) {
    throw new NotAuthorizedError("User not authorized");
  }

  try {
    const decoded = JWT.verify(usertoken, process.env.USER_SECRET);
    const user = await User.findById(decoded.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const persistAdmin = async (req, res, next) => {
  const { admintoken } = req.cookies;

  if (!admintoken) {
    throw new NotAuthorizedError("User not authorized");
  }

  try {
    const decoded = JWT.verify(admintoken, process.env.ADMIN_SECRET);
    const user = await User.findById(decoded.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//create user
const createUser = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("No admin was found with the provided id");
    }
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      throw new BadrequestError("All fields are required...");
    }

    //check if user exists already
    const existingUser = await User.findOne({ email });

    const existingUserUsername = await User.findOne({ username });
    if (existingUser || existingUserUsername) {
      throw new ConflictError(
        "A user with the email or username exists already..."
      );
    }

    const harshedPassword = await bcrypt.hash(password, 10);
    const file = req.file ? req.file.filename : null;

    const newUser = new User({
      username,
      email,
      password: harshedPassword,
      role: "user",
      file,
    });

    await newUser.save();
    res.status(200).json({ msg: "user created successfully....." });
  } catch (error) {
    next(error);
  }
};

//logout user
const logout = (_, res) => {
  res.clearCookie("usertoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ msg: "user logged out successfully..." });
};

//logout admin
const logoutAdmin = (_, res) => {
  res.clearCookie("admintoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ msg: "user logged out successfully..." });
};

//get available users
const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .populate("finance");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//admin delete user account
const deleteUserAccount = async (req, res, next) => {
  try {
    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("No admin was found with the provided id");
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError("No user was found with the provided id");
    }

    const del = await User.findOneAndDelete({ _id: req.params.id });
    if (del) {
      const filepath = path.join(__dirname, "..", "upload", user.file);
      deleteFile(filepath);
    }
    res.status(200).json({ msg: "user deleted successfully..." });
  } catch (error) {
    next(error);
  }
};

//admin modify users account
const editUserAccount = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password && !req.file) {
      throw new BadrequestError("Please enter a field to update...");
    }

    //check if user exists already
    const existingUser = await User.findOne({ email });

    const existingUserUsername = await User.findOne({ username });
    if (existingUser || existingUserUsername) {
      throw new ConflictError(
        "A user with the email or username exists already..."
      );
    }

    const admin = await User.findById(req.admin._id);
    if (!admin) {
      throw new NotFoundError("no admin was found with the provided id");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("no user was found with the provided id");
    }

    const updateValue = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        username: username ? username : user.username,
        email: email ? email : user.email,
        file: req.file ? req.file.filename : user.file,
      }
    );

    if (req.file) {
      const filepath = path.join(__dirname, "..", "upload", user.file);
      deleteFile(filepath);
    }

    res
      .status(200)
      .json({ updateValue, msg: "account updated successfully..." });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

//get single  user
const getSingleUser = async (req, res, next) => {
  try {
    const data = await User.findOne({
      _id: req.params.id,
      role: "user",
    }).populate("finance");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logout,
  createUser,
  LoginUser,
  RegisterUser,
  persistUser,
  persistAdmin,
  logoutAdmin,
  deleteUserAccount,
  editUserAccount,
  getAllUser,
  deleteUserAccount,
  editUserAccount,
  getSingleUser
};
