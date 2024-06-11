const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import controllers
const createLineRoom = require("../controllers/webhook/createLineRoom")

//Dummy for line bot
getWebhook = (req, res) => {
  return res.sendStatus(200)
}

// Handle webhook post request
handleWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    const messageText = req.body.events[0].message.text || "No message"

    // Save the message to the database
    const message = await Message.create({ message: messageText })

    // if (messageText.include("Register Seller")) {
    //   createLineRoom(messageText, req.body.events[0])
    // } else if (messageText.include("My Score")) {
    // } else {
    // }

    // Respond with success
    res.status(200).json({ success: true, data: mess })
  } else {
    // Respond with bad request status if req.body or req.body.events is not as expected
    res.status(200).json({ success: false, error: "Invalid request body" })
  }
}

router.route("/").get(getWebhook).post(handleWebhook)

module.exports = router
