const Shop = require("../../models/Shop")

// @desc : Get shop
// @route : GET /api/v1/shops/:sid
// @access : Private

getShop = async (req, res, next) => {
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

    return res.status(200).json({
      shop: shop,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getShop
