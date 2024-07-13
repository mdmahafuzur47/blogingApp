const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const { hash, compare } = require("../utils/encryption");
const User = require("../modules/user");
const { createUserToken } = require("../utils/jwt");
const router = Router();

// multer storage setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "public/uploads/user-photo"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/login", (req, res) => {
  return res.render("pages/login");
});
router.get("/register", (req, res) => {
  return res.render("pages/register");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).render("pages/login", { message: "User not found" });
  }
  const isMatch = compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .render("pages/login", { message: "Something is wrong" });
  }

  const token = createUserToken(user);

  res
    .cookie("token", token, {
      expires: new Date(Date.now() + 3600000), // 1 hour
    })
    .redirect("/");
});

router.post("/register", upload.single("profileImg"), async (req, res) => {
  const userData = req.body;
  const hashPassword = hash(userData.password);
  await User.create({
    name: userData.name,
    email: userData.email,
    password: hashPassword,
    profileImg: req.file.filename
      ? `/uploads/user-photo/${req.file.filename}`
      : null,
  });

  res.status(201).redirect("/user/login");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
