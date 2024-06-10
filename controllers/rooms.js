const Room = require("../models/Room")
const Shop = require("../models/Shop")

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Get all rooms
// @route : GET /api/v1/rooms/
// @access : Private
exports.getRooms = async (req, res, next) => {
  try {
  } catch (err) {
    // console.log(err.stack)
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Get room
// @route : GET /api/v1/rooms/:rid
// @access : Private
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.rid).populate(
      "shopId",
      "name shopCode"
    )

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Cannot find room",
      })
    }

    return res.status(200).json({
      room: {
        _id: room._id,
        shopId: room.shopId._id,
        shopName: room.shopId.name,
        shopCode: room.shopId.shopCode,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Create a room
// @route : POST /api/v1/rooms/
// @access : Private
exports.createRoom = async (req, res, next) => {
  const { roomName, shopCode, roomId } = req.body

  // Check if require data is provided
  if (!roomName || !shopCode || !roomId) {
    return res.status(400).json({
      success: false,
      message: "please provide all the require data of the room",
    })
  }

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    const newData = {
      roomName,
      shopId: shop._id,
      roomId,
    }

    // create room
    const room = await Room.create(newData)

    return res.status(201).json({
      room: {
        _id: room._id,
        shopId: room.shopId,
        shopName: shop.name,
        shopCode: shop.shopCode,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Update a room
// @route : PUT /api/v1/rooms/:rid
// @access : Private
exports.updateRoom = async (req, res, next) => {
  const { roomName, shopCode, roomId } = req.body

  const newData = {}

  try {
    //find shop by shop code
    const shop = await Shop.findOne({ shopCode: shopCode })

    if (!shop && shopCode) {
      return res.status(404).json({
        success: false,
        message: "Cannot find shop",
      })
    }

    if (shopCode) {
      newData.shopId = shop._id
    }
    if (roomName) {
      newData.roomName = roomName
    }
    if (roomId) {
      newData.roomId = roomId
    }

    // update room
    const room = await Room.findByIdAndUpdate(req.params.rid, newData, {
      new: true,
      runValidators: true,
    })

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Cannot find room",
      })
    }

    return res.status(200).json({
      room: {
        _id: room._id,
        shopId: room.shopId,
        roomId: room.roomId,
        roomName: room.roomName,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

// ------------------------------------------------------------------------------------------------------------------------------
// @desc : Delete a room
// @route : DEL /api/v1/rooms/:rid
// @access : Private
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.rid)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Cannot find room",
      })
    }

    await room.deleteOne()

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
