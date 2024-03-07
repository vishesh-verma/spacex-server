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
  return await mongoose.connect(MONGO_URL)
}
async function closeMongooseConnection(){
   return  await mongoose.disconnect()
  }

module.exports = {
    mongooseConnection,
    closeMongooseConnection
}
