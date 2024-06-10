const Shop = require("../../models/Shop")

// @desc : Create a shop
// @route : POST /api/v1/shops/
// @access : Private

createShop = async (req, res, next) => {
  try {
    // Destructure request body
    const { name, shopCode, score, province } = req.body

    // Check if name, shop code, and province are provided
    if (!name || !shopCode || !province) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, shop code, and province",
      })
    }

    // Validating shop code
    if (shopCode.length != 5 || !shopCode.match(/^[0-9]{5}$/)) {
      return res.status(400).json({
        success: false,
        message: "Shop code must be 5 digits with all numbers",
      })
    }

    // Check if shop code already exists
    const checkShop = await Shop.findOne({ shopCode: shopCode })

    // Check if shop code already exists
    if (checkShop) {
      return res.status(400).json({
        success: false,
        message: "Shop code already exists",
      })
    }

    const shop = await Shop.create(req.body)

    return res.status(201).json({
      shop: shop,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createShop
