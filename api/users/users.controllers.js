const User = require("../../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
// generate token function which i will call in signup and signin
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
/* Steps to make signup in backEnd 
1. encrypt password before i save it in DB
2. create the user and SAVE his username & password (req.body) in DB 
3. GENERATE Token to user which is like passport now to him to signin into backEnd*/
exports.signup = async (req, res) => {
  try {
    // encrypt the password
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // create new user and save his username & password in DB
    const user = await User.create(req.body);

    // call generateToken function to generate the Token for this user, so i have to send the user for the function
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const user = req.user; //this function wil not apply unless the middleware "local" work
    const token = generateToken(user); // after we catch the user and checked every thing is correct we generate token for him
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
