const mongoose = require("mongoose")
const CashBack = require("../../models/CashBack")
const Room = require("../../models/Room")
const Shop = require("../../models/Shop")
const util = require("util")

// @desc : Get all cashBacks
// @route : GET /api/v1/cash-back/
// @access : Private

getCashBacks = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    let reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = [
      "select",
      "sort",
      "page",
      "limit",
      "search",
      "startDate",
      "endDate",
    ]

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    reqQuery = JSON.parse(queryStr)

    // if (req.query.search) {
    //   queryStr = JSON.parse(queryStr)
    //   delete queryStr.search
    //   queryStr = JSON.stringify(queryStr)
    //   reqQuery = getAgreegateSearchQuery(
    //     ["roomName", "shops.name", "shops.shopCode"],
    //     req.query.search
    //   )
    // } else {
    //   reqQuery = JSON.parse(queryStr)
    // }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    // Date filtering
    let dateMatch = {}
    if (req.query.startDate && req.query.endDate) {
      dateMatch = {
        cycleDate: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate),
        },
      }
    } else if (req.query.startDate) {
      dateMatch = {
        cycleDate: {
          $gte: new Date(req.query.startDate),
        },
      }
    } else if (req.query.endDate) {
      dateMatch = {
        cycleDate: {
          $lte: new Date(req.query.endDate),
        },
      }
    }

    const total = await CashBack.countDocuments({ ...reqQuery, ...dateMatch })

    query = CashBack.aggregate([
      {
        $lookup: {
          from: "shops",
          localField: "shopId",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $unwind: {
          path: "$shop",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { ...reqQuery, ...dateMatch },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          cycleDate: 1,
        },
      },
    ])

    const cashBacks = await query

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
      cashBacks: cashBacks,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = getCashBacks
