const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require("../models/users");
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../utils/config");
const {err400, err401, err404, err500} =require("../utils/errors");


// GET /users returns list of users
const getUsers = (req, res) =>{
  User.find({})
    .then((users)=> res.send(users))
    .catch((err)=>{
      console.error(err);
      return res.status(err500.status).send({message: err500.message});
    })
}
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
      if (err.name === "ValidationError"){
        return res.status(err400.status).send({message: err400.message});
      }
      return res.status(err500.status).send({message: err500.message});
    });
}

// GET /user/:userId returns one user that matches the id
const getUser = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(err400.status).send({ message: "Invalid user ID" });
  }
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err)=>{
    if (err.name === "DocumentNotFoundError"){
      return res.status(err404.status).send({message: err404.message});
    } if (err.name === "CastError"){
      return res.status(err400.status).send({message: err400.message});
    }
    return res.status(err500.status).send({message: err500.message});
  });
}

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
  .then((user) => {
    res.status(200).send({
      token: jwt.sign({ _id: user._id }, JWT_SECRET,
      { expiresIn: '7d' }),
    });
  })
    .catch(() => res.status(err401.status).send({ message: err401.message }));
};

const updateUser = (req, res)=>{
    const { userId } = req.params;
    const { name, avatar } = req.body;
    // Validate that the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(err400.status).send({ message: "Invalid user ID" });
    }
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
    } else if (err.name === "ValidationError") {
      return res.status(err400.status).send({ message: "Invalid input data", details: err.message });
    }
    return res.status(err500.status).send({ message: err500.message });
  });
}



module.exports =  { getUsers, createUser, getUser, login, updateUser };