const express = require("express")
const Message = require("../models/Message")
const router = express.Router()
const bodyParser = require("body-parser")
const request = require("request")

getWebhook = (req, res) => {
  return res.sendStatus(200)
}

postWebhook = (req, res) => {
  const mess = Message.create({ message: req.body.events[0].message.text })
  res.sendStatus(200).json({ success: true, data: mess })
}

router.route("/").get(getWebhook).post(postWebhook)

module.exports = router
