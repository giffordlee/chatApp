const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
    const token = req.cookies.token
    if (!token) {
      return res.json({ status: false})
    }
    jwt.verify(token, process.env.TOKEN_KEY, async(err, data) => {
      if (err) {
        return res.json({ status: false})
      } else {
        const user = await User.findById(data.id)
        if (user) {
          return res.json({ status: true, user: user.username })
        } else {
          return res.json({ status: false })
        }
      }
    })
}

module.exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
}