const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const Blog = require("../modules/blog");
const Comment = require("../modules/comment");
const router = Router();

// multer storage setup
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "public/uploads/blog-photo"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  res.render("pages/addBlog", {
    user: req.user,
  });
});

router.post("/create", upload.single("blogPhoto"), async (req, res) => {
  const result = await Blog.create({
    title: req.body.title,
    content: req.body.content,
    blogPhoto: `/uploads/blog-photo/${req.file.filename}`,
    createdBy: req.user.id,
  });

  res.redirect(`/blog/${result._id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
  res.render("pages/blog", {
    blog: blog,
    user: req.user,
    comments: comments,
  });
});

router.post("/:id/comment", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog, req.user, req.body);

  if (!blog) return res.status(404).send("Not Found");
  await Comment.create({
    comment: req.body.comment,
    createdBy: req.user.id,
    blogId: blog._id,
  });
  return res.redirect(`/blog/${req.params.id}`);
});

module.exports = router;
