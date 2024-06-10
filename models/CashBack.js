const mongoose = require("mongoose")

const CashBackSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.ObjectId,
    ref: "Shop",
    required: true,
  },
  cycleDate: {
    type: Date,
    required: true,
  },
  payDate: {
    type: Date,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orders: {
    type: [
      {
        code: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
})

module.exports = mongoose.model("CashBack", CashBackSchema)
