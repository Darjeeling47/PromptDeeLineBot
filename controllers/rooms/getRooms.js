const Room = require("../../models/Room")
const Shop = require("../../models/Shop")

// @desc : Get all rooms
// @route : GET /api/v1/rooms/
// @access : Private

getRooms = async (req, res, next) => {
  try {
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = getRooms
