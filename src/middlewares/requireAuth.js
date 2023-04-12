const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;
    const { volunteerId } = payload;

    const user = await User.findById(userId);
    const volunteer = await Volunteer.findById(userId);

    if (user && !volunteer) {
      req.user = user;
      next();
    } else {
      req.volunteer = volunteer;
      next();
    }
  });
};
