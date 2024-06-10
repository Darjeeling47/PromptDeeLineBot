const User = require("../../models/User")

// @desc : Delete a user
// @route : DEL /api/v1/users/:uid
// @access : Private

deleteUser = async (req, res, next) => {
  try {
    // find user by id
    const user = await User.findById(req.params.uid)

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
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = deleteUser
