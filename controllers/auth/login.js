const User = require("../../models/User")

// @desc    Login with user's email and password (create and return token, save token in cookie)
// @route   POST /api/v1/auth/login
// @access  Public

login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    //Check if email and password is valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" })
    }

    const user = await User.findOne({ email }).select("+password")

    //Check if find the user or not
    if (!user) {
      return res.status(400).json({ success: false, message: "wrong email" })
    }

    //Check if password match
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "wrong password" })
    }

    // Create token
    const token = user.getSignedJwtToken()

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    }

    if (process.env.NODE_ENV === "production") {
      options.secure = true
    }

    res.status(200).cookie("token", token, options).json({ token: token })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = login
