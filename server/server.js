require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("server is running");
});

app.get("/mapbox-token", (req, res) => {
  console.log("someone requested the mapbox token");
  res.json({ token: process.env.MAPBOX_ACCESS_TOKEN });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
