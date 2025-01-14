const bookings = require("../models/bookingsModel");

// book room
exports.bookRoom = async (req, res) => {
  try {
    const { userId, roomId, checkIn, checkOut, totalPrice } = req.body;
    if (!userId || !roomId || !checkIn || !checkOut || !totalPrice) {
      return res.status(404).json({ message: "Fill out completely" });
    }
    const convertToIST = (date) => {
      const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      return new Intl.DateTimeFormat("en-IN", options).format(date);
    };
    const bookedTime = convertToIST(new Date());
    const newBooking = new bookings({
      userId,
      roomId,
      checkIn,
      checkOut,
      totalPrice: Number(totalPrice),
      bookedAt: bookedTime,
    });
    const savedBooking = await newBooking.save();
    res.status(201).json({ message: "Booked successfully", savedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
};

// get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const allBookings = await bookings
      .find()
      .populate("roomId", "title")
      .populate("userId", "name")
      .sort({ bookedAt: -1 })
      .exec();
    res
      .status(200)
      .json({ message: "Bookings retrieved successfully", allBookings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving bookings", error: error.message });
  }
};

// get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const userBookings = await bookings
      .find({ userId })
      .populate("roomId", "title")
      .exec();
    res
      .status(200)
      .json({ message: "User bookings retrieved successfully", userBookings });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving user bookings",
        error: error.message,
      });
  }
};

// Update booking status
exports.updateBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const statusUpdate = await bookings.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!statusUpdate) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res
      .status(200)
      .json({ message: "Booking status updated successfully", statusUpdate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating booking status", error: error.message });
  }
};
