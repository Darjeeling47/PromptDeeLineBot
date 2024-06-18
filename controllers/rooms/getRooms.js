const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Get all rooms
// @route : GET /api/v1/rooms/
// @access : Private

getRooms = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    let reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "search"]

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    if (req.query.search) {
      queryStr = JSON.parse(queryStr)
      delete queryStr.search
      queryStr = JSON.stringify(queryStr)
      reqQuery = getAgreegateSearchQuery(
        ["classes.subject", "classes.tutorName", "classes.name"],
        ["classes.tag"],
        queryStr,
        req.query.search
      )
    } else {
      reqQuery = JSON.parse(queryStr)
    }

    query = Room.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shopId",
          foreignField: "_id",
          as: "shops",
        },
      },
      {
        $unwind: {
          path: "$shops",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: reqQuery,
      },
      {
        $sort: {
          roomName: 1,
        },
      },
    ])
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getRooms
