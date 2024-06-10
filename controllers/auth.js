const User = require("../models/User")

// ------------------------------------------------------------------------------------------------------------------------------
// @desc    Create a new user (create and return token, save token in cookie)
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
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

// ------------------------------------------------------------------------------------------------------------------------------
// @desc    Login with user's email and password (create and return token, save token in cookie)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
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
      return res
        .status(400)
        .json({ success: false, message: "wrong password or email" })
    }

    //Check if password match
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "wrong password or email" })
    }

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

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Logout from user account and delete token
// @route : GET /api/v1/auth/logout
// @access : Registered user
exports.logout = async (req, res, next) => {
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
        token: token,
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
