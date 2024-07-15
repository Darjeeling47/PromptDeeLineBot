const Announcement = require("../../models/Announcement")

deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.aid)

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Cannot find announcement",
      })
    }

    await announcement.deleteOne()

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteAnnouncement
