const ClothingItem = require("../models/clothingItems");
const {err400, err404, err500 } = require("../utils/errors")
const mongoose = require('mongoose');

// GET /items returns all the items
const getItems = (req, res) =>{
  console.log(req);
  console.log(req.body);
  ClothingItem.find({})
    .then((items)=> res.status(200).send(items))
    .catch((err)=>{
      console.error(err);
      return res.status(err500.status).send(err500.message);
    })
}

//POST /items creates a new item
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const {name, weather, imageURL} =  req.body;
  //Validate incoming data
  if  (!name || !weather || !imageURL){
    return res.status(err400).send({message: 'All fields are required'});
  }
  // Creates the item in the database
  ClothingItem.create({name,weather,imageURL})
    .then((item)=> res.status(201).res.send(item))
    .catch((err)=>{
      if (err.name === "DocumentNotFoundError"){
        return res.status(err404.status).send(err404.message, err);
      }else if (err.name === "CastError"){
        return res.status(err400.status).send(err400.message, err);
      }
      return res.status(err500.status).send(err500.message, err);
    });
}

//DELETE /items/:itemId deletes item with specific id
const deleteItem = (res, req) => {
  console.log(req);
  console.log(req.body);
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) =>{
      return item.remove().then(() => res.status(200).send({ message: 'Item deleted' }));
    })
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

//PUT update item
const updateItem = (req, res) => {
  const {itemId} = req.params;
  const {imageURL} = req.body;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(err400.status).send({ message: "Invalid item ID" });
  }
  ClothingItem.findByIdAndUpdate(itemId, {$set: {imageUrl}})
    .orFail()
    .then((item)=>{res.status(200).send(item)})
    .catch((err)=>{
      return res.status(err500.status).send(err500.message, err);
    })
}

module.exports =  { getItems, createItem, deleteItem };
module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
//...

module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)