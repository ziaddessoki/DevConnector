const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");
const normalize = require("normalize-url");

// Profile & UserSchema
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route   GET /api/profile/me
//@ desc   get user profile
//@access  private
//to use the middleware just add the file as a second paramter and route will be protected
router.get("/me", auth, async (req, res) => {
  try {
    //finding the profile by ID from Profile collection and adding to it user's data from Users collection
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is NO profile for this user" });
    }
    res.json(profile);
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

    // //build profile object
    // const profileFields = {};
    // profileFields.user = req.user.id;
    // if (company) profileFields.company = company;
    // if (website) profileFields.website = website;
    // if (location) profileFields.location = location;
    // if (bio) profileFields.bio = bio;
    // if (status) profileFields.status = status;
    // if (githubusername) profileFields.githubusername = githubusername;
    // if (skills) {
    //   profileFields.skills = skills.split(",").map((skill) => skill.trim());
    // }

    // //build social object
    // profileFields.social = {};
    // if (youtube) profileFields.social.youtube = youtube;
    // if (twitter) profileFields.social.twitter = twitter;
    // if (facebook) profileFields.social.facebook = facebook;
    // if (instagram) profileFields.social.instagram = instagram;
    // if (linkedin) profileFields.social.linkedin = linkedin;

    const profileFields = {
      user: req.user.id,
      company,
      location,
      website:
        website && website !== ""
          ? normalize(website, { forceHttps: true })
          : "",
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => " " + skill.trim()),
      status,
      githubusername,
    };

    // Build social object and add to profileFields
    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(socialfields)) {
      if (value && value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

    try {
      //find Profile & update it
      // Using upsert option (creates new doc if no match is found):
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
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

//@route   DELETE api/profile
//@ desc   Delete  user,profiles & posts
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

//@route   DELETE api/profile/experience/:exp_id
//@ desc   Delete experience form profile
//@access  private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/profile/education
//@ desc   add  education to profile
//@access  private
//adding 2 middleware token & express validator
router.put(
  "/education",
  [
    auth,
    [
      body("school", "School is required!").not().isEmpty(),
      body("degree", "Degree is required!").not().isEmpty(),
      body("fieldOfStudy", "Field of study is required").not().isEmpty(),
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
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    } = req.body;

    //building newExp object to send to DB {school:school}
    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

//@route   DELETE api/profile/education/:edu_id
//@ desc   Delete Education
//@access  private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///@route   GET api/profile/github/:username
//@ desc   get user's repos github
//@access  public
//HTTP call to Github's API using "request"
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubClientSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error.message);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
