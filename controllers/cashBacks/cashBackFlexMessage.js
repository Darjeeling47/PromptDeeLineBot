const cashBackFlexMessage = async (
  shopName,
  cycleDate,
  payDate,
  orders,
  totalAmount
) => {
  const messageToShop = {
    type: "flex",
    altText: "เงินโอนคืนส่วนลด",
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
            text: "รอบวัน" + cycleDate,
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
            text: "เบอร์โทร : 000-000-0000",
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

  for (let i = 0; i < orders.length; i++) {
    messageToShop.contents.body.contents[1].contents.push({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: orders[i].code,
        },
        {
          type: "text",
          text: orders[i].amount + " บาท",
          align: "end",
        },
      ],
      justifyContent: "space-between",
      alignItems: "center",
    })
  }

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

  return messageToShop
}

module.exports = { cashBackFlexMessage }
