const express = require("express");
const mongoose = require("mongoose");
const BlogPost = mongoose.model("BlogPost");

const router = express.Router();

router.post("/blogposts", async (req, res) => {
  const { title, content } = req.body;
  const blogPost = new BlogPost({ title, content, userId: req.user._id });
  try {
    await blogPost.save();
    res.send(blogPost);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

module.exports = router;
