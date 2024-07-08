// Initiate Flex Message for Announcement
const announcementFlexMessage = async (contents) => {
  const flexMessage = {
    type: "flex",
    altText: "แจ้งเตือนพร้อมดี",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "horizontal",
        contents: [],
        backgroundColor: "#FFBD00",
        justifyContent: "space-between",
        alignItems: "center",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [],
      },
    },
  }

  // loop through the contents
  for (let i = 0; i < contents.length; i++) {
    const content = contents[i]

    // check if the content has all the required fields and set the default value
    if (!content.type) {
      content.type = "md"
    }
    if (!content.align) {
      content.align = "start"
    }
    if (!content.seperator) {
      content.seperator = false
    }
    if (!content.text) {
      content.text = ""
    }
    if (
      !content.color ||
      content.color.length != 7 ||
      content.color.charAt(0) != "#"
    ) {
      content.color = "#000000"
    }
    if (!content.weight) {
      content.weight = "regular"
    }

    // check the type of the content and push it to the flex message
    // check if the content is a header
    if (content.type == "header") {
      flexMessage.contents.header.contents.push({
        type: "text",
        text: content.text,
        color: "#FFFFFF",
        size: "xl",
        align: "center",
        weight: "bold",
        wrap: true,
      })
      if (content.color == "#000000") {
        content.color = "#FFBD00"
      }
      flexMessage.contents.header.backgroundColor = content.color
      flexMessage.altText = content.text
    }
    // check if the content is a link
    else if (content.type == "link") {
      flexMessage.contents.body.contents.push({
        type: "button",
        height: "sm",
        action: {
          type: "uri",
          label: "กดดูเลย",
          uri: content.text,
        },
        style: "primary",
        color: content.color,
        margin: "sm",
      })

      if (content.seperator) {
        flexMessage.contents.body.contents.push({
          type: "separator",
          margin: "sm",
          color: "#595956",
        })
      }
    }
    // check if the content is an action
    else if (content.type == "action") {
      if (content.color == "#000000") {
        content.color = "#FFBD00"
      }
      flexMessage.contents.body.contents.push({
        type: "button",
        style: "primary",
        color: content.color,
        margin: "sm",
        height: "sm",
        action: {
          type: "message",
          label: content.text,
          text: content.text,
        },
      })
    }
    // check if the content is a text
    else {
      flexMessage.contents.body.contents.push({
        type: "text",
        text: content.text,
        align: content.align,
        size: content.type,
        margin: "sm",
        color: content.color,
        weight: content.weight,
        wrap: true,
      })

      if (content.seperator) {
        flexMessage.contents.body.contents.push({
          type: "separator",
          margin: "sm",
          color: "#595956",
        })
      }
    }
  }

  return flexMessage
}

module.exports = { announcementFlexMessage }
