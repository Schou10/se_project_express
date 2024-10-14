const mongoose = require('mongoose');
const User = require("../models/users");
const {err400, err404, err500} =require("../utils/errors")


// GET /users returns list of users
const getUsers = (req, res) =>{
  User.find({})
    .then((users)=> res.send(users))
    .catch((err)=>{
      console.error(err);
      return res.status(err400.status).send({message: err400.message});
    })
}
// POST /users creates a new user
const createUser = (req, res) => {
  const {name, avatar} = req.body;
  User.create({name, avatar})
    .then((user)=> res.status(201).send(user))
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
  User.findById(userId)
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

module.exports =  { getUsers, createUser, getUser };