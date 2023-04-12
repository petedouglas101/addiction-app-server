const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");

const router = express.Router();

router.get("/volunteers", async (req, res) => {
  //get previous volunteers from user
  const user = await User.findOne({ _id: req.user._id });
  const volunteers = user.previousVolunteers;
  const volunteerObjects = await Promise.all(
    volunteers.map(async (volunteer) => {
      const volunteerObject = await Volunteer.findOne({
        _id: volunteer._id,
      });
      return volunteerObject;
    })
  );

  console.log("Volunteer Objects", volunteerObjects);

  if (volunteerObjects.length === 0) {
    const volunteers = await Volunteer.find({
      isOnline: true,
    });
    res.send(volunteers);
  } else {
    res.send(volunteerObjects);
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

router.post("/addVolunteerToUser", async (req, res) => {
  const { volunteerId } = req.body;
  const user = await User.findOne({ _id: req.user._id });
  const volunteerFromDB = await Volunteer.findOne({ _id: volunteerId });

  const volunteerExists = user.previousVolunteers.some((volunteer) =>
    volunteer._id.equals(volunteerFromDB._id)
  );

  if (!volunteerExists) {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { previousVolunteers: volunteerFromDB } }
    );
  } else {
    res.send("Volunteer already exists");
  }
});

router.post("/removeVolunteerFromUser", async (req, res) => {
  const { volunteerId } = req.body;

  const volunteer = await Volunteer.findOne({ _id: volunteerId });

  const user = await User.findOne({ _id: req.user._id });
  const previousVolunteers = user.previousVolunteers;
  for (let i = 0; i < previousVolunteers.length; i++) {
    if (previousVolunteers[i]._id.equals(volunteer._id)) {
      previousVolunteers.splice(i, 1);
    }
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { previousVolunteers }
  );
});

module.exports = router;
