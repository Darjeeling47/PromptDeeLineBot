const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")

app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { createLineRoom } = require("../controllers/webhook/createLineRoom")
const { deleteLineRoom } = require("../controllers/webhook/deleteLineRoom")
const { saveLineMessage } = require("../controllers/webhook/saveLineMessage")

// Handle webhook post request
handleWebhook = async (req, res) => {
  // Check if req.body and req.body.events are defined
  if (req.body && req.body.events && req.body.events.length > 0) {
    // Get the message text from the request body
    const messageText = req.body.events[0].message.text || "No message"
    let message = ""

    // Save the message to the database
    await saveLineMessage(req)

    // Check if the message text is in correct format
    if (messageText.includes("Register Seller")) {
      message = await createLineRoom(req)
    } else if (messageText.includes("Unregister Seller")) {
      message = await deleteLineRoom(req)
    } else {
      return res.status(200).json({ status: "no thing to do" })
    }

    // Send the reply message
    await replyMessage(req, message)

    // Respond with success
    return res.status(200).json({ status: "success" })
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
