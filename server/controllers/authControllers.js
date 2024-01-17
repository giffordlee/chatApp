const User = require("../models/userModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user, token: token});
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if(!username || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ username });
    if(!user){
      return res.json({message:'Incorrect password or username' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or username' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true, user, token: token});
     next()
  } catch (error) {
    console.error(error);
  }
}

module.exports.searchUsers = async (req, res) => {
  const keyword = req.query.search ? {
    username:{$regex: req.query.search, $options:"i"}
      
  } : {};

  const users = await User.find(keyword).find({_id: {$ne: req.user._id }})
  res.send(users)
}