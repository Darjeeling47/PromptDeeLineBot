const User = require("../../models/User")

// @desc : Get me
// @route : GET /api/v1/users/me
// @access : Private

getMe = async (req, res, next) => {
  try {
    // find user by id
    const user = await User.findById(req.user.id)

    return res.status(200).json({ user: user })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getMe
