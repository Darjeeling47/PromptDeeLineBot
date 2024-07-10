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
const createAnnouncementExcel = require("../controllers/announcements/createAnnouncementExcel")
const createAnnouncementBoardcast = require("../controllers/announcements/createAnnouncementBoardcast")

// Router
router.post("/", protect, createAnnouncement)
router.post(
  "/create-many",
  protect,
  upload.single("excelFile"),
  createAnnouncements
)
router.post("/convert-to-excel", protect, createAnnouncementExcel)
router.post("/boardcast", protect, createAnnouncementBoardcast)

module.exports = router
