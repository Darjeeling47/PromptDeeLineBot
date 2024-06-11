const express = require("express")
const router = express.Router()

const getWebhook = (req, res) => {
  return res.sendStatus(200)
}

const postWebhook = (req, res) => {
  return res.sendStatus(200)
}

router.route("/").get(getWebhook).post(postWebhook)
