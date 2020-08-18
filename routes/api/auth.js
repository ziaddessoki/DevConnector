const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

//@route GET api/auth
//@ desc Test route
//@access private
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

module.exports = router;
