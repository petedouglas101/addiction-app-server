const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const BlogPost = mongoose.model("BlogPost");
// const User = mongoose.model("User");
// const Comment = mongoose.model("Comment");

const router = express.Router();

router.post("/postblog", async (req, res) => {
  const { content } = req.body;
  console.log(req.user);
  console.log(content);
  //Send error if title or content is missing

  const blogPost = new BlogPost({
    title: "",
    content: content,
    date: Date.now(),
    userId: req.user._id,
  });
  try {
    await blogPost.save();
    res.send(blogPost);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.get("/blogposts", async (req, res) => {
  const blogPosts = await BlogPost.find({ userId: req.user._id });
  res.send(blogPosts);
});

module.exports = router;
