const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")
const request = require("request")

app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

getWebhook = (req, res) => {
  return res.sendStatus(200)
}

postWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    const messageText = req.body.events[0].message.text || "No message"

    await Message.create({ message: messageText + " 1" })
    try {
      await Message.create({ message: messageText + " 2" })
      let headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
      }
      await Message.create({
        message: messageText + " 3 " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
      })
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
      await Message.create({ message: messageText + " 4 " + body.toString() })
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

      // Save the message to the database
      const mess = await Message.create({ message: messageText + " last" })

      // Respond with success
      res.status(200).json({ success: true, data: mess })
    } catch (error) {
      // Handle errors
      console.error("Error saving message to the database:", error)
      res.status(500).json({ success: false, error: "Internal Server Error" })
    }
  } else {
    // Respond with bad request status if req.body or req.body.events is not as expected
    res.status(200).json({ success: false, error: "Invalid request body" })
  }
}

router.route("/").get(getWebhook).post(postWebhook)

module.exports = router
