const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

// UserSchema
const User = require("../../models/User");

//@route POST api/users
//@ desc Register User
//@access public
router.post(
  "/",
  [
    //adding second paramater for validation by express-validator
    //err message is optional
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password: 6 char or more!!").isLength({ min: 6 }),
  ],
  async (req, res) => {
    //incase body is not validated
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //400:bad request, send error message
      return res.status(400).json({ errors: errors.array() });
    }

    //destructor
    const { name, email, password } = req.body;

    try {
      //see if user exists
      //using Await promise instead of then
      let user = await User.findOne({ email });
      if (user) {
        //   if the user exist send bad request with message
        res.status(400).json({ errors: [{ msg: "User Already Exist" }] });
      }

      //Get user avatar
      const avatar = gravatar.url(email, {
        S: 200, //size
        r: pg, //rating
        d: mm, //default, blank user Image
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      //Encrypt password using bcryptjs
      //using Await promise instead of then
      const salt = await bcrypt.genSalt(10);
      //hash password and save it to the user object
      user.password = await bcrypt.hash(password, salt);
      //save user to DB
      await user.save();
      //Return jsonwebtoken

      res.send("user registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;