const bcrypt = require("bcryptjs")
const User = require("../models/User")

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Get me
// @route : GET /api/v1/users/me
// @access : Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    return res.status(200).json({ user: user })
  } catch (err) {
    // console.log(err.stack)
    console.log(req.user.id)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Update user's data (can't change user's role)
// @route : PUT /api/users/me
// @access : Private (Me)
exports.updateMe = async (req, res, next) => {
  const { email } = req.body

  const newData = { email }

  if (!newData) {
    return res.status(400).json({
      success: false,
      message: "Please provide email to update",
    })
  }

  try {
    // find user by email to check if email already exists
    const checkUser = await User.findOne({ email: req.body.email })

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }

    // update user's data
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
      new: true,
      runValidators: true,
    })

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
// @desc : Delete user's account
// @route : DEL /api/users/me
// @access : Private (Me)
exports.deleteMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

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
