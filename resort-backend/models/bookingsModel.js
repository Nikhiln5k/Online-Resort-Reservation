const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"] },
  totalPrice: Number,
});

const bookings = mongoose.model("bookings", bookingsSchema);
module.exports = bookings;
