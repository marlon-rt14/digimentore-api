const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const handleErrors = require("../middlewares/handleErrors");

// Initializations
const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));
app.set("json spaces", 2);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

// Global Variables

// Routing
// app.use(require('./routes'));
app.use("/api/saver-link", require("./routes/linker"));
app.use("/api/saver-link", require("./routes/auth"));

// Public
app.use(express.static(path.join(__dirname, "public")));

// Connecting Server
app.listen(app.get("port"), () => {
  console.log("Server started at port " + app.get("port"));
});
