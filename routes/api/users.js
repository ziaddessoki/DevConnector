const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

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
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User Already Exist" }] });
      }

      //Get user avatar

      //Encrypt password

      //Return jsonwebtoken

      res.send("user route");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
