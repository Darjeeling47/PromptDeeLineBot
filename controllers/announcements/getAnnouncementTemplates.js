const Announcement = require("../../models/Announcement")

getAnnouncementTemplates = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()

    return res.status(200).json({
      success: true,
      announcements: announcements,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = getAnnouncementTemplates
