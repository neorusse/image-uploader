const express = require("express");
const multer = require("multer");
const morgan = require("morgan");

const sendImageToGCS = require('./helpers/sendImageToGCS')
const sendSms = require('./helpers/sendsms');

require('dotenv').config()

const app = express();

const port = process.env.PORT || 7070;

app.use(cors())
app.use(express.urlencoded(({ extended: true })))
app.use(morgan('dev'));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 5mb.
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(express.static("./assets"));

// Root route - GET
app.get("/", (req, res) => {
  res.status(200).json({ info: `OEC Student Application Image Processor 🔥`});
});

// Root route - POST
app.post("/", upload.single("image"), async (req, res, next) => {

  try {
    const regNo = req.body.number
    const userPic = req.file
    const imageUrl = await sendImageToGCS(userPic)

    const msg = `Student with ${regNo} has uploaded his passport`

    sendSms(msg);

    res
      .status(200)
      .json({
        message: "Upload was successfully uploaded to GCS",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }

});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})

app.listen(port, () => {
  console.info(`Server running on port: ${port}`)
})