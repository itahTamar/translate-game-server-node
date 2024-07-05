import express from "express";
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
import {addFieldToUsers} from './API/users/updateUserDB'

//npm i dotenv
import dotenv from 'dotenv';
dotenv.config()

const app = express(); 
const port = process.env.PORT || 5000;

//middleware for using parser
app.use(cookieParser())

//body
app.use(express.json());

import connectionMongo from "./DBConnections/mongodb";

// get router from usersRouter
import userRoute from "./API/users/userRoute";

app.use("/api/users", userRoute);

// get router from wordRouter
import wordRoute from "./API/words/wordRoute";
app.use("/api/words", wordRoute);

// get router from wordRouter
import userWordsRoute from "./API/userWords/userWordsRoute";
app.use("/api/userWords", userWordsRoute);

// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   next();
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

const connectToMongoDB = async () => {
  try {
    await connectionMongo;
    // console.info("MongoDB connected");
    // addFieldToUsers("role", "user"); // Update user DB with a new field
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the process with a non-zero code
  }
};
connectToMongoDB()
  .then(() => {
    app.use((req, res, next) => {
      console.log(`Received request: ${req.method} ${req.url}`);
      next();
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });