const reader = require("xlsx")
const CashBack = require("../../models/CashBack")
const Shop = require("../../models/Shop")
const { pushMessageFunction } = require("../webhook/pushMessageFunction")
const Room = require("../../models/Room")
const { dateFormatter } = require("../../utils/dateFormatter")
const { cashBackFlexMessage } = require("./cashBackFlexMessage")

createCashBacks = async (req, res, next) => {
  try {
    // Get the file buffer from multer
    const fileBuffer = req.file.buffer
    // Read the file
    const file = reader.read(fileBuffer, { type: "buffer" })

    // initialize data array and shopIdArray and roomIdArray
    let data = []
    let shopIdArray = new Array(100000)
    let roomIdArray = new Array(100000)

    // Get all the shops and store them in the array
    const shops = await Shop.find()
    for (const shop of shops) {
      shopIdArray[shop.shopCode] = { id: shop._id, name: shop.name }
    }

    // Get all the room and store them in the array
    const room = await Room.find().populate("shopId")
    for (const roomData of room) {
      // Check if the room id is null
      if (roomIdArray[roomData.shopId.shopCode] == null) {
        roomIdArray[roomData.shopId.shopCode] = []
      }

      // Push the room id to the array
      roomIdArray[roomData.shopId.shopCode].push(roomData.roomId)
    }

    // Go to the first sheet
    const tempData = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]])
    for (const row of tempData) {
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
          cycleDate: new Date(1900, 0, row.cycleDate - 1),
          payDate: new Date(1900, 0, row.payDate - 1),

          // Add the shop id and shop name to the raw cashback object
          // This is data will use to send message to the shop
          shopId: shopIdArray[row.shopCode].id,
          shopName: shopIdArray[row.shopCode].name,
        }

        // Check if the date is valid
        if (
          cashBackRaw.cycleDate == "Invalid Date" ||
          cashBackRaw.payDate == "Invalid Date"
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid Date Format for the Shop Code ${cashBackRaw.shopCode} at Order Code ${cashBackRaw.orderCode}`,
          })
        }

        // Check if the shop code is valid
        if (
          cashBackRaw.shopCode.length != 5 &&
          !cashBackRaw.shopCode.match(/^[0-9]{5}$/)
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid Shop Code ${cashBackRaw.shopCode} at Order Code ${cashBackRaw.orderCode}`,
          })
        }

        // Check if the shop exists
        if (!shopIdArray[cashBackRaw.shopCode]) {
          return res.status(404).json({
            success: false,
            message: `Shop not found for Shop Code ${cashBackRaw.shopCode} at Order Code ${cashBackRaw.orderCode}`,
          })
        }

        // Push the raw cashback object to the data array
        data.push(cashBackRaw)
      } else {
        return res.status(400).json({
          success: false,
          message: "Missing Required Fields",
        })
      }
    }

    // Sort the data by shopCode, cycleDate, and payDate in ASC order
    data.sort((a, b) => {
      if (a.shopCode !== b.shopCode) return a.shopCode.localeCompare(b.shopCode)
      if (a.cycleDate !== b.cycleDate) return a.cycleDate - b.cycleDate
      if (a.payDate !== b.payDate) return a.payDate - b.payDate
      return a.orderCode.localeCompare(b.orderCode)
    })

    // Insert the data into the database
    let cashBack = null
    let currentShopCode = null
    let currentCycleDate = null
    let currentPayDate = null
    let totalAmountOfCashBacks = 0
    let cashBacks = []

    // Create an array to store the promises
    const pushMessagePromises = []

    // Loop through the data
    for (let i = 0; i < data.length; i++) {
      // Get the current cashback message
      const cashBackMessage = data[i]

      // Check if the current cashback message is the first
      if (i == 0) {
        // Initialize cashBack
        cashBack = {
          shopId: cashBackMessage.shopId,
          shopCode: cashBackMessage.shopCode,
          shopName: cashBackMessage.shopName,
          cycleDate: cashBackMessage.cycleDate,
          payDate: cashBackMessage.payDate,
          orders: [],
          totalAmount: 0,
        }

        // Add the order to the cashback
        cashBack.orders.push({
          code: cashBackMessage.orderCode,
          amount: cashBackMessage.orderAmount,
        })

        // Update the total amount
        cashBack.totalAmount += parseInt(cashBackMessage.orderAmount)

        // Update the current shop id, cycle date, and pay date
        currentShopCode = cashBackMessage.shopCode
        currentCycleDate = cashBackMessage.cycleDate
        currentPayDate = cashBackMessage.payDate

        continue
      }

      // Check if the current shop id, cycle date, and pay date is different from the previous cashBackMessage
      if (
        currentShopCode != null &&
        (currentShopCode != cashBackMessage.shopCode ||
          currentCycleDate.valueOf() != cashBackMessage.cycleDate.valueOf() ||
          currentPayDate.valueOf() != cashBackMessage.payDate.valueOf())
      ) {
        // Add the cashBackMessage to the cashbacks array
        cashBacks.push(cashBack)

        // Update the total amount of cashbacks
        totalAmountOfCashBacks += parseInt(cashBack.totalAmount)

        // Implement by using another roomIdArray
        const messageRoom = roomIdArray[cashBack.shopCode]
        if (messageRoom) {
          const messageToShop = await cashBackFlexMessage(
            cashBack.shopName,
            dateFormatter(cashBack.cycleDate),
            dateFormatter(cashBack.payDate),
            cashBack.orders,
            cashBack.totalAmount
          )

          for (let i = 0; i < messageRoom.length; i++) {
            pushMessagePromises.push(
              pushMessageFunction(messageToShop, messageRoom[i])
            )
          }
        }

        // Reset the cashback object
        cashBack = {
          shopId: cashBackMessage.shopId,
          shopCode: cashBackMessage.shopCode,
          shopName: cashBackMessage.shopName,
          cycleDate: cashBackMessage.cycleDate,
          payDate: cashBackMessage.payDate,
          orders: [],
          totalAmount: 0,
        }

        // Add the order to the cashback
        cashBack.orders.push({
          code: cashBackMessage.orderCode,
          amount: cashBackMessage.orderAmount,
        })

        // Update the total amount
        cashBack.totalAmount += parseInt(cashBackMessage.orderAmount)

        // Update the current shop id, cycle date, and pay date
        currentShopCode = cashBackMessage.shopCode
        currentCycleDate = cashBackMessage.cycleDate
        currentPayDate = cashBackMessage.payDate
      } else {
        // Add the order to the cashback
        cashBack.orders.push({
          code: cashBackMessage.orderCode,
          amount: cashBackMessage.orderAmount,
        })

        // Update the total amount
        cashBack.totalAmount += parseInt(cashBackMessage.orderAmount)

        currentShopCode = cashBackMessage.shopCode
        currentCycleDate = cashBackMessage.cycleDate
        currentPayDate = cashBackMessage.payDate
      }
    }

    // Handle the last cashback
    if (cashBack) {
      // Add the last cashback to the cashbacks array
      cashBacks.push(cashBack)
      totalAmountOfCashBacks += parseInt(cashBack.totalAmount)

      // Implement by using another roomIdArray
      const messageRoom = roomIdArray[cashBack.shopCode]
      if (messageRoom) {
        const messageToShop = await cashBackFlexMessage(
          cashBack.shopName,
          dateFormatter(cashBack.cycleDate),
          dateFormatter(cashBack.payDate),
          cashBack.orders,
          cashBack.totalAmount
        )

        for (let i = 0; i < messageRoom.length; i++) {
          pushMessagePromises.push(
            pushMessageFunction(messageToShop, messageRoom[i])
          )
        }
      }
    }

    // Wait for all the push message promises to resolve and insert the cashbacks into the database
    await Promise.all(pushMessagePromises)
    const createdCashBacks = await CashBack.insertMany(cashBacks)

    // Return the response
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
