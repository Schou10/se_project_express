const { get } = require("mongoose");
const user = require("../models/users");
const {err400, err404, err500} =require("../utils/errors")

// GET /users returns list of users
const getUsers = (req, res) =>{
  console.log("Getting Users");
  user.find({})
    .then((users)=> res.send(users))
    .catch((err)=>{
      console.error(err);
      return res.status(error.status).send(error.message);
    })
}
//POST /users creates a new user
const createUser = (req, res) => {
  console.log("Creating new User");
  const {name, avatar} = req.body;
  console.log(name, avatar)
  user.create({name, avatar})
    .then((user)=>{
      res.status(201).send(user);
    })
    .catch((err)=>{
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError"){
        return res.status(err404.status).send(err404.message, err);
      }
      return res.status(err400.status).send(err400.message, err);
    });
}

//GET /user/:userId returns one user that matches the id
const getUser = (req, res) => {
  const { userId } = req.params;
  user.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err)=>{
    console.error(err);
    console.log(err.name);
    if (err.name === "DocumentNotFoundError"){
      return res.status(err404.status).send(err404.message, err);
    }else if (err.name === "CastError"){
      return res.status(err400.status).send(err400.message, err);
    }
    return res.status(err500.status).send(err500.message, err);
  });


}

module.exports =  { getUsers, createUser, getUser };