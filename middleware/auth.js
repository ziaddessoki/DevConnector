const jwt = require("jsonwebtoken");
const config = require("config");

//build a middleware function
module.exports = function (req, res, next) {
  // get the token form the header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res.status(401).json({ meg: "No Token, access denied" });
  }
};
