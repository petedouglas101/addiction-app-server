const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const profilePicture = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
});

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
  profilePicture: {
    type: profilePicture,
    required: false,
  },
});

volunteerSchema.pre("save", function (next) {
  const volunteer = this;
  if (!volunteer.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(volunteer.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      volunteer.password = hash;
      next();
    });
  });
});

volunteerSchema.methods.comparePassword = function (volunteerPassword) {
  const volunteer = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(volunteerPassword, volunteer.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

module.exports = mongoose.model("Volunteer", volunteerSchema);
