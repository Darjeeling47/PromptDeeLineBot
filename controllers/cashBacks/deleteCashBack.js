const CashBack = require("../../models/CashBack")
const Shop = require("../../models/Shop")

// @desc : Delete a cashback
// @route : DEL /api/v1/cash-back/:cbid
// @access : Private

deleteCashBack = async (req, res, next) => {
  try {
    // find cashback by id
    const cashBack = await CashBack.findById(req.params.cbid)

    // Check if cashback is found
    if (!cashBack) {
      return res.status(404).json({
        success: false,
        message: "Cannot find cashback",
      })
    }

    // delete cashback
    await cashBack.deleteOne()

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteCashBack
