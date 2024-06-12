const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const getRooms = require("../controllers/rooms/getRooms")
const getRoom = require("../controllers/rooms/getRoom")
const { createRoom } = require("../controllers/rooms/createRoom")
const updateRoom = require("../controllers/rooms/updateRoom")
const deleteRoom = require("../controllers/rooms/deleteRoom")

// Router
router.route("/").get(protect, getRooms).post(protect, createRoom)
router
  .route("/:rid")
  .get(protect, getRoom)
  .put(protect, updateRoom)
  .delete(protect, deleteRoom)

module.exports = router
