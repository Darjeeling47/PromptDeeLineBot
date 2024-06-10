const Shop = require("../../models/Shop")

// @desc : Get all shops (with filter, sort, select and pagination)
// @route : GET /api/v1/shops/
// @access : Private

getShops = async (req, res, next) => {
  try {
    let query

    // Copy req.query
    let reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "search"]

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    // Handle search functionality
    if (req.query.search) {
      reqQuery.$or = [
        { shopCode: { $regex: req.query.search, $options: "i" } },
        { name: { $regex: req.query.search, $options: "i" } },
      ]
    }

    // Create query string
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )

    // Parse the query string back to an object
    reqQuery = JSON.parse(queryStr)

    // Query the database
    query = Shop.find(reqQuery)

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ")
      query = query.select(fields)
    }

    // Sort fields
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("name")
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Shop.countDocuments(reqQuery)

    query = query.skip(startIndex).limit(limit)

    // Execute the query
    const shops = await query

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

    // Send response
    return res.status(200).json({
      count: total,
      pagination,
      shops: shops,
    })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getShops
