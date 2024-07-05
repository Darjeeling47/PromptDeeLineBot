const { default: axios } = require("axios")

const replyMessage = async (req, message) => {
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

    return "Message Sent"
  } catch (error) {
    return "Error sending message"
  }
}

module.exports = { replyMessage }
