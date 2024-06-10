const express = require("express")
const router = express.Router()

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
} = require("../controllers/shops")

// Router
router.route("/").get(protect, getShops).post(protect, createShop)
router
  .route("/:sid")
  .get(protect, getShop)
  .put(protect, updateShop)
  .delete(protect, deleteShop)

module.exports = router
