const express = require("express")
const router = express.Router()

router
  .route("/")
  .get((req, res) => {
    return res.sendStatus(200)
  })
  .post((req, res) => {
    return res.sendStatus(200)
  })
