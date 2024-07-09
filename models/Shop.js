const mongoose = require("mongoose")

const ShopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  shopCode: {
    type: String,
    required: [true, "Please add a shop code"],
    unique: true,
    match: [/^[0-9]{5}$/, "Please add a valid shop code"],
  },
  province: {
    type: String,
    required: [true, "Please add a province"],
  },
})

ShopSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const shopId = this._id
    await mongoose.model("Room").deleteMany({ shopId })
    await mongoose.model("CashBack").deleteMany({ shopId })
    next()
  }
)

module.exports = mongoose.model("Shop", ShopSchema)
