const express = require("express")
const router = express.Router()
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const getCashBacks = require("../controllers/cashBacks/getCashBacks")
const getCashBack = require("../controllers/cashBacks/getCashBack")
const createCashBacks = require("../controllers/cashBacks/createCashBacks")
const createCashBack = require("../controllers/cashBacks/createCashBack")
const deleteCashBack = require("../controllers/cashBacks/deleteCashBack")

// Router
router.route("/").get(protect, getCashBacks).post(protect, createCashBack)
router
  .route("/create-many")
  .post(protect, upload.single("excelFile"), createCashBacks)
router.route("/:cbid").get(protect, getCashBack).delete(protect, deleteCashBack)

module.exports = router
