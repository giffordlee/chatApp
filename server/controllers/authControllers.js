const User = require("../models/userModel");
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  // try {
  //   const { password, username, createdAt } = req.body;
  //   const existingUser = await User.findOne({ username });
  //   if (existingUser) {
  //     return res.json({ message: "User already exists" });
  //   }
  //   const user = await User.create({ password, username, createdAt });
  //   const token = createSecretToken(user._id);
  //   res.cookie("token", token, {
  //     withCredentials: true,
  //     httpOnly: false,
  //   });
  //   res
  //     .status(201)
  //     .json({ message: "User signed up successfully", success: true, user, token: token});
  //   next();
  // } catch (error) {
  //   console.error(error);
  // }
  const { username,password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({message: 'User exists'});
    // throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: createSecretToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};

module.exports.Login = async (req, res, next) => {
  // try {
  //   const { username, password } = req.body;
  //   if(!username || !password ){
  //     return res.json({message:'All fields are required'})
  //   }
  //   const user = await User.findOne({ username });
  //   if(!user){
  //     return res.json({message:'Incorrect password or username' }) 
  //   }
  //   const auth = await bcrypt.compare(password,user.password)
  //   if (!auth) {
  //     return res.json({message:'Incorrect password or username' }) 
  //   }
  //    const token = createSecretToken(user._id);
  //    res.cookie("token", token, {
  //      withCredentials: true,
  //      httpOnly: false,
  //    });
  //    res.status(201).json({ message: "User logged in successfully", success: true, user, token: token});
  //    next()
  // } catch (error) {
  //   console.error(error);
  // }
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: createSecretToken(user._id),
    });
  } else {
    res.status(401).json({message: "Invalid Email or Password"});
    // throw new Error("Invalid Email or Password");
  }
}

module.exports.searchUsers = async (req, res) => {
  const keyword = req.query.search ? {
    username:{$regex: req.query.search, $options:"i"}
      
  } : {};

  const users = await User.find(keyword).find({_id: {$ne: req.user._id }})
  res.send(users)
}

module.exports.updateUsername = async (req, res) => {
  try {
    const { newUsername, password } = req.body;

    if (!newUsername || !password) {
      return res.status(400).json({ message: "New username and password are required" });
    }
    const oldUsername = req.user.username
    const user = await User.findOne({ username: oldUsername });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Check if the new username is already taken
    const existingUser = await User.findOne({ username: newUsername });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Update the username
    user.username = newUsername;
    await user.save();
    console.log('here', user)
    res.status(200).json({ message: "Username updated successfully", userData: {
      _id: user._id,
      username: user.username,
      token: createSecretToken(user._id),
    } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};