const bcrypt = require("bcryptjs")
const User = require("../models/User")

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Get all user (with filter, sort, select and pagination)
// @route : GET /api/v1/users/
// @access : Private
exports.getUsers = async (req, res, next) => {
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

    query = query.skip(startIndex).limit(limit)

    //Executing
    const users = await query

    return res.status(200).json({ users: users })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Get user
// @route : GET /api/v1/users/:uid
// @access : Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Not found user with this id" })
    }

    return res.status(200).json({ user: user })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Update a user
// @route : PUT /api/v1/users/:uid
// @access : Private
exports.updateUser = async (req, res, next) => {
  const { email } = req.body

  const newData = {
    email,
  }

  // Check if require data is provided
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "please provide all the require data of the user to update",
    })
  }

  // update user
  try {
    const user = await User.findByIdAndUpdate(req.params.uid, newData, {
      new: true,
      runValidators: true,
    })

    // Check if user is found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find user" })
    }

    return res.status(200).json({ user: user })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Delete a user
// @route : DEL /api/v1/users/:uid
// @access : Private
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.uid)

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find user" })
    }

    await user.deleteOne()

    return res.status(200).json({ success: true })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}
