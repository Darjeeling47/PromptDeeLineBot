// import express & dotenv ----------------------------------------------------------------
const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")

//Security --------------------------------------------------------------------------------
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const { xss } = require("express-xss-sanitizer")
const rateLimit = require("express-rate-limit")
const hpp = require("hpp")
const cors = require("cors")

// Load env vars --------------------------------------------------------------------------
dotenv.config({ path: "./config/config.env" })

// Connect to database --------------------------------------------------------------------
connectDB()

// Create app -----------------------------------------------------------------------------
const app = express()

//Limit -----------------------------------------------------------------------------------
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 1000,
})

// Body JSON Parser -----------------------------------------------------------------------
app.use(express.json())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
app.use(limiter)
app.use(hpp())
app.use(cors())

// Routing --------------------------------------------------------------------------------
const auth = require("./routes/auth")
const users = require("./routes/users")
const shops = require("./routes/shops")
const rooms = require("./routes/rooms")
const cashBack = require("./routes/cashBack")

app.use("/api/v1/auth", auth)
app.use("/api/v1/users", users)
app.use("/api/v1/shops", shops)
app.use("/api/v1/rooms", rooms)
app.use("/api/v1/cash-back", cashBack)
app.post("/webhook", (req, res) => {
  return res.status(200).json({ message: "ok" })
})

// setting up port ------------------------------------------------------------------------
const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
)

// handle unhandled promise rejections -----------------------------------------------------
process.on("unhandledRejection", (err, promise) => {
  console.log(`Err: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
