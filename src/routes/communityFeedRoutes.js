const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const CommunityPost = mongoose.model("CommunityPost");

const router = express.Router();

router.use(requireAuth);

router.post("/postToCommunity", async (req, res) => {
  const { content } = req.body;
  try {
    const communityPost = new CommunityPost({
      content: content,
      date: Date.now(),
      userId: req.user._id,
    });

    await communityPost.save();
    res.send(communityPost);
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});

router.get("/communityposts", async (req, res) => {
  //find all community posts
  const communityPosts = await CommunityPost.find({});
  res.send(communityPosts);
  // const communityPosts = await CommunityPost.find({ userId: req.user._id });
  // res.send(communityPosts);
});

module.exports = router;
