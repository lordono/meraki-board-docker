require("dotenv").config();

const express = require("express");
const cors = require("cors");

const path = require("path");
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//load from router
const indexRouter = require("./backend/router");
app.use("/server", indexRouter);

app.listen(process.env.PORT || 5050);
