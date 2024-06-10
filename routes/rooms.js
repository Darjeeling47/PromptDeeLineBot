const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/rooms")

// Router
router.route("/").get(protect, getRooms).post(protect, createRoom)
router
  .route("/:rid")
  .get(protect, getRoom)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom)

module.exports = router
