const express = require("express");

const app = express();

const port = process.env.PORT || 7070;

app.get("/", (req, res) => {
  res.status(200).json({ info: `OEC Student Application Image Processor 🔥`});
});

app.listen(port, () => {
  console.info(`Server running on port: ${port}`)
})