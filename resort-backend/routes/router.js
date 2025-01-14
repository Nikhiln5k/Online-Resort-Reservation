const express = require("express");
const { googleSignUp, userRegister, userLogin, getUserDetails, updateUserDetails, } = require("../controllers/userController");
const verifyTokenAndRole = require("../middlewares/authMiddleware");
const { addRoom, getAllRooms, updateRoom, deleteRoom, getRoomDetails, getReviews } = require("../controllers/roomController");
const { bookRoom, getAllBookings, getUserBookings, updateBookings } = require("../controllers/bookingController");

const router = new express.Router();

router.post("/api/user/register", userRegister);
router.post("/api/user/login", userLogin);
router.post("/api/user/google-signup", googleSignUp);
router.get("/api/user/:id", getUserDetails);
router.put('/api/user/:id', updateUserDetails);

// adding rooms
router.post('/api/rooms', verifyTokenAndRole('admin'), addRoom);
router.put('/api/rooms/:id', verifyTokenAndRole('admin'), updateRoom);
router.delete('/api/rooms/:id', verifyTokenAndRole('admin'), deleteRoom);
router.get('/api/rooms', getAllRooms);
router.get('/api/rooms/:id', getRoomDetails);
router.get('/api/rooms/:id/reviews', getReviews);

// bookings
router.post('/api/bookings', bookRoom);
router.get('/api/bookings', verifyTokenAndRole('admin'), getAllBookings);
router.get('/api/bookings/:userId', getUserBookings);
router.put('/api/bookings/:id', updateBookings);


module.exports = router;
