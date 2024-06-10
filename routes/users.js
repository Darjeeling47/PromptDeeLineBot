const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const getUsers = require("../controllers/users/getUsers")
const getUser = require("../controllers/users/getUser")
const updateUser = require("../controllers/users/updateUser")
const deleteUser = require("../controllers/users/deleteUser")
const getMe = require("../controllers/me/getMe")
const updateMe = require("../controllers/me/updateMe")
const deleteMe = require("../controllers/me/deleteMe")

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
