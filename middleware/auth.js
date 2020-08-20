const jwt = require("jsonwebtoken");
const config = require("config");

//build a middleware function
module.exports = function (req, res, next) {
  // get the token form the header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No Token, access denied" });
  }

  //verify the token if exist(jwt)
  try {
    //decode the token to get user object(user.id)
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //grab user ID, will be used in routes(req.user.id)
    req.user = decoded.user;
    next(); // move with middleware
  } catch (err) {
    res.status(401).json({ msg: "Token not Valid" });
  }
};
