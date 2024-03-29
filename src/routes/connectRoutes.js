const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Volunteer = mongoose.model("Volunteer");
const Call = mongoose.model("Call");

const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/volunteers", async (req, res) => {
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

  const allVolunteers = await Volunteer.find();
  const updatedVolunteers = allVolunteers.map((volunteer) => {
    const volunteerExists = volunteerObjects.some((volunteerObject) =>
      volunteerObject._id.equals(volunteer._id)
    );
    if (volunteerExists) {
      volunteer.isPreviousVolunteer = true;
    } else {
      volunteer.isPreviousVolunteer = false;
    }
    return volunteer;
  });

  const otherVolunteers = await Volunteer.find({
    isPreviousVolunteer: false,
  });
  const allVolunteersArray = updatedVolunteers.concat(otherVolunteers);

  const uniqueVolunteers = allVolunteersArray.filter(
    (volunteer, index, self) =>
      index === self.findIndex((t) => t.email === volunteer.email)
  );

  res.send(uniqueVolunteers);
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

router.post("/addCallToDb", async (req, res) => {
  const { volunteerId } = req.body;
  const volunteer = await Volunteer.findOne({ _id: volunteerId });
  const user = await User.findOne({ _id: req.user._id });

  const call = new Call({
    user,
    volunteer,
  });
  try {
    await call.save();

    res.send({ call });
  } catch (err) {
    console.log(err);
  }
});

router.post("/addNotesToCall", async (req, res) => {
  const { callId, notes } = req.body;
  await Call.findOneAndUpdate({ _id: callId }, { userNotes: notes });
  res.status(200).send("Notes added");
});

router.post("/retrieveCalls", async (req, res) => {
  const { volunteerId } = req.body;
  console.log("User", req);
  console.log("Volunteer", volunteerId);

  const calls = await Call.find({
    volunteer: volunteerId,
    user: req.user._id,
  }).populate("volunteer");

  console.log(calls);

  res.send(calls);
});

module.exports = router;
