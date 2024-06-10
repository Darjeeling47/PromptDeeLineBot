const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Get room
// @route : GET /api/v1/rooms/:rid
// @access : Private

getRoom = async (req, res, next) => {
  try {
    // find room by id
    const room = await Room.findById(req.params.rid).populate(
      "shopId",
      "name shopCode"
    )

    // Check if room is found
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Cannot find room",
      })
    }

    // return room
    return res.status(200).json({
      room: {
        _id: room._id,
        shopId: room.shopId._id,
        shopName: room.shopId.name,
        shopCode: room.shopId.shopCode,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getRoom
