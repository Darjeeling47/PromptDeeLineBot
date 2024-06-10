const CashBack = require("../../models/CashBack")
const Shop = require("../../models/Shop")

// @desc : Get cahsback
// @route : POST /api/v1/cash-back/:cbid
// @access : Private

getCashBack = async (req, res, next) => {
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

    // return cashback
    return res.status(200).json({
      cashBack: {
        _id: cashBack._id,
        shopId: cashBack.shopId._id,
        shopName: cashBack.shopId.name,
        shopCode: cashBack.shopId.shopCode,
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

module.exports = getCashBack
