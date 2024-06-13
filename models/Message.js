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
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: true,
  },
})

module.exports = mongoose.model("Message", MessageSchema)
