const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, accountType } = req.body;

  try {
    const user = new User({ email, password, accountType });
    await user.save();

    const token = jwt.sign({ userId: user._id }, "SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(422).send({ error: "Incorrect password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user.id }, "SECRET_KEY");
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
