const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const {err400, err401, err404, err409, err500} =require("../utils/errors");


// POST /users creates a new user
const createUser = (req, res) => {
  const {name, avatar, email, password} = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({name, avatar, email, password: hash}))
  .then((user)=> res.status(201).send({
    _id: user._id,
    email: user.email,
  }))
  .catch((err)=>{
    if(err.code === 11000){
      return res.status(err409.status).send({message: err409.message})
    }
    if (err.name === "ValidationError"){
      return res.status(err400.status).send({message: err400.message});
    }
    return res.status(err500.status).send({message: err500.message});
  });
}


// Post /signin login
const login = (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(err400).send({message: err400.message});
  }
  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET,
      { expiresIn: '7d' })
    res.status(200).send({
      token: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    });
  })
    .catch((err) => {
      if (err.message === "Incorrect password or email"){
        return res.status(err401.status).send({ message: err401.message })
      }
      return res.status(err500.status).send({ message: err500.message })
    });
};
// PATCH
const updateUser = (req, res)=>{
    const  userId  = req.user._id;
    const { name, avatar } = req.body;
    // Validate that both name and avatar are provided
    if (!name || !avatar) {
      return res.status(err400.status).send({ message: "Both name and avatar fields are required" });
    }
    // Find user by ID and update name and avatar
    return User.findByIdAndUpdate(
      userId,
      { name, avatar },  // Only update name and avatar
      { new: true, runValidators: true }  // Return the updated document, run validators
    )
    .orFail()
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch ((err) => {
      if (err.message === "DocumentNotFoundError") {
      return res.status(err404.status).send({ message: "User not found" });
    } if (err.name === "ValidationError") {
      return res.status(err400.status).send({ message: "Invalid input data", details: err.message });
    }
    return res.status(err500.status).send({ message: err500.message });
  });
}

// GET Current User
const getCurrentUser = (req, res)=> {
  const  userId  = req.user._id;
  if(!userId){
    return res.status(err404.status).send({message: err404.message })
  }
  return User.findById(userId)
  .orFail()
  .then((user)=> res.status(200).send(user))
  .catch((err)=>{
    if (err.name === "ValidationError"){
      return res.status(err400.status).send({message: err400.message});
    }
    return res.status(err500.status).send({message: err500.message});
  });
}

module.exports =  {  createUser,  login, updateUser, getCurrentUser };