const mongoose = require("mongoose")

const AnnouncementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contents: {
    type: [JSON],
    required: true,
  },
})

module.exports = mongoose.model("Announcement", AnnouncementSchema)
