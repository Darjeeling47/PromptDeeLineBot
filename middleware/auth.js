const jwt = require("jsonwebtoken")
const User = require("../models/User")

//Protect route
exports.protect = async (req, res, next) => {
  let token

  //Check if header is valid and have Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  //Check if token is exits
  if (!token || token == "null") {
    return res.status(401).json({
      success: false,
      message: "Not authorize to access to access this route",
    })
  }
  try {
    // Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decode.id)
    next()
  } catch (err) {
    console.log(err.stack)
    return res.status(401).json({
      success: false,
      message: "Not authorize to access to access this route",
    })
  }
}
