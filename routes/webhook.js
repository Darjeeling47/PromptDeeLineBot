const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")
const request = require("request")
const { stat } = require("fs")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { createLineRoom } = require("../controllers/webhook/createLineRoom")
const { default: axios } = require("axios")

// Handle webhook post request
handleWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    const messageText = req.body.events[0].message.text || "No message"
    let message = ""

    try {
      // Save the message to the database
      await Message.create({ message: messageText })
    } catch (error) {
      res.status(200).json({ status: "error" })
    }

    if (messageText.includes("Register Seller")) {
      message = await createLineRoom(req)
    } else if (messageText.includes("Unregister Seller")) {
      message = "Unregister Seller"
    } else if (messageText.includes("My Score")) {
      message = "I Don't Have"
    } else {
      res.status(200).json({ status: "no thing to do" })
    }

    try {
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
            text: "<Bot> " + message,
          },
        ],
      })
      // send the request
      await axios.post("https://api.line.me/v2/bot/message/reply", body, {
        headers,
      })
    } catch (error) {
      // await Message.create({ message: error.message })
      res.status(200).json({ status: "error" })
    }

    // Respond with success
    res.status(200).json({ status: "success" })
  } else {
    // Respond with bad request status if req.body or req.body.events is not as expected
    res.status(200).json({ status: "bad request" })
  }
}

handleWebhookGet = async (req, res) => {
  // Respond with success
  res.status(200)
}

router.route("/").get(handleWebhookGet).post(handleWebhook)

module.exports = router
