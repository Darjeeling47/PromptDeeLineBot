const User = require("../../models/User")

// @desc : Update user's data (can't change user's role)
// @route : PUT /api/users/me
// @access : Private (Me)

updateMe = async (req, res, next) => {
  // get email from request body
  const { email } = req.body

  const newData = { email }

  // Check if require data is provided
  if (!newData) {
    return res.status(400).json({
      success: false,
      message: "Please provide email to update",
    })
  }

  try {
    // find user by email to check if email already exists
    const checkUser = await User.findOne({ email: req.body.email })

    // Check if email already exists
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

module.exports = updateMe
