const mongoose = require("mongoose")
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
        ["roomName", "shops.name", "shops.shopCode"],
        ["tag"],
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

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Room.countDocuments(reqQuery)

    query = query.skip(startIndex).limit(limit)

    const rooms = await query

    // Pagination result
    const pagination = {
      now: page,
      limit: limit,
      last: Math.ceil(total / limit),
      next: null,
      prev: null,
    }

    if (endIndex < total) {
      pagination.next = page + 1
    }
    if (startIndex > 0) {
      pagination.prev = page - 1
    }

    return res.status(200).json({
      count: total,
      pagination,
      rooms: rooms,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

function getAgreegateSearchQuery(
  stringSearchField,
  arraySearchField,
  queryStr,
  searchString
) {
  let searchParam = {
    $or: [],
  }

  for (let stringField in stringSearchField) {
    const newObj = {}
    newObj[stringSearchField[stringField]] = { $regex: searchString }
    searchParam.$or.push(newObj)
  }

  for (let arrayField in arraySearchField) {
    const newObj = {}
    newObj[arraySearchField[arrayField]] = {
      $elemMatch: { name: { $regex: searchString } },
    }
    searchParam.$or.push(newObj)
  }

  let newqueryStr = {
    $and: [JSON.parse(queryStr), searchParam],
  }

  queryStr = newqueryStr

  return queryStr
}

module.exports = getRooms
