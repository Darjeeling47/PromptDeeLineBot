const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const createAnnouncement = require("../controllers/announcements/createAnnouncement")

// Router
router.post("/", protect, createAnnouncement)

module.exports = router
