const User = require("../../models/User")

// @desc : Get all user (with filter, sort, select and pagination)
// @route : GET /api/v1/users/
// @access : Private

getUsers = async (req, res, next) => {
  try {
    let query

    //Copy req.query
    const reqQuery = { ...req.query }

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]

    //Loop over to remove fields and delete from reqQuery
    removeFields.forEach((param) => delete reqQuery[param])

    let queryStr = JSON.stringify(reqQuery)

    //Create operator $gt $gte
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    )
    query = User.find(JSON.parse(queryStr))

    //Select field
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ")
      query = query.select(fields)
    }

    //Sort field
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    //Executing
    const users = await query

    return res.status(200).json({ users: users })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getUsers
