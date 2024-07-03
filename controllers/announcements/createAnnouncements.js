// @desc : Create a cashback
// @route : POST /api/v1/announcement/create-many
// @access : Private

const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const reader = require("xlsx")
const { announcementFlexMessage } = require("./announcementFlexMessage")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")
const { Promise } = require("mongoose")

createAnnouncements = async (req, res, next) => {
  try {
    // Get the file buffer from multer
    const fileBuffer = req.file.buffer
    // Read the file
    const file = reader.read(fileBuffer, { type: "buffer" })

    // Get the sheet names
    let data = []
    let shopIdArray = new Array(100000)
    let roomIdArray = new Array(100000)

    // Get all the shops
    const shops = await Shop.find()
    for (const shop of shops) {
      shopData = [shop._id, shop.name]
      shopIdArray[shop.shopCode] = shopData
    }

    // Get all the room
    const room = await Room.find().populate("shopId")
    for (const roomData of room) {
      if (roomIdArray[roomData.shopId.shopCode] == null) {
        roomIdArray[roomData.shopId.shopCode] = []
      }
      roomIdArray[roomData.shopId.shopCode].push(roomData.roomId)
    }

    // Loop through the sheets
    const workSheet = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[0]]
    )
    for (const row of workSheet) {
      if (row.shopCode != null) {
        // Check if the shop code is valid
        if (row.shopCode.toString().length != 5) {
          return res.status(400).json({
            success: false,
            message: "Invalid Shop Code",
          })
        }

        // Check if the shop exists
        if (shopIdArray[row.shopCode][0] == null) {
          return res.status(404).json({
            success: false,
            message: "Shop not found",
          })
        }

        // Create a raw announcement object
        const content = {
          shopCode: row.shopCode,
          text: row.text,
          type: row.type,
          weight: row.weight,
          align: row.align,
          color: row.color,
          seperator: row.seperator,
        }

        // push content to data
        data.push(content)
      } else {
        return res.status(400).json({
          success: false,
          message: "Missing Required Fields",
        })
      }
    }

    // Sort the data by shopCode ASC order
    data.sort((a, b) => {
      return a.shopCode >= b.shopCode
    })

    let currentShopCode = null
    let contentList = []

    // Loop through the data
    for (const row of data) {
      if (currentShopCode != null && currentShopCode != row.shopCode) {
        // Find room by shop code
        const messageRoom = roomIdArray[currentShopCode]
        if (messageRoom) {
          // Create announcement flex message
          const messageToShop = await announcementFlexMessage(contentList)

          // Push message to shop
          for (let i = 0; i < messageRoom.length; i++) {
            pushMessageFunction(messageToShop, messageRoom[i])
          }
        }

        contentList = []
        contentList.push(row)
        currentShopCode = row.shopCode
      } else {
        contentList.push(row)
        currentShopCode = row.shopCode
      }
    }

    const messageRoom = roomIdArray[currentShopCode]
    if (messageRoom) {
      // Create announcement flex message
      const messageToShop = await announcementFlexMessage(contentList)

      // Push message to shop
      for (let i = 0; i < messageRoom.length; i++) {
        pushMessageFunction(messageToShop, messageRoom[i])
      }
    }

    // Await all push message promises
    await Promise.all(pushMessagePromises)

    return res.status(200).json({
      success: true,
      message: "Announcements sent successfully",
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = createAnnouncements
