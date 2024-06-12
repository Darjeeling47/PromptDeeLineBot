const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const Message = require("../../models/Message")
const { default: axios } = require("axios")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { createRoom } = require("../../controllers/rooms/createRoom")

exports.createLineRoom = async (req) => {
  try {
    const shopCode = req.body.events[0].message.text.split(" ")[2]
    let roomType = ""
    let roomName = ""
    let roomId = ""

    if (req.body.events[0].source.type == "user") {
      roomType = "user"
      roomId = req.body.events[0].source.userId

      const roomData = await axios.get(
        `https://api.line.me/v2/bot/profile/${roomId}`,
        {
          headers: {
            Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
          },
        }
      )

      roomName = roomData.data.displayName
    } else if (req.body.events[0].source.type == "group") {
      roomType = "group"
      roomId = req.body.events[0].source.groupId

      const roomData = await axios.get(
        `https://api.line.me/v2/bot/group/${roomId}/summary`,
        {
          headers: {
            Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
          },
        }
      )

      roomName = roomData.data.groupName
    } else {
      return "เกิดข้อผิดพลาด ห้องไม่ตรงตามกำหนด"
    }

    const createRoomData = {
      roomName: roomName.toString(),
      shopCode: shopCode.toString(),
      roomId: roomId.toString(),
      roomType: roomType.toString(),
    }

    Message.create({ message: JSON.stringify(createRoomData).toString() })

    let res = null
    try {
      res = await createRoom(createRoomData)

      if (res.status != 200) {
        return "เกิดข้อผิดพลาดไม่สามารถเชื่อมต่อกับห้องได้"
      }
    } catch (err) {
      return err.message
    }

    return "ร้านค้าของคุณได้รับการลงทะเบียนเรียบร้อยแล้ว"
  } catch (err) {
    return "เกิดข้อผิดพลาดที่ระบบ"
  }
}
