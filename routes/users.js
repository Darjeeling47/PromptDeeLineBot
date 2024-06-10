const express = require("express")
const router = express.Router()

// Import middleware
const { protect, authorize } = require("../middleware/auth")

// Import controller
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users")
const { getMe, updateMe, deleteMe } = require("../controllers/me")

// Router
router.route("/").get(protect, getUsers)
router
  .route("/me")
  .get(protect, getMe)
  .put(protect, updateMe)
  .delete(protect, deleteMe)
router
  .route("/:uid")
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser)

module.exports = router
