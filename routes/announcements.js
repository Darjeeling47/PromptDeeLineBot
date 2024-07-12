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
const createAnnouncementTemplate = require("../controllers/announcements/createAnnouncementTemplate")
const getAnnouncementTemplates = require("../controllers/announcements/getAnnouncementTemplates")
const getAnnouncementTemplate = require("../controllers/announcements/getAnnouncementTemplate")

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
router
  .route("/templates")
  .get(protect, getAnnouncementTemplates)
  .post(protect, createAnnouncementTemplate)
router.route("/templates/:aid").get(protect, getAnnouncementTemplate)

module.exports = router
