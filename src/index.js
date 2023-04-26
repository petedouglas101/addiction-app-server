require("./models/User");
require("./models/CommunityPost");
require("./models/Volunteer");
require("./models/CallModel");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const communityFeedRoutes = require("./routes/communityFeedRoutes");
const connectRoutes = require("./routes/connectRoutes");
const pushNotificationsRoutes = require("./routes/pushNotificationsRoutes");
const requireAuth = require("./middlewares/requireAuth");
const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(communityFeedRoutes);
app.use(connectRoutes);
app.use(pushNotificationsRoutes);
// app.use(requireAuth);

const mongoURI =
  "mongodb+srv://root:root@cluster0.phlbqez.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  console.log("Request: " + req);
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
