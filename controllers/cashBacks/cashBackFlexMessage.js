const cashBackFlexMessage = async (
  shopName,
  cycleDate,
  payDate,
  orders,
  totalAmount
) => {
  // Create a message to shop with the line flex message format
  const messageToShop = {
    type: "flex",
    altText: "แจ้งโอนคืนส่วนลด",
    contents: {
      type: "bubble",
      hero: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "โอนคืนส่วนลดโปรโมชัน",
            size: "xl",
            weight: "bold",
            color: "#FFFFFF",
          },
          {
            type: "text",
            text: "รอบวันที่ " + cycleDate,
            color: "#FFFFFF",
          },
        ],
        justifyContent: "center",
        alignItems: "center",
        margin: "none",
        spacing: "md",
        paddingTop: "xxl",
        paddingBottom: "xxl",
        paddingStart: "md",
        paddingEnd: "md",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "ร้านค้า : " + shopName,
              },
              {
                type: "text",
                text: "วันที่รับเงิน : " + payDate,
              },
              {
                type: "text",
                text: "ยอดเงินรวม : " + totalAmount + " บาท",
              },
            ],
            spacing: "md",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "รายละเอียด",
                weight: "bold",
                size: "md",
              },
            ],
            spacing: "sm",
          },
        ],
        paddingStart: "lg",
        paddingEnd: "lg",
        paddingBottom: "lg",
        paddingTop: "lg",
        spacing: "xxl",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "หากมีข้อสงสัย สามารถติดต่อได้ทาง ",
            size: "xs",
            color: "#303030",
          },
          {
            type: "text",
            text: "เบอร์โทร : 080-529-7762",
            size: "xs",
            color: "#303030",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                action: {
                  type: "message",
                  label: "รับทราบ",
                  text: "รับทราบ",
                },
                color: "#0063F2",
                style: "primary",
                height: "md",
              },
            ],
            paddingTop: "xl",
          },
        ],
        paddingStart: "lg",
        paddingEnd: "lg",
        paddingBottom: "lg",
        paddingTop: "lg",
      },
      styles: {
        hero: {
          backgroundColor: "#0063F2",
        },
        body: {
          separator: false,
        },
      },
    },
  }

  // Add orders to the message
  for (let i = 0; i < orders.length; i++) {
    // Add the order to the message
    messageToShop.contents.body.contents[1].contents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: orders[i].code,
          size: "xs",
        },
        {
          type: "text",
          text: orders[i].amount + " บาท",
          size: "xs",
          align: "end",
        },
      ],
      justifyContent: "space-between",
      alignItems: "center",
    })
  }

  // Add the total amount to the message
  messageToShop.contents.body.contents[1].contents.push({
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: "รวม",
        size: "lg",
      },
      {
        type: "text",
        text: totalAmount + " บาท",
        align: "end",
        size: "lg",
        weight: "bold",
        color: "#0063F2",
      },
    ],
    justifyContent: "space-between",
    alignItems: "center",
  })

  // Return the message format
  return messageToShop
}

module.exports = { cashBackFlexMessage }
