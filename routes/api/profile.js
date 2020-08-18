const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");

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

//@route   POST api/profile
//@ desc   Create || update Prfile
//@access  private
//here using 2 middleware auth and express-validator
router.post(
  "/",
  [
    auth,
    [
      body("status", "Status is required").not().isEmpty(),
      body("skills", "Skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    //incase body is not validated
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //400:bad request, send error message
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
  }
);

module.exports = router;
