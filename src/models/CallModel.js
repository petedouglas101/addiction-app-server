const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userNotes: {
    type: String,
    required: false,
  },
  volunteerNotes: {
    type: String,
    required: false,
  },
});

mongoose.model("Call", callSchema);
