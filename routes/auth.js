const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const register = require("../controllers/auth/register")
const login = require("../controllers/auth/login")
const logout = require("../controllers/auth/logout")

// Auth router
router.post("/register", register)
router.post("/login", login)
router.get("/logout", protect, logout)

module.exports = router
