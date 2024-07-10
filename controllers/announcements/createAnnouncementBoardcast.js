/*
req.body = {
  shops : [],
  content : []
}
*/

const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

createAnnouncementBoardcast = async (req, res, next) => {
  try {
    const { shopsCode, content } = req.body

    if (!shopsCode || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide shopsCode or message content",
      })
    }

    // Get all the shops and store them in the array
    const shops = await Shop.find()
    for (const shop of shops) {
      shopIdArray[shop.shopCode] = { id: shop._id, name: shop.name }
    }

    // Get all the room and store them in the array
    const room = await Room.find().populate("shopId")
    for (const roomData of room) {
      // Check if the room id is null
      if (roomIdArray[roomData.shopId.shopCode] == null) {
        roomIdArray[roomData.shopId.shopCode] = []
      }

      // Push the room id to the array
      roomIdArray[roomData.shopId.shopCode].push(roomData.roomId)
    }

    const pushMessagePromises = []
    for (const shopCode of shopsCode) {
      const messageRoom = roomIdArray[shopCode]
      if (messageRoom) {
        // Create announcement flex message
        const messageToShop = await announcementFlexMessage(contentList)

        // Push message to shop
        for (let i = 0; i < messageRoom.length; i++) {
          pushMessagePromises.push(
            pushMessageFunction(messageToShop, messageRoom[i])
          )
        }
      }
    }

    // await to push message for all line bot
    await Promise.all(pushMessagePromises)

    return res.status(200).json({
      success: true,
      message: "Announcements sent successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = createAnnouncementBoardcast
