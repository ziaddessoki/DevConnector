const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

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
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exist" }] });
      }

      //Get user avatar
      const avatar = gravatar.url(email, {
        S: 200, //size
        r: "pg", //rating
        d: "robohash", //default, blank user Image
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      //Encrypt password using bcryptjs
      //using Await promise instead of then
      //10 is the recommended number of rounds
      const salt = await bcrypt.genSalt(10);
      //hash password and save it to the user object
      user.password = await bcrypt.hash(password, salt);
      //save user to DB by mongoose
      await user.save();

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
