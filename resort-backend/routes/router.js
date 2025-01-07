const express = require("express");
const {
  googleSignUp,
  userRegister,
  userLogin,
  getUserDetails,
} = require("../controllers/userController");

const router = new express.Router();

router.post("/api/user/register", userRegister);
router.post("/api/user/login", userLogin);
router.post("/api/user/google-signup", googleSignUp);
router.get("/api/user/:id", getUserDetails);

module.exports = router;
