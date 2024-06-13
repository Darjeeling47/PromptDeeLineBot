const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const Message = require("../../models/Message")
const Room = require("../../models/Room")
const { default: axios } = require("axios")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

exports.deleteLineRoom = async (req) => {
  try {
    let roomId = ""

    if (req.body.events[0].source.type == "user") {
      roomId = req.body.events[0].source.userId
    } else if (req.body.events[0].source.type == "group") {
      roomId = req.body.events[0].source.groupId
    } else {
      return "เกิดข้อผิดพลาด ห้องไม่ตรงตามกำหนด"
    }

    const room = await Room.find({ roomId: roomId })
    if (!room) {
      return "ไม่พบห้อง"
    }

    await room.deleteOne()
    return "ยกเลิกการเชื่อมต่อร้านค้าสำเร็จ"
  } catch (err) {
    return "เกิดข้อผิดพลาด"
  }
}
