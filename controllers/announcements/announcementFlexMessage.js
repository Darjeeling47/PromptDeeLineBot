/*
contents = [
  {
    text: string,
    align: string,
    type: string,
    seperator: boolean,
  }
]
*/

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

  for (let i = 0; i < contents.length; i++) {
    const content = contents[i]

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

    if (content.type == "header") {
      flexMessage.contents.header.contents.push({
        type: "text",
        text: content.text,
        color: "#000000",
        size: "xl",
        align: "center",
        weight: "bold",
        wrap: true,
      })

      if (content.color == "#000000") {
        content.color = "#FFBD00"
      }
      flexMessage.contents.header.backgroundColor = content.color
    } else {
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
