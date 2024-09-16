import mongoose from "mongoose";

const mongodb_uri = process.env.MONGO_URL;

const connectionMongo = mongoose
  .connect(mongodb_uri)
  .then(() => {
    console.info("MongoDB connected");
    // Update user DB with a new field - enter new fieldName and defaultValue and save & run "npm run dev"
    // addFieldToUsers("email", "none");  
  })
  .catch((err) => {
    console.error(err);
  });

export default connectionMongo;