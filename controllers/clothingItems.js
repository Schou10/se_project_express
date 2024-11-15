const {BadRequestError, ForbiddenError, NotFoundError} = require('../errors/errors')
const ClothingItem = require("../models/clothingItems");
const {err400, err403 ,err404 } = require("../utils/errors")


// GET /items returns all the items
const getItems = (req, res, next) =>{
  ClothingItem.find({})
    .then((items)=> res.status(200).send(items))
    .catch((err)=> {
      next(err)
    })
}

// POST /items creates a new item
const createItem = (req, res, next) => {
  const {name, weather, imageUrl} =  req.body;
  // Validate incoming data
  if  (!name || !weather || !imageUrl){
    throw new BadRequestError('All fields are required')
  }
  // Creates the item in the database
  return ClothingItem.create({name,weather,imageUrl, owner: req.user._id})
    .then((item)=> res.status(201).send(item))
    .catch((err)=>{
      if (err.name === "ValidationError"){
        throw new BadRequestError(err400.message);
      }
      next(err)
    });
}

// DELETE /items/:itemId deletes item with specific id
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) =>{
      if (item.owner.toString() !== req.user._id){
        throw new ForbiddenError(err403.message);
      }
      return item.remove().then(() => res.status(200).send({ message: 'Item deleted' }))})
    .catch((err)=>{
      if (err.name === "DocumentNotFoundError"){
        throw new NotFoundError(err404.message);
      } if (err.name === "CastError"){
        throw new BadRequestError(err400.message);
      }
      next(err)
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
      throw new NotFoundError(err404.message);
    }
    else if (err.name === 'CastError') {
      throw new BadRequestError(err400.message)
    }
    else{
      next(err)
    }

  });
module.exports.dislikeItem = (req, res, next) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)
  .orFail()
  .then((dislike)=> res.status(200).send(dislike))
  .catch((err)=> {
    if (err.name === "DocumentNotFoundError") {
      throw new NotFoundError(err404.message)
    }
    else if (err.name === 'CastError') {
      throw new BadRequestError(err400.message)
    }
    else{
      next(err)
    }
  });