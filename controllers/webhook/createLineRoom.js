const request = require("request")

// headers for the request
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
}

createLineRoom = async (message, reqBodyEvent) => {
  let responseMessage = ""
  let roomId = ""
  let roomType = ""
  let roomName = ""
  let shopCode = ""

  // Get the shop code from the message
  shopCode = message.split(" ")[2]

  // Validate the shop code
  if (shopCode.length != 5 || !shopCode.match(/^[0-9]{5}$/)) {
    responseMessage = "รหัสร้านค้าไม่ถูกต้องกระณากรอกใหม่"
    sentmessage(responseMessage, reqBodyEvent.replyToken)
    return
  }

  // Get the room name from the message
  roomType = reqBodyEvent.source.type
  if (reqBodyEvent.source.type == "user") {
    roomId = reqBodyEvent.source.userId
    const userData = request.get({
      url: "https://api.line.me/v2/bot/profile/" + roomId,
      headers: headers,
    })
    roomName = userData.displayName
  } else {
    roomId = reqBodyEvent.source.groupId
    const groupData = request.get({
      url: "https://api.line.me/v2/bot/group/" + roomId + "/summary",
      headers: headers,
    })
    roomName = groupData.groupName
  }

  // Create room using api from rooms/createRoom
  const body = JSON.stringify({
    roomName: roomName,
    shopCode: shopCode,
    roomId: roomId,
    roomType: roomType,
  })
  const res = request.post(
    "http://localhost:5000/api/v1/rooms/",
    { auth: { bearer: process.env.AUTH_TOKEN }, body: body },
    (err, res, body) => {}
  )

  responseMessage = "ร้านค้า" + res.shopName + "ถูกเพิ่มเข้าห้องแล้ว"
  sentmessage(responseMessage, reqBodyEvent.replyToken)
}

sentmessage = async (responseMessage, replyToken) => {
  try {
    // body for the request
    let body = JSON.stringify({
      replyToken: replyToken,
      messages: [
        {
          type: "text",
          text: responseMessage,
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
        console.log("status = " + res.statusCode)
      }
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = createLineRoom
