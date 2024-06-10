const User = require("../../models/User")

// @desc : Get user
// @route : GET /api/v1/users/:uid
// @access : Private

getUser = async (req, res, next) => {
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

module.exports = getUser
