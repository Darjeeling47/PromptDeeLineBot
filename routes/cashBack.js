const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const getCashBack = require("../controllers/cashBacks/getCashBack")
const createCashBack = require("../controllers/cashBacks/createCashBack")
const deleteCashBack = require("../controllers/cashBacks/deleteCashBack")

// Router
router.route("/").post(protect, createCashBack)
router.route("/:cbid").get(protect, getCashBack).delete(protect, deleteCashBack)

module.exports = router
