const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.ObjectId,
    ref: "Shop",
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Room", RoomSchema)
