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
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log("Notification Validation", ticketChunk);
            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
    }
  });
});

module.exports = router;
