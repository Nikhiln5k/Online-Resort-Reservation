const mongoose = require("mongoose");

const roomsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amenities: [String],
  images: [String],
  availability: Boolean,
  reviews: [{ userId: String, rating: Number, comment: String }],
});

const rooms = mongoose.model("rooms", roomsSchema);
module.exports = rooms;
