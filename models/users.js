const  mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlegnth: 30
  },
  avata: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value){
        return validator.isURL(value);
      },
      message: "You must enter a valid URL"
    }
  }
});

modules.exports = mongoose.model("users", userSchema);