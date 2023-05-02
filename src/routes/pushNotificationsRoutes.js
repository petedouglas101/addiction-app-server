const { Expo } = require("expo-server-sdk");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Volunteer = require("../models/Volunteer");
const User = mongoose.model("User");

const router = express.Router();

router.post("/pushNotification", async (req, res) => {
  const { volunteerId } = req.body;
  let expoPushToken = "";

  const userWhoSentNotification = await User.findById(req.user._id);

  const user1 = Volunteer.findById(volunteerId, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      expoPushToken = user.expoPushToken;

      let expo = new Expo();

      let messages = [];

      messages.push({
        to: expoPushToken,
        sound: "default",
        body: "Someone has requested your help and would like to chat!",
        title: "Chat request",
        data: { userWhoSentNotification: userWhoSentNotification },
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("Notification Validation", ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }
  });
});

module.exports = router;
