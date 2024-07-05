const CashBack = require("../../models/CashBack")
const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")
const { dateFormatter } = require("../../utils/dateFormatter")
const { cashBackFlexMessage } = require("./cashBackFlexMessage")

// @desc : Create a cashback
// @route : POST /api/v1/cashbacks/
// @access : Private

createCashBack = async (req, res, next) => {
  try {
    // Get data from request body
    const { shopCode, orders, cycleDate, payDate } = req.body
    const orderLength = orders.length
    let totalAmount = 0

    // Check if the data is valid
    if (!shopCode || !orders || !cycleDate || !payDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the require data of the cashback",
      })
    }

    // Check if the shop is found
    const shop = await Shop.findOne({ shopCode: shopCode })
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    // Calculate the total amount of the cashback
    for (let i = 0; i < orderLength; i++) {
      totalAmount += orders[i].amount
    }

    // Create a new cashback
    const newCashBack = {
      shopId: shop._id,
      orders: orders,
      totalAmount: totalAmount,
      cycleDate: new Date(cycleDate),
      payDate: new Date(payDate),
      uploadDate: Date.now(),
    }

    // Save the cashback
    const cashBack = await CashBack.create(newCashBack)

    // Find the room by shopId and send the cashback notification
    const room = await Room.find({ shopId: newCashBack.shopId })
    if (room) {
      const messageToShop = await cashBackFlexMessage(
        shop.name,
        dateFormatter(cashBack.cycleDate),
        dateFormatter(cashBack.payDate),
        cashBack.orders,
        cashBack.totalAmount
      )

      // Send the cashback notification to all the room
      for (let i = 0; i < room.length; i++) {
        await pushMessageFunction(messageToShop, room[i].roomId)
      }
    }

    // Return the cashback
    return res.status(201).json({
      cashBack: {
        _id: cashBack._id,
        shopId: cashBack.shopId,
        shopName: shop.name,
        shopCode: shop.shopCode,
        orders: cashBack.orders,
        totalAmount: cashBack.totalAmount,
        cycleDate: cashBack.cycleDate,
        payDate: cashBack.payDate,
        uploadDate: cashBack.uploadDate,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createCashBack
