const router = require("express").Router();
const {createUser, login,} = require("../controllers/users");
const {validateSignin, validateUserBody} = require('../middlewares/validation')

// Route to login
router.post("/signin", validateSignin ,login);

// Route to create new user
router.post("/signup", validateUserBody, createUser);

module.exports = router;