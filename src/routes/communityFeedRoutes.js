const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const CommunityPost = mongoose.model("CommunityPost");

const router = express.Router();

// router.use(requireAuth);

router.post("/postToCommunity", async (req, res) => {
  const { content } = req.body;
  console.log(req);
  console.log(content);
  //Send error if title or content is missing

  const communityPost = new CommunityPost({
    title: "",
    content: content,
    date: Date.now(),
    userId: req.user._id,
  });
  try {
    await communityPost.save();
    res.send(communityPost);
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.get("/communityposts", async (req, res) => {
  // //find all community posts
  // const communityPosts = await CommunityPost.find({});
  // res.send(communityPosts);
  const communityPosts = await CommunityPost.find({ userId: req.user._id });
  res.send(communityPosts);
});

module.exports = router;
