const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult } = require("express-validator");

const User = require("../../models/User");

//@route GET api/auth
//@ desc get verified user data
//@access public
//to use the middleware just add the file as a second paramter and route will be protected
router.get("/", auth, async (req, res) => {
  try {
    //since its a protected route n we use the token that has the ID
    //in middleware we set the req.user to the user w/token
    // not returning password in json
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/auth
//@ desc Authenticate user & get token (signIn)
//@access public
router.post(
  "/",
  [
    //adding second paramter for validation by express-validator
    //err message is optional
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Please Enter Password").exists(),
  ],
  async (req, res) => {
    //incase body is not validated
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //400:bad request, send error message
      return res.status(400).json({ errors: errors.array() });
    }

    //destructor
    const { email, password } = req.body;

    try {
      //see if user exists
      //using Await promise instead of then
      let user = await User.findOne({ email });
      if (!user) {
        //   if the user DONT exist send bad request with message
        return res
          .status(400)
          .json({ errors: [{ msg: "Account Don't Exist" }] });
      }

      //compare between password entered by user and the encrypted password in the DB
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res.status(400).json({ errors: [{ msg: "Wrong Password" }] });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          //get mongoId
          id: user.id,
        },
      };
      //Generate a token(encoding user.id) that will be used to access authenticated routes
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        //exp. is optional
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //   res.send("user registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
