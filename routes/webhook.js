const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")
const request = require("request")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import controllers
// const createLineRoom = require("../controllers/webhook/createLineRoom")

// Handle webhook post request
handleWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    const messageText = req.body.events[0].message.text || "No message"

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
          text: "Hello, user",
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

    // Save the message to the database
    await Message.create({ message: messageText })

    // Respond with success
    res.status(200)
  } else {
    // Respond with bad request status if req.body or req.body.events is not as expected
    res.status(200)
  }
}

router.route("/").post(handleWebhook)

module.exports = router
