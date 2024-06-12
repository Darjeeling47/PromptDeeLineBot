createLineRoom = async (req, res) => {
  try {
    const shopCode = req.body.events[0].message.text.split(" ")[2]

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
          text: shopCode,
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
  } catch (err) {
    return res.status(200).json({ success: false, message: err.message })
  }
}

module.exports = createLineRoom
