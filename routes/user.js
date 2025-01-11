const express = require("express");
const router = express.Router();
const {
  persistUser,
  RegisterUser,
  createUser,
  logout,
  LoginUser,
  persistAdmin,
  logoutAdmin,
} = require("../controllers/user");
const { userProtect, adminProtect } = require("../middleware/auth");
const { upload } = require("../multer");

router.post("/reg-ad", upload.single('file'),RegisterUser);
router.post("/create", adminProtect, upload.single('file'),createUser);
router.post("/login", LoginUser);
router.get("/persist", persistUser);
router.post("/logout", logout);
router.post("/logout-admin", logoutAdmin);
router.get("/persist-admin", persistAdmin);

module.exports = router;
