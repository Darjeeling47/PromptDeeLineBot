const express = require("express")
const router = express.Router()

getWebhook = (req, res) => {
  return res.sendStatus(200)
}

postWebhook = (req, res) => {
  let reply_token = req.body.events[0].replyToken
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer {${process.env.LINE_CHANNEL_ACCESS_TOKEN}}`,
  }
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: "Hello",
      },
      {
        type: "text",
        text: "How are you?",
      },
    ],
  })
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
  res.sendStatus(200)
}

router.route("/").get(getWebhook).post(postWebhook)

module.exports = router
