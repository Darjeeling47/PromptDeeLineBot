const Announcement = require("../../models/Announcement")

getAnnouncementTemplate = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.aid)

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Cannot find announcement",
      })
    }

    return res.status(200).json({
      success: true,
      announcement: announcement,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = getAnnouncementTemplate
