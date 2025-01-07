const mongoose = require("mongoose");

const uri = process.env.DB_URI;

mongoose
  .connect(uri)
  .then((res) => {
    console.log(`mongodb connected successfully`);
  })
  .catch((err) => {
    console.log(`mongodb connection failed due to ${err}`);
  });
