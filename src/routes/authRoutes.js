const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const requireAuth = require("../middlewares/requireAuth");
const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");

const router = express.Router();

router.post("/signup", async (req, res) => {
  //Extract username
  const { email, password, accountType, expoPushToken, username } = req.body;

  if (accountType === "Volunteer") {
    try {
      const volunteer = new Volunteer({
        email,
        username,
        password,
        expoPushToken,
        isOnline: true,
      });
      await volunteer.save();

      const token = jwt.sign({ volunteerId: volunteer._id }, "SECRET_KEY");
      res.send({ token, accountType: "volunteer" });
    } catch (err) {
      return res.status(422).send(err.message);
    }
  } else {
    try {
      const user = new User({
        email,
        username,
        password,
        accountType,
        expoPushToken,
      });
      await user.save();

      const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
      res.send({ token, accountType: "user" });
    } catch (err) {
      return res.status(422).send(err.message);
    }
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  let accountType;

  const user = await User.findOne({ email });
  const volunteer = await Volunteer.findOne({ email });

  if (!user && !volunteer) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
  if (user && !volunteer) {
    try {
      await user.comparePassword(password);
      const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
      res.send({ token, accountType: "user" });
    } catch (err) {
      return res.status(422).send({ error: "Incorrect password or email" });
    }
  } else if (!user && volunteer) {
    try {
      await volunteer.comparePassword(password);
      const token = jwt.sign({ volunteerId: volunteer._id }, "SECRET_KEY");
      res.send({ token, accountType: "volunteer" });
    } catch (err) {
      return res.status(422).send({ error: "Incorrect password or email" });
    }
  }
});

module.exports = router;
