const express = require("express");
const router = express.Router();
const {
  createFinance,
  editFinance,
  deleteFinance,
  createFinanceFromExcel,
} = require("../controllers/finance");
const { adminProtect } = require("../middleware/auth");
const { upload } = require("../multer");

router.post("/create", adminProtect, createFinance);
router.put("/edit/:id", adminProtect, editFinance);
router.delete("/del/:id", adminProtect, deleteFinance);
router.post(
  "/create-excel",
  adminProtect,
  upload.single("file"),
  createFinanceFromExcel
);

module.exports = router;