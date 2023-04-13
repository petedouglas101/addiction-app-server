const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expoPushToken: {
    type: String,
    required: false,
  },
  isOnline: {
    type: Boolean,
    required: false,
    default: false,
  },
  isPreviousVolunteer: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
