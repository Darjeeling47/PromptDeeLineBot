const Message = require("../../models/Message")

exports.saveLineMessage = async (req, message) => {
  try {
    // Save the message to the database
    let roomId = "Anonymous"
    if (req.body.events[0].source.type == "user") {
      roomId = req.body.events[0].source.userId
    } else if (req.body.events[0].source.type == "group") {
      roomId = req.body.events[0].source.groupId
    }

    // create the message text
    await Message.create({ message: message, roomId: roomId })

    return "Message Saved"
  } catch (error) {
    return "Error saving message"
  }
}
