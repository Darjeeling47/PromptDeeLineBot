const express = require("express")
const bodyParser = require("body-parser")
const Shop = require("../../models/Shop")
const Room = require("../../models/Room")
const { default: axios } = require("axios")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

exports.getShopScore = async (req) => {
  try {
    let roomId = ""

    if (req.body.events[0].source.type == "user") {
      roomId = req.body.events[0].source.userId
    } else if (req.body.events[0].source.type == "group") {
      roomId = req.body.events[0].source.groupId
    } else {
      return "เกิดข้อผิดพลาด ห้องไม่ตรงตามกำหนด"
    }

    const room = await Room.findOne({ roomId: roomId })
    if (!room) {
      return "ห้องนี้ไม่มีการเชื่อมต่อกับร้านค้า"
    }

    const shop = await Shop.findById(room.shopId)
    if (!shop) {
      return "ไม่สามารถหาร้านค้าได้"
    }

    return `คะแนนร้านค้าของคุณคือ ${shop.score} คะแนน`
  } catch (err) {
    return "เกิดข้อผิดพลาด"
  }
}
