const Announcement = require("../../models/Announcement")

createAnnouncementTemplate = async (req, res, next) => {
  try {
    const { name, contents } = req.body

    if (!name || !contents) {
      return res.status(400).json({
        success: false,
        message: "Please provide name or contents",
      })
    }

    if (contents.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide contents",
      })
    }

    const announcement = await Announcement.create({
      name: name,
      contents: contents,
    })

    return res.status(201).json({
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

module.exports = createAnnouncementTemplate
