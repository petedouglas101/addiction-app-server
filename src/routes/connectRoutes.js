const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");

const router = express.Router();

router.get("/volunteers", async (req, res) => {
  const volunteers = await User.find({
    accountType: "Volunteer",
    isOnline: true,
  });
  res.send(volunteers);
});

router.post("/addExpoPushToken", async (req, res) => {
  const { expoPushToken } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { expoPushToken }
  );
  res.send(user);
});

module.exports = router;
