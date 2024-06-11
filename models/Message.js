const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  lineRoomId: {
    type: String,
    default: "None",
  },
})

module.exports = mongoose.model("Message", MessageSchema)
