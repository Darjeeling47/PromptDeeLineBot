const { default: axios } = require("axios")

const pushMessageFunction = async (message, roomId) => {
  const url = "https://api.line.me/v2/bot/message/push"
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
  }

  // message must be an object in form of line message object
  const data = {
    to: roomId,
    messages: [message],
  }

  try {
    await axios.post(url, data, { headers })
    return "Success fully push message to user"
  } catch (error) {
    return "Error while push message to user"
  }
}

module.exports = { pushMessageFunction }
