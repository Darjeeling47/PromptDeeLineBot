const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

const { createRoomFunction } = require("./createRoomFunction")

// @desc : Create a room
// @route : POST /api/v1/rooms/
// @access : Private

createRoom = async (req, res, next) => {
  try {
    // Get data from request body
    const { roomName, shopCode, roomId, roomType } = req.body

    const result = await createRoomFunction(
      roomName,
      shopCode,
      roomId,
      roomType
    )

    if (result.success === false) {
      return res.status(400).json({
        success: false,
        message: result.message,
      })
    }

    return res.status(201).json({
      room: {
        _id: result._id,
        shopId: result.shopId,
        shopName: result.shopName,
        shopCode: result.shopCode,
        roomId: result.roomId,
        roomName: result.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createRoom
