const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Create a room
// @route : POST /api/v1/rooms/
// @access : Private

createRoom = async (req, res, next) => {
  // Get data from request body
  const { roomName, shopCode, roomId, roomType } = req.body

  // Check if require data is provided
  if (!roomName || !shopCode || !roomId || !roomType) {
    return res.status(400).json({
      success: false,
      message: "please provide all the require data of the room",
    })
  }

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    // Check if shop is found
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    const roomIdExist = await Room.findOne({ roomId: roomId })

    if (!roomIdExist) {
      return res.status(400).json({
        success: false,
        message: "Room ID already exists",
      })
    }

    // Create new data object
    const newData = {
      roomName,
      shopId: shop._id,
      roomId,
      roomType,
    }

    // create room
    const room = await Room.create(newData)

    return res.status(201).json({
      room: {
        _id: room._id,
        shopId: room.shopId,
        shopName: shop.name,
        shopCode: shop.shopCode,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createRoom
