const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");

const router = express.Router();

router.post("/signup", async (req, res) => {
  //Extract username
  const { email, password, accountType, expoPushToken, username } = req.body;
  console.log("Account type", accountType);
  console.log("Username", username);
  console.log("Expo push token", expoPushToken);

  if (accountType === "Volunteer") {
    try {
      const volunteer = new Volunteer({
        email,
        username,
        password,
        expoPushToken,
      });
      await volunteer.save();

      const token = jwt.sign({ userId: volunteer._id }, "SECRET_KEY");
      res.send({ token });
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
      res.send({ token });
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

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    console.log("Token from signin", token);
    User.findOneAndUpdate(
      { email },
      { isOnline: true },
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("User is now online");
        }
      }
    );
    res.send({ token, accountType: user.accountType });
  } catch (err) {
    return res.status(422).send({ error: "Incorrect password or email" });
  }
});

module.exports = router;
