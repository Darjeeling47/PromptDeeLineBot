const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// Make create room as a function to be exported
const createRoomFunction = async (roomName, shopCode, roomId, roomType) => {
  // Check if require data is provided
  if (!roomName || !shopCode || !roomId || !roomType) {
    return {
      success: false,
      message: "โปรดใส่ข้อมูลให้ครบถ้วน",
    }
  }

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    // Check if shop is found
    if (!shop) {
      return {
        success: false,
        message: "ไม่สามารถหาร้านค้าได้",
      }
    }

    // Check if room id already exists
    const roomIdExist = await Room.findOne({ roomId: roomId })
    if (roomIdExist) {
      return {
        success: false,
        message: "ห้องแชทนี้มีอยู่แล้ว",
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

    // return the result
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
