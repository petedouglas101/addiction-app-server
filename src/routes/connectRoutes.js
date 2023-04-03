const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");

const router = express.Router();

router.get("/volunteers", async (req, res) => {
  let volunteers = [];
  volunteers = await Volunteer.find({
    userId: req.user._id,
    volunteers: { $exists: true },
  });
  //if the volunteer array is empty, return all online volunteers
  if (volunteers === 0) {
    volunteers = await Volunteer.find({
      isOnline: true,
    });
    res.send(volunteers);
  } else {
    res.send(volunteers);
  }
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
