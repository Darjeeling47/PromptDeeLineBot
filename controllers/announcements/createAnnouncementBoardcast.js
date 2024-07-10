/*
req.body = {
  shops : [],
  content : []
}
*/

const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")
const { announcementFlexMessage } = require("./announcementFlexMessage")

createAnnouncementBoardcast = async (req, res, next) => {
  try {
    const { shopsCode, contents } = req.body

    if (!shopsCode || !contents) {
      return res.status(400).json({
        success: false,
        message: "Please provide shopsCode or message content",
      })
    }

    let shopIdArray = new Array(100000)
    let roomIdArray = new Array(100000)

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
      if (!shopIdArray[shopCode] || shopCode.length != 5) {
        return res.status(404).json({
          success: false,
          message: `Shop not found for Shop Code ${shopCode}`,
        })
      }

      const messageRoom = roomIdArray[shopCode]
      if (messageRoom) {
        // Create announcement flex message
        const messageToShop = await announcementFlexMessage(contents)

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
