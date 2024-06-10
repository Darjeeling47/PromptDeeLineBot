const User = require("../../models/User")

// @desc : Update a user
// @route : PUT /api/v1/users/:uid
// @access : Private

updateUser = async (req, res, next) => {
  // Get email from request body
  const { email } = req.body

  // Create new data object
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
    // find user by email to check if email already exists
    const checkUser = await User.findOne({ email: req.body.email })

    // Check if email already exists
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }

    // Update user
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

module.exports = updateUser
