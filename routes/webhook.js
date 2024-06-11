const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")
const request = require("request")

getWebhook = (req, res) => {
  return res.sendStatus(200)
}

postWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    const messageText = req.body.events[0].message.text || "No message"

    try {
      // Save the message to the database
      const mess = await Message.create({ message: messageText })
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
