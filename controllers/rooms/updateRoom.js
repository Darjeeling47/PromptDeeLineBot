const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Update a room
// @route : PUT /api/v1/rooms/:rid
// @access : Private

updateRoom = async (req, res, next) => {
  // get roomName, shopCode, roomId from req.body
  const { roomName, shopCode, roomId } = req.body

  const newData = {}

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    // Check if shop is found
    if (!shop && shopCode) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    // Check if data is provided
    if (shopCode) {
      newData.shopId = shop._id
    }
    if (roomName) {
      newData.roomName = roomName
    }
    if (roomId) {
      newData.roomId = roomId
    }

    // update room
    const room = await Room.findByIdAndUpdate(req.params.rid, newData, {
      new: true,
      runValidators: true,
    })

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
        shopId: room.shopId,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = updateRoom
