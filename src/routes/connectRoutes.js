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
  console.log(volunteers);
});

module.exports = router;
