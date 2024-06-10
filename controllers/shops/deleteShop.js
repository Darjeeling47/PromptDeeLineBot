const Shop = require("../../models/Shop")

// @desc : Delete a shop
// @route : DEL /api/v1/shops/:sid
// @access : Private

deleteShop = async (req, res, next) => {
  try {
    // find shop by id
    const shop = await Shop.findById(req.params.sid)

    // Check if shop is found
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    // delete shop
    await shop.deleteOne()

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteShop
