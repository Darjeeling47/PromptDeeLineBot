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

    // Check if the room is a user or a group
    if (req.body.events[0].source.type == "user") {
      roomId = req.body.events[0].source.userId
    } else if (req.body.events[0].source.type == "group") {
      roomId = req.body.events[0].source.groupId
    } else {
      return "เกิดข้อผิดพลาด ห้องไม่ตรงตามกำหนด"
    }

    // Find the room with the roomId
    const room = await Room.findOne({ roomId: roomId })
    if (!room) {
      return "ห้องนี้ไม่มีการเชื่อมต่อกับร้านค้า"
    }

    // Delete the room
    await room.deleteOne()
    return "ยกเลิกการเชื่อมต่อร้านค้าสำเร็จ"
  } catch (err) {
    return "เกิดข้อผิดพลาด"
  }
}
