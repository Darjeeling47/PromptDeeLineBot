const Shop = require("../../models/Shop")

// @desc : Update a shop
// @route : PUT /api/v1/shops/:sid
// @access : Private

updateShop = async (req, res, next) => {
  try {
    // Check if shop exists
    const checkShop = await Shop.findById(req.params.sid)

    // Check if shop exists
    if (!checkShop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    // Check if shop code already exists
    if (req.body.shopCode) {
      // Check if shop code is valid
      const checkShopCode = await Shop.findOne({ shopCode: req.body.shopCode })

      // Check if shop code already exists
      if (checkShopCode && checkShopCode._id != req.params.sid) {
        return res.status(400).json({
          success: false,
          message: "Shop code already exists",
        })
      }
    }

    // Update shop
    const shop = await Shop.findByIdAndUpdate(req.params.sid, req.body, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({
      shop: shop,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = updateShop
