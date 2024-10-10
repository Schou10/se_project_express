const ClothingItem = require("../models/clothingItems");
const {err400, err404, err500 } = require("../utils/errors")
// GET /users

const getItems = (req, res) =>{
  console.log(req);
  console.log(req.body);
  ClothingItem.find({})
    .then((items)=> res.send(items))
    .catch((err)=>{
      console.error(err);
      return res.status(500).send({message: "Requested resource not found"});
    })
}

//POST /items creates a new item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const {name, weather, imageURL} =  req.body;
  ClothingItem.create({name,weather,imageURL})
    .then((item=>{
      console.log(item);
      res.send(item);
  }))
  .catch((err)=>{
    if (err.name === "DocumentNotFoundError"){
      return res.status(err404.status).send(err404.message, err);
    }else if (err.name === "CastError"){
      return res.status(err400.status).send(err400.message, err);
    }
    return res.status(err500.status).send(err500.message, err);
    res.status(err500.status).send(err500.message, err);
  });
}

//DELETE /items/:itemId deletes item with specific id
const deleteItem = (res, req) => {
  console.log(req);
  console.log(req.body);
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .then((item) => res.status(200).send(item))
    .catch((err)=>{
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError"){
        return res.status(err404.status).send(err404.message, err);
      }else if (err.name === "CastError"){
        return res.status(err400.status).send(err400.message, err);
      }
      return res.status(err500.status).send(err500.message, err);
    })
}

module.exports =  { getItems, createItem, deleteItem };