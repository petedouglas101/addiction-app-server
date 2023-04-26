const mongoose = require("mongoose");

const callSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
  },
  time: {
    type: Date,
    required: true,
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

const Call = mongoose.model("Call", callSchema);

module.exports = Call;
