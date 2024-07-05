const reader = require("xlsx")
const Shop = require("../../models/Shop")

createShops = async (req, res, next) => {
  try {
    // Get the file buffer from multer
    const fileBuffer = req.file.buffer
    // Read the file
    const file = reader.read(fileBuffer, { type: "buffer" })

    // Get data from the first sheet
    const data = []

    // search for the first sheet and push the data into the data array
    const tempShopData = reader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[0]]
    )
    tempShopData.forEach((row) => data.push(row))

    data.sort((a, b) => {
      return a.shopCode - b.shopCode
    })

    // Insert the data into the database
    // Validate and insert the data into the database

    // Create an array to store the shop ids for validation
    let shopIdArray = new Array(100000)

    // Get all the shops and store them in the array
    const shops = await Shop.find()
    for (const shop of shops) {
      shopIdArray[shop.shopCode] = shop._id
    }

    // Create an array to store the promises
    const createShopPromises = []

    // Loop through the data
    for (const row of data) {
      // Check if the shop code is valid
      if (shopIdArray[row.shopCode] == null) {
        createShopPromises.push(Shop.create(row))
      } else {
        return res.status(400).json({
          success: false,
          message: `Shop ${row.shopCode} code already exists`,
        })
      }
    }

    // Wait for all the promises to resolve
    await Promise.all(createShopPromises)

    return res.status(201).json({ count: data.length, shops: data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createShops
