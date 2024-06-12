const request = require("request")
const bodyParser = require("body-parser")

exports.createLineRoom = async (req) => {
  try {
    const shopCode = req.body.events[0].message.text.split(" ")[2]

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
          text: shopCode,
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
