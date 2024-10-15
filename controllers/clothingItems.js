const ClothingItem = require("../models/clothingItems");
const {err400, err404, err500 } = require("../utils/errors")


// GET /items returns all the items
const getItems = (req, res) =>{
  ClothingItem.find({})
    .then((items)=> res.status(200).send(items))
    .catch(()=> res.status(err500.status).send({message: err500.message}))
}

// POST /items creates a new item
const createItem = (req, res) => {
  const {name, weather, imageUrl} =  req.body;
  // Validate incoming data
  if  (!name || !weather || !imageUrl){
    return res.status(err400).send({message: 'All fields are required'});
  }
  // Creates the item in the database
  ClothingItem.create({name,weather,imageUrl, owner: req.user._id})
    .then((item)=> res.status(201).send(item))
    .catch((err)=>{
      if (err.name === "ValidationError"){
        return res.status(err400.status).send({message: err400.message});
      }
      return res.status(err500.status).send({message: err500.message});
    });
}

// DELETE /items/:itemId deletes item with specific id
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => item.remove().then(() => res.status(200).send({ message: 'Item deleted' })))
    .catch((err)=>{
      if (err.name === "DocumentNotFoundError"){
        return res.status(err404.status).send({message: err404.message});
      } if (err.name === "CastError"){
        return res.status(err400.status).send({message: err400.message});
      }
      return res.status(err500.status).send({message: err500.message});
    })
}

module.exports =  { getItems, createItem, deleteItem };
module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
  .orFail()
  .then((like)=> res.status(200).send(like))
  .catch((err)=>{
    if (err.name === "DocumentNotFoundError") {
      res.status(err404.status).send({message: err404.message});
    }
    else if (err.name === 'CastError') {
      res.status(err400.status).send({message: err400.message});
    }
    else{
      res.status(err500.status).send({message: err500.message})
    }

  });
module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)
  .orFail()
  .then((dislike)=> res.status(200).send(dislike))
  .catch((err)=> {
    if (err.name === "DocumentNotFoundError") {
      res.status(err404.status).send({message: err404.message});
    }
    else if (err.name === 'CastError') {
      res.status(err400.status).send({message: err400.message});
    }
    else{
    res.status(err500.status).send({message: err500.message})
    }
  });