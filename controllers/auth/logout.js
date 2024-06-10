const User = require("../../models/User")

// @desc : Logout from user account and delete token
// @route : GET /api/v1/auth/logout
// @access : Registered user

logout = async (req, res, next) => {
  try {
    // Check if user is login
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token || token == "null") {
      return res.status(200).json({
        success: true,
      })
    }

    // Delete token
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })

    res.status(200).json({
      success: true,
      token: token,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = logout
