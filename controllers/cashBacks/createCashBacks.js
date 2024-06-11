const reader = require("xlsx")
const CashBack = require("../../models/CashBack")
const Shop = require("../../models/Shop")

createCashBacks = async (req, res, next) => {
  try {
    // Get the file buffer from multer
    const fileBuffer = req.file.buffer
    // Read the file
    const file = reader.read(fileBuffer, { type: "buffer" })

    // Get the sheet names
    const sheets = file.SheetNames
    let data = []
    let shopIdArray = new Array(100000)

    // Get all the shops
    const shops = await Shop.find()
    for (const shop of shops) {
      shopIdArray[shop.shopCode] = shop._id
    }

    // Loop through the sheets
    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
      for (const row of temp) {
        // Check if the row has all the required fields
        if (
          row.shopCode != null &&
          row.orderCode != null &&
          row.orderAmount != null &&
          row.cycleDate != null &&
          row.payDate != null
        ) {
          // Create a raw cashback object
          const cashBackRaw = {
            shopCode: row.shopCode.toString(),
            orderCode: row.orderCode.toString(),
            orderAmount: row.orderAmount,
            cycleDate: new Date(1900, 0, row.cycleDate),
            payDate: new Date(1900, 0, row.payDate),
          }

          // Check if the date is valid
          if (
            cashBackRaw.cycleDate == "Invalid Date" ||
            cashBackRaw.payDate == "Invalid Date"
          ) {
            return res.status(400).json({
              success: false,
              message: "Invalid Date Format",
            })
          }

          // Check if the shop code is valid
          if (
            cashBackRaw.shopCode.length != 5 &&
            !cashBackRaw.shopCode.match(/^[0-9]{5}$/)
          ) {
            return res.status(400).json({
              success: false,
              message: "Invalid Shop Code",
            })
          }

          // Check if the shop exists
          if (shopIdArray[cashBackRaw.shopCode] == null) {
            return res.status(404).json({
              success: false,
              message: "Shop not found",
            })
          }

          // Assign the shop id to the raw cashback object
          cashBackRaw.shopId = shopIdArray[cashBackRaw.shopCode]

          // Push the raw cashback object to the data array
          data.push(cashBackRaw)
        } else {
          return res.status(400).json({
            success: false,
            message: "Missing Required Fields",
          })
        }
      }
    }

    // Sort the data by shopCode, cycleDate, and payDate in ASC order
    data.sort((a, b) => {
      if (a.shopCode !== b.shopCode) return a.shopCode.localeCompare(b.shopCode)
      if (a.cycleDate !== b.cycleDate) return a.cycleDate - b.cycleDate
      if (a.payDate !== b.payDate) return a.payDate - b.payDate
      return a.orderCode.localeCompare(b.orderCode)
    })

    console.log(data)

    // Insert the data into the database
    let cashBack = null
    let currentShopCode = null
    let currentCycleDate = null
    let currentPayDate = null
    let totalAmountOfCashBacks = 0
    let cashBacks = []

    // Loop through the data
    for (const row of data) {
      // Check if the current shop id, cycle date, and pay date is different from the previous row
      if (
        currentShopCode != null &&
        (currentShopCode != row.shopCode ||
          currentCycleDate.valueOf() != row.cycleDate.valueOf() ||
          currentPayDate.valueOf() != row.payDate.valueOf())
      ) {
        // Add the cashback to the cashbacks array
        cashBacks.push(cashBack)
        // Update the total amount of cashbacks
        totalAmountOfCashBacks += cashBack.totalAmount

        //Line notification

        // Reset the cashback object
        cashBack = {
          shopId: row.shopId,
          cycleDate: row.cycleDate,
          payDate: row.payDate,
          orders: [],
          totalAmount: 0,
        }

        // Add the order to the cashback
        cashBack.orders.push({
          code: row.orderCode,
          amount: row.orderAmount,
        })

        // Update the total amount
        cashBack.totalAmount += row.orderAmount

        // Update the current shop id, cycle date, and pay date
        currentShopCode = row.shopCode
        currentCycleDate = row.cycleDate
        currentPayDate = row.payDate
      } else {
        // Initialize cashBack if it's null
        if (!cashBack) {
          cashBack = {
            shopId: row.shopId,
            cycleDate: row.cycleDate,
            payDate: row.payDate,
            orders: [],
            totalAmount: 0,
          }
        }

        // Add the order to the cashback
        cashBack.orders.push({
          code: row.orderCode,
          amount: row.orderAmount,
        })

        // Update the total amount
        cashBack.totalAmount += row.orderAmount

        currentShopCode = row.shopCode
        currentCycleDate = row.cycleDate
        currentPayDate = row.payDate
      }
    }

    // Handle the last cashback object
    if (cashBack) {
      cashBacks.push(cashBack)
      totalAmountOfCashBacks += cashBack.totalAmount
    }

    const createdCashBacks = await CashBack.insertMany(cashBacks)

    return res.status(200).json({
      orderCount: data.length,
      cashBackCount: createdCashBacks.length,
      totalAmount: totalAmountOfCashBacks,
      cashBacks: createdCashBacks,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = createCashBacks
