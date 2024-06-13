const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: String,
    required: true,
    default: null,
  },
})

module.exports = mongoose.model("Message", MessageSchema)
