const express = require("express")
const bodyParser = require("body-parser")
const { default: axios } = require("axios")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { createRoomFunction } = require("../rooms/createRoomFunction")

exports.createLineRoom = async (req) => {
  try {
    // Get message text and split it to get the shop code
    const shopCode = req.body.events[0].message.text.split(" ")[2]
    let roomType = ""
    let roomName = ""
    let roomId = ""

    // Check if the room is a user or a group
    if (req.body.events[0].source.type == "user") {
      // Set roomType to user and roomId to the user's id
      roomType = "user"
      roomId = req.body.events[0].source.userId

      // Get the user's profile data
      const roomData = await axios.get(
        `https://api.line.me/v2/bot/profile/${roomId}`,
        {
          headers: {
            Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
          },
        }
      )

      // Set roomName to the user's display name
      roomName = roomData.data.displayName
    } else if (req.body.events[0].source.type == "group") {
      // Set roomType to group and roomId to the group's id
      roomType = "group"
      roomId = req.body.events[0].source.groupId

      // Get the group's summary data
      const roomData = await axios.get(
        `https://api.line.me/v2/bot/group/${roomId}/summary`,
        {
          headers: {
            Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
          },
        }
      )

      // Set roomName to the group's name
      roomName = roomData.data.groupName
    } else {
      // Return an error message if the room type is not user or group
      // This message will appear in the chat
      return "เกิดข้อผิดพลาด รูปแบบห้องไม่ตรงตามกำหนด"
    }

    // Create a room with the data
    const result = await createRoomFunction(
      roomName,
      shopCode,
      roomId,
      roomType
    )

    // Check if the function return success false
    if (result.success === false) {
      return result.message
    }

    // Return a success message
    return `ร้านค้า ${result.shopName} ได้รับการลงทะเบียนเรียบร้อยแล้ว`
  } catch (err) {
    return "เกิดข้อผิดพลาดที่ระบบ"
  }
}
