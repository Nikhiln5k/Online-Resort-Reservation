const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'rooms',
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  totalPrice: Number,
  bookedAt:{
    type: String,
    required: true,
    default: Date.now
  },
});

const bookings = mongoose.model("bookings", bookingsSchema);
module.exports = bookings;

// {
//   "userId":"677bb1f399a946bc639dc1db",
//   "roomId":"677f673e0fad9bd12c6dac67",
//   "checkIn":"2025-1-10",
//   "checkOut":"2025-1-12",
//   "totalPrice":"6000"
// }