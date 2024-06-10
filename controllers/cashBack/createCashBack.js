const CashBack = require("../../models/CashBack")
const Shop = require("../../models/Shop")

// @desc : Create a cashback
// @route : POST /api/v1/cashbacks/
// @access : Private

createCashBack = async (req, res, next) => {
  try {
    const { shopCode, orders, cycleDate, payDate } = req.body
    const orderLength = orders.length
    let totalAmount = 0

    if (!shopCode || !orders || !cycleDate || !payDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the require data of the cashback",
      })
    }

    const shop = await Shop.findOne({ shopCode: shopCode })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    for (let i = 0; i < orderLength; i++) {
      totalAmount += orders[i].amount
    }

    const newCashBack = {
      shopId: shop._id,
      orders: orders,
      totalAmount: totalAmount,
      cycleDate: new Date(cycleDate),
      payDate: new Date(payDate),
      uploadDate: Date.now(),
    }

    const cashBack = await CashBack.create(newCashBack)

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
