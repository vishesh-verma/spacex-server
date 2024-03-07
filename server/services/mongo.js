const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL =process.env.MONGO_URL
mongoose.connection.once("open", () => {
  console.log("Mongoose is connected");
});
mongoose.connection.once("error", (err) => {
  console.error(err);
});

async function mongooseConnection(){
  await mongoose.connect(MONGO_URL)
}

module.exports = mongooseConnection
