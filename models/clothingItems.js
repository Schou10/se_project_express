const  mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required."],
    minlength: 2,
    maxlength: 30

  },
  weather: {
    type: String,
    required: [true, "The weather field is required."],
    validate: {
      validator(value){
        return validator.enum(value);
      },
      message: "You must enter a valid option Hot, Warm, or Cold"
    }

  },
  imageUrl: {
    type: String,
    required: [true, "The imageUrl field is required."],
    validate: {
      validator(value){
        return validator.isURL(value);
      },
      message: "You must enter a valid URL"
    }

  },
  owner: {
    type: String,
    required: true
  },
  likes: {
    type: []
  },
  createdAt: {
    type: String,
    Date: Date.now
  }
});

module.exports = mongoose.model("ClothingItem", clothingItem);