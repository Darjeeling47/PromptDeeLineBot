const User = require("../../models/User")

// @desc : Delete user's account
// @route : DEL /api/users/me
// @access : Private (Me)

deleteMe = async (req, res, next) => {
  try {
    // find user by id
    const user = await User.findById(req.user.id)

    // Check if user is found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find user" })
    }

    // delete user
    await user.deleteOne()

    return res.status(200).json({ success: true })
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteMe
