const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

// Profile & UserSchema
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route   GET api/profile/me
//@ desc   get user profile
//@access  private
//to use the middleware just add the file as a second paramter and route will be protected
router.get("/me", auth, async (req, res) => {
  try {
    //findng the profile by ID from Profile collection and adding to it user's data from Users collection
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is NO profile for this user" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
