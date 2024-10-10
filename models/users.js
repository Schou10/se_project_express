const  mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:  [true, "The name field is required."],
    minlength: 2,
    maxlegnth: 30
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value){
        return validator.isURL(value);
      },
      message: "You must enter a valid URL."
    }
  }
});
const User = mongoose.model("users", userSchema);
module.exports = User;