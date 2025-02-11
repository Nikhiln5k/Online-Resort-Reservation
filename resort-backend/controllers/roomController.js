const rooms = require("../models/roomsModel");
const mongoose = require('mongoose')

// add rooms
exports.addRoom = async (req, res) => {
  try {
    // Admin
    if (!req.user || !req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { title, price, description, amenities, images, availability, reviews } = req.body;

    const newRoom = new rooms({
      title,
      price,
      description,
      amenities,
      images,
      availability,
      reviews,
    });
    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Room added successfully.",
      room: savedRoom,
    });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// update rooms
exports.updateRoom = async (req, res) => {
  try {
    // isAdmin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const { id } = req.params;
    const { title, price, description, amenities, images, availability, reviews } = req.body;

    const updatedRoom = await rooms.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        amenities,
        images,
        availability,
        reviews,
      },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.status(200).json({
      message: "Room updated successfully.",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const roomsCount = (await rooms.find()).length;
    const allRooms = await rooms
      .find()
      .skip(offset)
      .limit(limit);

    res.status(200).json({
      message: "Rooms fetched successfully",
      count: roomsCount,
      data: allRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching rooms",
      error: error.message,
    });
  }
};

// get room details
exports.getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await rooms.findById(id);
    if(!room){
      return res.status(404).json({message: 'room not found'});
    }
    res.status(200).json({
      id: room._id,
      price: room.price,
      title: room.title,
      description: room.description,
      amenities: room.amenities,
      images: room.images,
      availability: room.availability,
      reviews: room.reviews,
    })
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// delete rooms
exports.deleteRoom = async (req, res) => {
  try {
    if (!req.user || !req.user.role === "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const { id } = req.params;
    const deletingRoom = await rooms.findByIdAndDelete(id);
    if (!deletingRoom) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.status(200).json({
        message: "Room deleted successfully",
        deletedRoom: deletingRoom,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// get reviews
exports.getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await rooms.findById(id).populate({path:'reviews.userId', select:'name'}).exec();
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// post reviews
exports.postReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    const room = await rooms.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    room.reviews.push({ userId, rating, comment });
    await room.save();
    res.status(200).json({ message:'Review submitted'})

  } catch (error) {
    console.error("Error posting reviews:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}