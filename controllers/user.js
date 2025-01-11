const User = require("../models/user");
const {
  BadrequestError,
  NotAuthorizedError,
  ConflictError,
  NotFoundError,
} = require("../errors");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Register user
const RegisterUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !password || !email || !role) {
      throw new BadrequestError("All fields are required...");
    }

    //check if user exists already
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("A user with the email exists already...");
    }

    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(role)) {
      throw new BadrequestError("Invalid role specified");
    }

    const harshedPassword = await bcrypt.hash(password, 10);
    const file = req.file ? req.file.name : null;

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
    if (existingUser) {
      throw new ConflictError("A user with the email exists already...");
    }

    const harshedPassword = await bcrypt.hash(password, 10);
    const file = req.file ? req.file.name : null;

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

module.exports = {
  logout,
  createUser,
  LoginUser,
  RegisterUser,
  persistUser,
  persistAdmin,
  logoutAdmin,
};
