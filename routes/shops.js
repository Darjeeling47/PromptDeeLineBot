const express = require("express")
const router = express.Router()
const multer = require("multer")
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Import middleware
const { protect } = require("../middleware/auth")

// Import controller
const getShops = require("../controllers/shops/getShops")
const getShop = require("../controllers/shops/getShop")
const createShops = require("../controllers/shops/createShops")
const createShop = require("../controllers/shops/createShop")
const updateShop = require("../controllers/shops/updateShop")
const deleteShop = require("../controllers/shops/deleteShop")

// Router
router.route("/").get(protect, getShops).post(protect, createShop)
router
  .route("/create-many")
  .post(protect, upload.single("excelFile"), createShops)
router
  .route("/:sid")
  .get(protect, getShop)
  .put(protect, updateShop)
  .delete(protect, deleteShop)

module.exports = router
