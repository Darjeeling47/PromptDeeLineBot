const express = require("express")
const router = express.Router()
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const createAnnouncement = require("../controllers/announcements/createAnnouncement")
const createAnnouncements = require("../controllers/announcements/createAnnouncements")

// Router
router.post("/", protect, createAnnouncement)
router.post(
  "/create-many",
  protect,
  upload.single("excelFile"),
  createAnnouncements
)

module.exports = router
