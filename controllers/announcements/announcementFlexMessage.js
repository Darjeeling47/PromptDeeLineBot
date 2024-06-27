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
    altText: "แจ้งโอนคืนส่วนลด",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "horizontal",
        contents: [],
        backgroundColor: "#F0F0F0",
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
    if (!content.seperater) {
      content.seperater = false
    }
    if (!content.text) {
      content.text = ""
    }

    if (content.type == "header") {
      flexMessage.contents.header.contents.push({
        type: "text",
        text: content.text,
        color: "#0063F2",
        size: "xl",
        align: "center",
        weight: "bold",
        wrap: true,
      })
    } else {
      flexMessage.contents.body.contents.push({
        type: "text",
        text: content.text,
        align: content.align,
        size: content.type,
        margin: "md",
        wrap: true,
      })

      if (content.seperater) {
        flexMessage.contents.body.contents.push({
          type: "separator",
          margin: "md",
        })
      }
    }
  }

  return flexMessage
}

module.exports = { announcementFlexMessage }
