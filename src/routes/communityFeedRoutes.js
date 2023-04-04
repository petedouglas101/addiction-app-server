const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

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
      username: req.user.username,
    });

    await communityPost.save();
    res.send(communityPost);
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});

router.get("/communityposts", async (req, res) => {
  const communityPosts = await CommunityPost.find({});
  //Extract the user's username from the user's id
  // for (let i = 0; i < communityPosts.length; i++) {
  //   let user = await User.findOne({ _id: communityPosts[i].userId });
  //   communityPosts[i].username = user.username;
  //   console.log("Username", communityPosts[i].username);
  // }
  res.send(communityPosts);
});

module.exports = router;
