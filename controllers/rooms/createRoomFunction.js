const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// Make create room as a function to be exported

const createRoomFunction = async (roomName, shopCode, roomId, roomType) => {
  // Check if require data is provided
  if (!roomName || !shopCode || !roomId || !roomType) {
    return {
      success: false,
      message: "Please provide all the required data of the room",
    }
  }

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    // Check if shop is found
    if (!shop) {
      return {
        success: false,
        message: "Cannot find shop",
      }
    }

    const roomIdExist = await Room.findOne({ roomId: roomId })

    if (roomIdExist) {
      return {
        success: false,
        message: "Room ID already exists",
      }
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

    return {
      success: true,
      _id: room._id,
      shopId: room.shopId,
      shopName: shop.name,
      shopCode: shop.shopCode,
      roomId: room.roomId,
      roomName: room.roomName,
    }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

module.exports = { createRoomFunction }
