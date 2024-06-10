const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const { register, login, logout } = require("../controllers/auth")

// Auth router
router.post("/register", register)
router.post("/login", login)
router.get("/logout", protect, logout)

module.exports = router
