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

    let webhookResponse = ""
    let message = ""

    try {
      // Save the message to the database
      await Message.create({ message: messageText })
    } catch (error) {}

    if (req.body.events[0].message.text.includes("Register Seller")) {
      // webhookResponse = await createLineRoom(req)
      message = "What is your name?"
    } else if (req.body.events[0].message.text.includes("My Score")) {
      message = "I Don't Have"
    } else {
      message = "else"
      webhookResponse = "error"
    }

    if (webhookResponse == "error") {
      message = "ขออภัย มีข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
    }

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
          text: message,
        },
      ],
    })
    // send the request
    try {
      axios.post("https://api.line.me/v2/bot/message/reply", {
        headers: headers,
        body: body,
      })
    } catch (err) {
      console.log(err)
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
