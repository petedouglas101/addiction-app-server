require('./models/User');
import express from 'express';
import { connect, connection } from 'mongoose';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(authRoutes);

const mongoURI =
  "mongodb+srv://root:root@cluster0.phlbqez.mongodb.net/?retryWrites=true&w=majority";

connect(mongoURI);

connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
