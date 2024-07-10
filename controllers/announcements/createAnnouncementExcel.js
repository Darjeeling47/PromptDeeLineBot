var json2xls = require("json2xls")

/*
req = [
  {
    text : string
    type : string
    align : string
    color : string
    seperator : string
    weight : string
  }
]
*/

createAnnouncementExcel = async (req, res, next) => {
  try {
    const xls = json2xls(req.body)
    const buffer = Buffer.from(xls, "binary")

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=announcement.xlsx"
    )
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    return res.status(200).send(buffer)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = createAnnouncementExcel
