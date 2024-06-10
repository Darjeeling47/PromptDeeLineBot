const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const createCashBack = require("../controllers/cashBack/createCashBack")

// Router
router.route("/").post(protect, createCashBack)

module.exports = router
