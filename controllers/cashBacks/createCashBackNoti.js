const CashBack = require("../../models/CashBack")
const Room = require("../../models/Room")
const { dateFormatter } = require("../../utils/dateFormatter")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")
const { cashBackFlexMessage } = require("./cashBackFlexMessage")

// @desc : Get cahsback
// @route : POST /api/v1/cash-back/:cbid
// @access : Private

createCashBackNoti = async (req, res, next) => {
  try {
    // find cashback by id
    const cashBack = await CashBack.findById(req.params.cbid).populate(
      "shopId",
      "name shopCode"
    )

    // Check if cashback is found
    if (!cashBack) {
      return res.status(404).json({
        success: false,
        message: "Cannot find cashback",
      })
    }

    const room = await Room.find({ shopId: cashBack.shopId })
    if (room) {
      const messageToShop = await cashBackFlexMessage(
        cashBack.shopId.name,
        dateFormatter(cashBack.cycleDate),
        dateFormatter(cashBack.payDate),
        cashBack.orders,
        cashBack.totalAmount
      )

      for (let i = 0; i < room.length; i++) {
        await pushMessageFunction(messageToShop, room[i].roomId)
      }
    }

    // return cashback
    return res.status(200).json({
      cashBack: {
        _id: cashBack._id,
        shopId: cashBack.shopId._id,
        shopName: cashBack.shopId.name,
        shopCode: cashBack.shopId.shopCode,
        orders: cashBack.orders,
        totalAmount: cashBack.totalAmount,
        cycleDate: cashBack.cycleDate,
        payDate: cashBack.payDate,
        uploadDate: cashBack.uploadDate,
        orders: cashBack.orders,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createCashBackNoti
