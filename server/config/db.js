const mongoose = require("mongoose")
require("dotenv").config();
const { MONGO_URL } = process.env;

const connectDB = async () => {
  mongoose.connect(MONGO_URL)
  .then((conn) => console.log(`MongoDB is  connected successfully to ${conn.connection.host}`))
  .catch((err) => console.error(err));
}

module.exports = connectDB;