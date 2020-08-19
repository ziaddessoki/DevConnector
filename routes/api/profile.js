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
//@ desc   Create || update Profile
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

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      //find Profile & update it
      // Using upsert option (creates new doc if no match is found):
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   GET api/profile
//@ desc   Get all profiles
//@access  public
router.get("/", async (req, res) => {
  try {
    // getting all profiles from Profile collection w/ name and avatar from user DB
    const allProfiles = await Profile.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.json(allProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   GET api/profile/user/:user_id
//@ desc   Get user profile by user.ID
//@access  public
router.get("/user/:user_id", async (req, res) => {
  try {
    // getting all profiles from Profile collection w/ name and avatar from user DB
    const userProfile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!userProfile) return res.status(400).json({ msg: "Profile Not found" });

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    //incase sth other than ObjectID in Params throw 'profile not found'
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route   Delete api/profile
//@ desc   Delete all user,profiles & posts
//@access  private
router.delete("/", auth, async (req, res) => {
  try {
    //
    //delete profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //delete User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/profile/experience
//@ desc   add all experience to profile
//@access  private
//adding 2 middleware token & express validator
router.put(
  "/experience",
  [
    auth,
    [
      body("title", "Title is required!").not().isEmpty(),
      body("company", "Company is required!").not().isEmpty(),
      body("from", "From Date is required!").not().isEmpty(),
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
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    //building newExp object to send to DB {title:title}
    const newExp = { title, company, location, from, to, current, description };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

module.exports = router;
