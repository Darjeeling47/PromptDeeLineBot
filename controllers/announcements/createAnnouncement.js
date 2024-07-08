// @desc : Create a cashback
// @route : POST /api/v1/announcements/
// @access : Private

const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const { announcementFlexMessage } = require("./announcementFlexMessage")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")

createAnnouncement = async (req, res, next) => {
  try {
    const { shopCode, contents } = req.body

    // shop code and contents are required
    if (!shopCode || !contents) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the require data of the announcement",
      })
    }

    // check if the shop exists
    const shop = await Shop.findOne({ shopCode: shopCode })
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    // check if the shop has a room
    const room = await Room.find({ shopId: shop._id })
    if (room) {
      // create announcement to the shop
      const messageToShop = await announcementFlexMessage(contents)

      // push message to all the room of the shop
      for (let i = 0; i < room.length; i++) {
        await pushMessageFunction(messageToShop, room[i].roomId)
      }
    }

    return res.status(200).json({
      contents: contents,
      announcement: await announcementFlexMessage(contents),
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = createAnnouncement
