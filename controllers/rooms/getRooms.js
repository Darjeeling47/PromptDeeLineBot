const mongoose = require("mongoose")
const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const util = require("util")

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

    // Finding resource
    if (req.query.search) {
      queryStr = JSON.parse(queryStr)
      delete queryStr.search
      queryStr = JSON.stringify(queryStr)
      reqQuery = getAgreegateSearchQuery(
        ["roomName", "shops.name", "shops.shopCode"],
        req.query.search
      )
    } else {
      reqQuery = JSON.parse(queryStr)
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Room.countDocuments(reqQuery)

    // Select fields
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
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          roomName: 1,
        },
      },
    ])

    // Executing query
    const rooms = await query

    // Pagination result
    const pagination = {
      now: page,
      limit: limit,
      last: Math.ceil(total / limit),
      next: null,
      prev: null,
    }

    // Next and prev page logic
    if (endIndex < total) {
      pagination.next = page + 1
    }
    if (startIndex > 0) {
      pagination.prev = page - 1
    }

    // Return response
    return res.status(200).json({
      count: total,
      pagination,
      rooms: rooms,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

function getAgreegateSearchQuery(stringSearchField, searchString) {
  let searchParam = {
    $or: [],
  }

  for (let stringField in stringSearchField) {
    const newObj = {}
    newObj[stringSearchField[stringField]] = { $regex: searchString }
    searchParam.$or.push(newObj)
  }

  // console.log(util.inspect(searchParam, false, null, true))

  return searchParam
}

module.exports = getRooms
