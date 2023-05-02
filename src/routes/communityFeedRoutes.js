const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const CommunityPost = mongoose.model("CommunityPost");

const requireAuth = require("../middlewares/requireAuth");

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
  const users = await User.find();
  const communityPosts = await CommunityPost.find({
    userId: { $in: users.map((user) => user._id) },
  });
  res.send(communityPosts);
});

router.post("/addComment", async (req, res) => {
  const { comment, id } = req.body;
  //find the post with the id
  await CommunityPost.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        comments: {
          content: comment,
          date: Date.now(),
          userId: req.user._id,
        },
      },
    }
  );
  res.send("Comment added");
});

router.get("/fetchComments", async (req, res) => {
  const { id } = req.query;
});

module.exports = router;
