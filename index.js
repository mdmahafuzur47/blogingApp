require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const UserRoute = require("./routes/user");
const BlogRoute = require("./routes/blog");
const { error } = require("console");
const authCheck = require("./utils/authenticationCheck");
const Blog = require("./modules/blog");
const app = express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Sync database
app.use(express.static(path.join(__dirname, "./public")));
app.use(authCheck("token"));

// setup ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL_SERVER)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(error));
// define routes
app.get("/", async (req, res) => {
  const blogs = await Blog.find();
  return res.render("pages/home", {
    user: req.user,
    blogs: blogs,
  });
});
app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

// listen for requests

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
