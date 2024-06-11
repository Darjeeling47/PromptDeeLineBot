const reader = require("xlsx")
const Shop = require("../../models/Shop")

createShops = async (req, res, next) => {
  try {
    // Get the file buffer from multer
    const fileBuffer = req.file.buffer
    // Read the file
    const file = reader.read(fileBuffer, { type: "buffer" })

    // Get the sheet names
    const sheets = file.SheetNames
    const data = []

    // Loop through the sheets
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
      temp.forEach((row) => data.push(row))
    }

    data.sort((a, b) => {
      return a.shopCode - b.shopCode
    })

    // Insert the data into the database
    // This thing (insertMany) won't validate the data, so make sure the data is valid
    // If you want to validate the data, you can use the create method. But it will be much more slowe
    // Shop.create(data)
    //Shop.create(data)
    // Validate and insert the data into the database
    const results = []
    let shopIdArray = new Array(100000)

    // Get all the shops
    const shops = await Shop.find()
    for (const shop of shops) {
      shopIdArray[shop.shopCode] = shop._id
    }

    // Loop through the data
    for (const row of data) {
      try {
        if (shopIdArray[row.shopCode] == null) {
          Shop.create(row)
        }
      } catch (error) {
        console.error(
          `Failed to insert shop with shopCode ${row.shopCode}: ${error.message}`
        )
      }
    }

    return res.status(200).json({ count: data.length, shops: data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createShops
