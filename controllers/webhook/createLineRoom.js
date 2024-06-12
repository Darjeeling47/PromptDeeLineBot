const request = require("request")
const bodyParser = require("body-parser")
const Message = require("../../models/Message")

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

      const roomData = request.get({
        url: `https://api.line.me/v2/bot/profile/${roomId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
        },
      })

      roomName = roomData.displayName

      try {
        await Message.create({
          message: roomType + " " + roomId + " " + roomName + " " + shopCode,
        })
      } catch (err) {
        console.log(err)
      }
    } else if (req.body.events[0].source.type == "group") {
      roomType = "group"
      roomId = req.body.events[0].source.groupId

      const roomData = request.get({
        url: `https://api.line.me/v2/bot/group/${roomId}/summary`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
        },
      })

      roomName = roomData.groupName
    } else {
      return "error"
    }

    const createRoomData = {
      roomName,
      shopCode,
      roomId,
      roomType,
    }

    let res = null
    try {
      res = await createRoom(createRoomData)

      if (res.status != 200) {
        return "error"
      }
    } catch (err) {
      return "error"
    }

    // headers for the request
    let headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
    }
    // body for the request
    let body = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: "คุณลงทะเบียนร้านค้า " + res.shopName + " สำเร็จแล้ว",
        },
      ],
    })

    // send the request
    request.post(
      {
        url: "https://api.line.me/v2/bot/message/reply",
        headers: headers,
        body: body,
      },
      (err, res, body) => {
        console.log(res)
      }
    )
    return "success"
  } catch (err) {
    return "error"
  }
}
