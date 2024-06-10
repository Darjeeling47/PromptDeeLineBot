const User = require("../../models/User")

// @desc    Create a new user (create and return token, save token in cookie)
// @route   POST /api/v1/auth/register
// @access  Public

register = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if require data is provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the user's require data",
      })
    }

    // Set value
    const inputUser = {
      email,
      password,
    }

    // Test validate
    const testUserValidation = new User(inputUser)
    const error = testUserValidation.validateSync()
    if (error) {
      console.log(error)
      return res
        .status(400)
        .json({ success: false, message: "The user's data is invalid" })
    }

    // Check if duplicate user or not
    const checkDuplicateUser = await User.findOne({ email: email })
    if (checkDuplicateUser) {
      return res.status(400).json({
        success: false,
        message: "The user's email is duplicated",
      })
    }

    // Create user
    const user = await User.create(inputUser)

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

    // Response
    res
      .status(200)
      .cookie("token", token, options)
      .json({ user: user, token: token })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = register
