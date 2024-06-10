const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Delete a room
// @route : DEL /api/v1/rooms/:rid
// @access : Private

deleteRoom = async (req, res, next) => {
  try {
    // find room by id
    const room = await Room.findById(req.params.rid)

    // Check if room is found
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Cannot find room",
      })
    }

    // delete room
    await room.deleteOne()

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteRoom
